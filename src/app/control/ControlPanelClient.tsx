"use client";

import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { ClockCard } from '@/components/control/ClockCard';
import { ScoreCard } from '@/components/control/ScoreCard';
import { QuarterPossessionCard } from '@/components/control/QuarterPossessionCard';
import { TimeoutsCard } from '@/components/control/TimeoutsCard';
import { TournamentCard } from '@/components/control/TournamentCard';
import { ActionsCard } from '@/components/control/ActionsCard';
import { Activity } from 'lucide-react';

export default function ControlPanelClient({ token }: { token: string }) {
    const { state, updateState, isConnected } = useGameState(token);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'q': updateState({ homeScore: Math.max(0, state.homeScore + 1) }); break;
                case 'w': updateState({ homeScore: Math.max(0, state.homeScore + 2) }); break;
                case 'e': updateState({ homeScore: Math.max(0, state.homeScore + 3) }); break;
                case 'z': updateState({ homeScore: Math.max(0, state.homeScore - 1) }); break;

                case 'p': updateState({ awayScore: Math.max(0, state.awayScore + 1) }); break;
                case 'o': updateState({ awayScore: Math.max(0, state.awayScore + 2) }); break;
                case 'i': updateState({ awayScore: Math.max(0, state.awayScore + 3) }); break;
                case 'm': updateState({ awayScore: Math.max(0, state.awayScore - 1) }); break;

                case ' ': // spacebar toggles both clocks
                    e.preventDefault();
                    updateState({
                        clockRunning: !state.clockRunning,
                        shotClockRunning: !state.shotClockRunning
                    });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.homeScore, state.awayScore, state.clockRunning, state.shotClockRunning, updateState]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-6 font-sans">
            <div className="max-w-[1200px] gap-6 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px]">
                {/* Left Column - Main Controls */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <h1 className="text-xl font-bold uppercase tracking-widest text-[#fbbf24]">Scoreboard Control</h1>

                        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            <Activity size={14} className={isConnected ? "animate-pulse" : ""} />
                            {isConnected ? "LIVE SYNC" : "DISCONNECTED"}
                        </div>
                    </div>

                    <ClockCard />
                    <ScoreCard />
                    <QuarterPossessionCard />
                    <TimeoutsCard />
                </div>

                {/* Right Column - Secondary Controls */}
                <div className="flex flex-col gap-6">
                    <ActionsCard />
                    <TournamentCard />
                </div>
            </div>
        </div>
    );
}
