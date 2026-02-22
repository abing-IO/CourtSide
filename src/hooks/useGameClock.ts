import { useState, useEffect, useRef } from 'react';
import { GameState } from '@/lib/state';

export function useGameClock(state: GameState, onZero?: (cSecs: number, sSecs: number) => void) {
    const [clockSeconds, setClockSeconds] = useState(state.clockSeconds);
    const [shotClockSeconds, setShotClockSeconds] = useState(state.shotClockSeconds);

    const onZeroRef = useRef(onZero);
    useEffect(() => {
        onZeroRef.current = onZero;
    }, [onZero]);

    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Sync internal state when the master server state jumps (e.g. on initial socket connection)
    useEffect(() => {
        setClockSeconds(state.clockSeconds);
    }, [state.clockSeconds]);

    useEffect(() => {
        setShotClockSeconds(state.shotClockSeconds);
    }, [state.shotClockSeconds]);

    useEffect(() => {
        // Calculate the difference between our local machine time and the server's actual time
        // This ensures the client side calculations are perfectly synced even if the client's system clock is wrong
        const timeDelta = Date.now() - state.serverTime;

        let animationFrameId: number;

        const loop = () => {
            const now = Date.now();
            const syncedNow = now - timeDelta;

            let isZero = false;
            let currentClock = state.clockSeconds;
            let currentShot = state.shotClockSeconds;

            if (state.clockRunning) {
                // How many actual milliseconds have passed since the server told us the clock started?
                const elapsedSinceUpdate = syncedNow - state.clockUpdateAt;
                const elapsedSeconds = Math.floor(elapsedSinceUpdate / 1000);
                currentClock = Math.max(0, state.clockSeconds - elapsedSeconds);
                setClockSeconds(currentClock);
                if (currentClock <= 0) isZero = true;
            } else {
                setClockSeconds(state.clockSeconds);
            }

            if (state.shotClockRunning) {
                const elapsedSinceUpdate = syncedNow - state.shotClockUpdateAt;
                const elapsedSeconds = Math.floor(elapsedSinceUpdate / 1000);
                currentShot = Math.max(0, state.shotClockSeconds - elapsedSeconds);
                setShotClockSeconds(currentShot);
                if (currentShot <= 0) isZero = true;
            } else {
                setShotClockSeconds(state.shotClockSeconds);
            }

            if (isZero && onZeroRef.current) {
                onZeroRef.current(currentClock, currentShot);
                return; // Stop the loop for this frame if we zeroed out
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

    // Force an absolutely precise calculation of the current time on demand, completely bypassing any React closure/state lag
    const getLiveClocks = () => {
        const currentState = stateRef.current;
        const timeDelta = Date.now() - currentState.serverTime;
        const syncedNow = Date.now() - timeDelta;

        let c = currentState.clockSeconds;
        if (currentState.clockRunning) {
            const elapsed = Math.floor((syncedNow - currentState.clockUpdateAt) / 1000);
            c = Math.max(0, currentState.clockSeconds - elapsed);
        }

        let s = currentState.shotClockSeconds;
        if (currentState.shotClockRunning) {
            const elapsed = Math.floor((syncedNow - currentState.shotClockUpdateAt) / 1000);
            s = Math.max(0, currentState.shotClockSeconds - elapsed);
        }

        return { c, s };
    };

    return { clockSeconds, shotClockSeconds, getLiveClocks };
}
