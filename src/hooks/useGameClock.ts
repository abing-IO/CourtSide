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
        let hasZeroFired = false;  // Prevent double-fire within the same effect cycle

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

            if (isZero && !hasZeroFired && onZeroRef.current) {
                hasZeroFired = true;  // Lock out further onZero calls until the effect restarts
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

    // Calculate the precise current clock values on demand
    // NOTE: We use Date.now() directly here (not the timeDelta sync approach from the RAF loop).
    // The timeDelta approach only works in the animation loop because timeDelta is captured ONCE
    // and then `now` advances over frames. Here, both would be computed at the same instant,
    // causing them to cancel out (syncedNow would always equal serverTime, giving elapsed = 0).
    const getLiveClocks = () => {
        const currentState = stateRef.current;
        const now = Date.now();

        let c = currentState.clockSeconds;
        if (currentState.clockRunning) {
            const elapsed = Math.floor((now - currentState.clockUpdateAt) / 1000);
            c = Math.max(0, currentState.clockSeconds - elapsed);
        }

        let s = currentState.shotClockSeconds;
        if (currentState.shotClockRunning) {
            const elapsed = Math.floor((now - currentState.shotClockUpdateAt) / 1000);
            s = Math.max(0, currentState.shotClockSeconds - elapsed);
        }

        return { c, s };
    };

    return { clockSeconds, shotClockSeconds, getLiveClocks };
}
