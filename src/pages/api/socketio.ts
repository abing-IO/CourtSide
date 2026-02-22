import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';
import { defaultState, GameState } from '@/lib/state';

import { supabase } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Global in-memory state (persists as long as the Next.js dev server runs)
let globalGameState: GameState = { ...defaultState };
let isStateLoaded = false;

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

    // Load initial state from Database ONCE
    if (!isStateLoaded) {
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
      isStateLoaded = true;
    }

    // @ts-expect-error - Custom property assignment
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      // Send the current state immediately when a client connects
      socket.emit('state-update', globalGameState);

      // Handle raw state request
      socket.on('request-state', () => {
        socket.emit('state-update', globalGameState);
      });

      // Handle state updates from control panel
      socket.on('update-state', (partialState: Partial<GameState>) => {
        // Stamp the update time whenever clock start/stop states change
        if (
          partialState.clockRunning !== undefined ||
          partialState.clockSeconds !== undefined
        ) {
          partialState.clockUpdateAt = Date.now();
        }

        if (
          partialState.shotClockRunning !== undefined ||
          partialState.shotClockSeconds !== undefined
        ) {
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
    });

    // @ts-expect-error - Storing io instance on the response socket server
    res.socket.server.io = io;
  }

  res.end();
}
