"use client";

import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';

export default function HalftimeDisplay() {
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

            <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-[90vw] gap-[6vmin]">

                {/* Tournament Header */}
                {(state.tournamentName || state.tournamentLogo) && (
                    <div className="flex flex-col items-center gap-[2vmin] mb-[2vmin]">
                        {state.tournamentLogo && (
                            <img src={state.tournamentLogo} alt="Logo" className="w-[12vmin] h-[12vmin] object-contain drop-shadow-[0_0_2vmin_rgba(255,255,255,0.2)]" />
                        )}
                        <div className="font-extrabold text-[4vmin] tracking-[0.35em] text-sb-text uppercase text-center">
                            {state.tournamentName}
                        </div>
                    </div>
                )}

                <h1 className="font-display text-[24vmin] leading-none text-[#fbbf24] tracking-[0.05em] drop-shadow-[0_0_4vmin_rgba(251,191,36,0.3)] select-none">
                    HALFTIME
                </h1>

                <div className="w-[15vmin] h-[0.5vmin] bg-sb-text-sec rounded-full my-[2vmin]" />

                {/* Current Score */}
                <div className="flex items-center justify-center w-full gap-[6vmin]">
                    <div className="flex-1 flex flex-col items-end gap-[1vmin]">
                        <div className="font-display text-[7vmin] tracking-[0.08em] text-sb-text uppercase text-right leading-tight">
                            {state.homeName}
                        </div>
                        <div className="h-[0.8vmin] w-[12vmin] rounded-full" style={{ background: state.homeColor, boxShadow: `0 0 2vmin ${state.homeColor}66` }} />
                    </div>

                    <div className="flex items-center justify-center gap-[4vmin] shrink-0">
                        <div className="font-display text-[20vmin] leading-none tabular-nums text-sb-text">{state.homeScore}</div>
                        <div className="font-display text-[8vmin] text-sb-text-dim">—</div>
                        <div className="font-display text-[20vmin] leading-none tabular-nums text-sb-text">{state.awayScore}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-start gap-[1vmin]">
                        <div className="font-display text-[7vmin] tracking-[0.08em] text-sb-text uppercase text-left leading-tight">
                            {state.awayName}
                        </div>
                        <div className="h-[0.8vmin] w-[12vmin] rounded-full" style={{ background: state.awayColor, boxShadow: `0 0 2vmin ${state.awayColor}66` }} />
                    </div>
                </div>

                {/* Animated Bars */}
                <div className="flex gap-[1.5vmin] mt-[8vmin]">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-[1vmin] h-[4vmin] bg-sb-text-dim rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>

            </main>
        </div>
    );
}
