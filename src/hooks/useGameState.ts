"use client";

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, defaultState } from '@/lib/state';

export function useGameState() {
    const [state, setState] = useState<GameState>(defaultState);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to the Socket.io server (running in API route)
        const socketIo = io({
            path: '/api/socketio'
        });

        socketIo.on('connect', () => {
            setIsConnected(true);
            socketIo.emit('request-state'); // Request initial state on connect
        });

        socketIo.on('disconnect', () => {
            setIsConnected(false);
        });

        socketIo.on('state-update', (newState: GameState) => {
            setState(newState);
        });

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, []);

    const updateState = useCallback((partialState: Partial<GameState>) => {
        if (socket) {
            socket.emit('update-state', partialState);
        }
    }, [socket]);

    return { state, updateState, isConnected };
}
