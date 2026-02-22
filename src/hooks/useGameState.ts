"use client";

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, defaultState } from '@/lib/state';

// Global Singleton: Ensure only ONE socket connection exists for the entire browser tab
let globalSocket: Socket | null = null;
let globalStateCache: GameState = defaultState;
let globalIsConnected = false;

// Array of subscriber functions to update all components simultaneously
const subscribers = new Set<(state: GameState, isConnected: boolean) => void>();

let globalToken = '';

export function useGameState(token?: string) {
    if (token) {
        globalToken = token;
    }

    const [state, setState] = useState<GameState>(globalStateCache);
    const [isConnected, setIsConnected] = useState(globalIsConnected);

    useEffect(() => {
        // 1. Initialize the global socket ONLY ONCE per browser tab
        if (!globalSocket) {
            globalSocket = io({
                path: '/api/socketio'
            });

            globalSocket.on('connect', () => {
                globalIsConnected = true;
                globalSocket?.emit('request-state');
                subscribers.forEach(notify => notify(globalStateCache, true));
            });

            globalSocket.on('disconnect', () => {
                globalIsConnected = false;
                subscribers.forEach(notify => notify(globalStateCache, false));
            });

            globalSocket.on('state-update', (newState: GameState) => {
                globalStateCache = newState;
                subscribers.forEach(notify => notify(newState, globalIsConnected));
            });
        }

        // 2. Subscribe this specific React component to the global updates
        const notify = (newState: GameState, connected: boolean) => {
            setState(newState);
            setIsConnected(connected);
        };

        subscribers.add(notify);

        // Notify immediately if already connected
        notify(globalStateCache, globalIsConnected);

        // 3. Cleanup subscription when this specific component unmounts
        return () => {
            subscribers.delete(notify);
        };
    }, []);

    const updateState = useCallback((partialState: Partial<GameState>) => {
        if (globalSocket) {
            globalSocket.emit('update-state', { state: partialState, token: globalToken });
        }
    }, []);

    return { state, updateState, isConnected };
}
