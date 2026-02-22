import { useState, useEffect } from 'react';
import { GameState } from '@/lib/state';

export function useGameClock(state: GameState) {
    const [clockSeconds, setClockSeconds] = useState(state.clockSeconds);
    const [shotClockSeconds, setShotClockSeconds] = useState(state.shotClockSeconds);

    useEffect(() => {
        // Calculate the difference between our local machine time and the server's actual time
        // This ensures the client side calculations are perfectly synced even if the client's system clock is wrong
        const timeDelta = Date.now() - state.serverTime;

        let animationFrameId: number;

        const loop = () => {
            const now = Date.now();
            const syncedNow = now - timeDelta;

            if (state.clockRunning) {
                // How many actual milliseconds have passed since the server told us the clock started?
                const elapsedSinceUpdate = syncedNow - state.clockUpdateAt;
                const elapsedSeconds = Math.floor(elapsedSinceUpdate / 1000);
                setClockSeconds(Math.max(0, state.clockSeconds - elapsedSeconds));
            } else {
                setClockSeconds(state.clockSeconds);
            }

            if (state.shotClockRunning) {
                const elapsedSinceUpdate = syncedNow - state.shotClockUpdateAt;
                const elapsedSeconds = Math.floor(elapsedSinceUpdate / 1000);
                setShotClockSeconds(Math.max(0, state.shotClockSeconds - elapsedSeconds));
            } else {
                setShotClockSeconds(state.shotClockSeconds);
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [
        state.clockSeconds,
        state.shotClockSeconds,
        state.clockRunning,
        state.shotClockRunning,
        state.clockUpdateAt,
        state.shotClockUpdateAt,
        state.serverTime
    ]);

    return { clockSeconds, shotClockSeconds };
}
