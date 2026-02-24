import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';
import { defaultState, GameState } from '@/lib/state';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Server-side Supabase client — prefer service role key for full write access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Global in-memory state (persists as long as the Next.js dev server runs)
let globalGameState: GameState = { ...defaultState };

// Helper to save state to Supabase without blocking the Socket
const saveStateToSupabase = async (state: GameState) => {
  try {
    await supabase.from('game_state').update({ state, updated_at: new Date().toISOString() }).eq('id', 1);
  } catch (error) {
    console.error('Failed to save state to Supabase:', error);
  }
};

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-expect-error - Next.js types don't include the nested server.io object
  if (!res.socket.server.io) {
    console.log('Starting Socket.io Server...');

    // Load initial state from Database ONCE (tied to io instance, safe across hot reloads)
    try {
      const { data, error } = await supabase.from('game_state').select('state').eq('id', 1).single();
      if (data?.state && Object.keys(data.state).length > 0) {
        // Merge the DB state into default state to ensure all new properties exist
        globalGameState = { ...defaultState, ...data.state };
        console.log('Loaded GameState from Supabase.');
      } else {
        console.log('No existing GameState found, using defaults.');
        // Initialize the DB row with defaults if it's empty
        saveStateToSupabase(globalGameState);
      }
    } catch (err) {
      console.error('Error fetching initial state:', err);
    }

    // @ts-expect-error - Custom property assignment
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    // Rate Limiting & Auth State
    const rateLimits = new Map<string, number[]>();
    const MAX_EVENTS_PER_SECOND = 10;
    const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '';

    io.on('connection', (socket) => {
      // Helper function to calculate current live state on the fly for late joiners
      const getLiveState = () => {
        const liveState = { ...globalGameState };
        const now = Date.now();

        if (liveState.clockRunning) {
          const elapsed = Math.floor((now - liveState.clockUpdateAt) / 1000);
          liveState.clockSeconds = Math.max(0, liveState.clockSeconds - elapsed);
          liveState.clockUpdateAt = now; // Pretend it just started for this client
        }

        if (liveState.shotClockRunning) {
          const elapsed = Math.floor((now - liveState.shotClockUpdateAt) / 1000);
          liveState.shotClockSeconds = Math.max(0, liveState.shotClockSeconds - elapsed);
          liveState.shotClockUpdateAt = now;
        }

        liveState.serverTime = now;
        return liveState;
      };

      // Send the current live calculated state immediately when a client connects
      socket.emit('state-update', getLiveState());

      // Handle raw state request
      socket.on('request-state', () => {
        socket.emit('state-update', getLiveState());
      });

      // Handle state updates from control panel (NOW SECURED)
      socket.on('update-state', (payload: { state: Partial<GameState>, token?: string }) => {
        // 1. Authentication Check (accept per-event token OR handshake auth token)
        const eventToken = payload.token || (socket.handshake.auth as { token?: string })?.token;
        if (ADMIN_PASSCODE && eventToken !== ADMIN_PASSCODE) {
          console.warn(`Blocked unauthorized state update from ${socket.id}`);
          return;
        }

        // 2. Rate Limiting Check (DDoS Prevention)
        const now = Date.now();
        const clientHistory = rateLimits.get(socket.id) || [];
        // Keep only events from the last 1000ms
        const recentEvents = clientHistory.filter(time => now - time < 1000);

        if (recentEvents.length >= MAX_EVENTS_PER_SECOND) {
          console.warn(`Rate limit exceeded for ${socket.id}. Dropping update.`);
          return;
        }

        // Record this event
        recentEvents.push(now);
        rateLimits.set(socket.id, recentEvents);

        const partialState = payload.state;

        // Stamp the update time ONLY when a clock STARTS running, or when seconds are manually set
        // CRITICAL: Do NOT re-stamp on pause — the committed clockSeconds is the final value
        if (partialState.clockRunning === true) {
          // Clock is starting — stamp so clients can calculate elapsed time
          partialState.clockUpdateAt = Date.now();
        } else if (partialState.clockSeconds !== undefined && !('clockRunning' in partialState)) {
          // Manual time edit (no running state change) — stamp for late joiners
          partialState.clockUpdateAt = Date.now();
        }

        if (partialState.shotClockRunning === true) {
          partialState.shotClockUpdateAt = Date.now();
        } else if (partialState.shotClockSeconds !== undefined && !('shotClockRunning' in partialState)) {
          partialState.shotClockUpdateAt = Date.now();
        }

        // Always stamp the current server time for sync purposes
        partialState.serverTime = Date.now();

        // Merge the new state
        globalGameState = { ...globalGameState, ...partialState };

        // Broadcast to ALL clients
        io.emit('state-update', globalGameState);

        // Fire-and-forget save to Database
        saveStateToSupabase(globalGameState);
      });

      // Cleanup rate limits on disconnect
      socket.on('disconnect', () => {
        rateLimits.delete(socket.id);
      });
    });

    // @ts-expect-error - Storing io instance on the response socket server
    res.socket.server.io = io;
  }

  res.end();
}
