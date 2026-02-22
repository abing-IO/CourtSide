"use client";

import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function FulltimeDisplay() {
    const { state } = useGameState();

    // Apply light/dark theme
    useEffect(() => {
        if (state.displayTheme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    }, [state.displayTheme]);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-sb-bg text-sb-text overflow-hidden relative font-sans">

            {/* Background Gradients */}
            <div
                className="absolute inset-0 opacity-20 transition-opacity duration-1000"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 30% 0%, ${state.homeColor} 0%, transparent 60%),
            radial-gradient(circle at 70% 100%, ${state.awayColor} 0%, transparent 60%)
          `
                }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4vmin_4vmin] pointer-events-none" />

            <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-[90vw] gap-[4vmin]">

                {/* Tournament Header */}
                {(state.tournamentName || state.tournamentLogo) && (
                    <div className="flex flex-col items-center gap-[2vmin]">
                        {state.tournamentLogo && (
                            <img src={state.tournamentLogo} alt="Logo" className="w-[10vmin] h-[10vmin] object-contain drop-shadow-[0_0_2vmin_rgba(255,255,255,0.2)]" />
                        )}
                        <div className="font-extrabold text-[3.5vmin] tracking-[0.35em] text-sb-text uppercase text-center">
                            {state.tournamentName}
                        </div>
                    </div>
                )}

                <h1 className="font-display text-[16vmin] leading-none text-[#fbbf24] tracking-[0.05em] drop-shadow-[0_0_4vmin_rgba(251,191,36,0.3)] select-none">
                    FULL TIME
                </h1>

                <div className="font-display text-[2.5vmin] tracking-[0.2em] text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/20 px-[3vmin] py-[0.5vmin] rounded-[1vmin] drop-shadow-[0_0_1.5vmin_rgba(251,191,36,0.3)]">
                    {state.quarter} — FINAL
                </div>

                {/* Final Score */}
                <div className="flex items-center justify-center w-full gap-[6vmin] my-[2vmin]">
                    <div className="flex-1 flex flex-col items-end gap-[1vmin]">
                        <div className={`font-display text-[5vmin] tracking-[0.08em] uppercase text-right leading-tight ${state.homeScore > state.awayScore ? 'text-sb-text font-bold' : 'text-sb-text-sec'}`}>
                            {state.homeName}
                        </div>
                        <div className="h-[0.8vmin] w-[12vmin] rounded-full" style={{ background: state.homeColor, boxShadow: `0 0 2vmin ${state.homeColor}66` }} />
                    </div>

                    <div className="flex items-center justify-center gap-[4vmin] shrink-0">
                        <div className={`font-display text-[18vmin] leading-none tabular-nums ${state.homeScore > state.awayScore ? 'text-sb-text drop-shadow-[0_0_3vmin_rgba(255,255,255,0.2)]' : 'text-sb-text-dim'}`}>
                            {state.homeScore}
                        </div>
                        <div className="font-display text-[6vmin] text-sb-text-dim">—</div>
                        <div className={`font-display text-[18vmin] leading-none tabular-nums ${state.awayScore > state.homeScore ? 'text-sb-text drop-shadow-[0_0_3vmin_rgba(255,255,255,0.2)]' : 'text-sb-text-dim'}`}>
                            {state.awayScore}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-start gap-[1vmin]">
                        <div className={`font-display text-[5vmin] tracking-[0.08em] uppercase text-left leading-tight ${state.awayScore > state.homeScore ? 'text-sb-text font-bold' : 'text-sb-text-sec'}`}>
                            {state.awayName}
                        </div>
                        <div className="h-[0.8vmin] w-[12vmin] rounded-full" style={{ background: state.awayColor, boxShadow: `0 0 2vmin ${state.awayColor}66` }} />
                    </div>
                </div>

                <div className="w-[10vmin] h-[0.5vmin] bg-sb-text-dim rounded-full my-[1vmin]" />

                {/* Next Match */}
                {(state.nextMatchHome && state.nextMatchAway) && (
                    <div className="flex flex-col items-center gap-[1vmin] mt-[2vmin] bg-black/20 px-[6vmin] py-[3vmin] rounded-2xl border border-white/5">
                        <div className="font-extrabold text-[2.5vmin] tracking-[0.3em] text-sb-text-sec uppercase">
                            NEXT MATCH
                        </div>
                        <div className="font-display text-[4vmin] tracking-[0.1em] text-sb-text uppercase">
                            {state.nextMatchHome} VS {state.nextMatchAway}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
