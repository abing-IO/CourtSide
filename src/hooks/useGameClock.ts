import { useState, useEffect, useRef } from 'react';
import { GameState } from '@/lib/state';

export function useGameClock(state: GameState) {
    const [clockSeconds, setClockSeconds] = useState(state.clockSeconds);
    const [shotClockSeconds, setShotClockSeconds] = useState(state.shotClockSeconds);

    // Keep track of the server state continuously
    useEffect(() => {
        setClockSeconds(state.clockSeconds);
        setShotClockSeconds(state.shotClockSeconds);

        if (!state.clockRunning && !state.shotClockRunning) return;

        let animationFrameId: number;
        let lastTime = Date.now();
        let gameAccumulator = 0;
        let shotAccumulator = 0;

        const loop = () => {
            const now = Date.now();
            const dt = now - lastTime;
            lastTime = now;

            if (state.clockRunning) {
                gameAccumulator += dt;
                if (gameAccumulator >= 1000) {
                    const ticks = Math.floor(gameAccumulator / 1000);
                    gameAccumulator -= ticks * 1000;
                    setClockSeconds(prev => Math.max(0, prev - ticks));
                }
            }

            if (state.shotClockRunning) {
                shotAccumulator += dt;
                if (shotAccumulator >= 1000) {
                    const ticks = Math.floor(shotAccumulator / 1000);
                    shotAccumulator -= ticks * 1000;
                    setShotClockSeconds(prev => Math.max(0, prev - ticks));
                }
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [state.clockSeconds, state.shotClockSeconds, state.clockRunning, state.shotClockRunning]);

    return { clockSeconds, shotClockSeconds };
}
