"use client";

import { useEffect, useState, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/lib/utils';

const CIRCUMFERENCE = 2 * Math.PI * 18;
const RING_THRESHOLD = 1800; // 30 mins

export default function CountdownDisplay() {
    const { state } = useGameState();
    const [remaining, setRemaining] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);

    // Apply light/dark theme
    useEffect(() => {
        if (state.displayTheme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    }, [state.displayTheme]);

    // Timer Tick
    useEffect(() => {
        if (!state.countdownTarget) {
            setRemaining(null);
            setFinished(false);
            return;
        }

        const targetTime = new Date(state.countdownTarget).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, Math.ceil((targetTime - now) / 1000));

            setRemaining(diff);
            if (diff <= 0) {
                setFinished(true);
                clearInterval(interval);
            } else {
                setFinished(false);
            }
        }, 1000);

        // Initial tick
        const diff = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
        setRemaining(diff);
        if (diff <= 0) setFinished(true);

        return () => clearInterval(interval);
    }, [state.countdownTarget]);

    // Display Fallbacks for Names/Colors
    const homeName = state.nextMatchHome || state.countdownHomeName || state.homeName || 'HOME';
    const awayName = state.nextMatchAway || state.countdownAwayName || state.awayName || 'AWAY';
    const homeColor = state.countdownHomeColor || state.homeColor || '#3b82f6';
    const awayColor = state.countdownAwayColor || state.awayColor || '#ef4444';

    const formatTime = (totalSec: number) => {
        if (totalSec <= 0) return '0:00';
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const getSubText = () => {
        if (remaining === null) return '';
        if (remaining <= 3) return 'HERE WE GO!';
        if (remaining <= 60) return 'ALMOST TIME!';
        return 'GET READY';
    };

    const fraction = remaining !== null ? remaining / RING_THRESHOLD : 0;
    const offset = CIRCUMFERENCE * (1 - fraction);
    const showRing = remaining !== null && remaining <= RING_THRESHOLD && !finished;

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-[color:var(--bg)] text-[color:var(--text-primary)] overflow-hidden relative font-sans transition-colors duration-400">

            {/* Background Gradients */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000"
                style={{
                    backgroundImage: `
            radial-gradient(ellipse at 30% 20%, ${homeColor} 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, ${awayColor} 0%, transparent 60%)
          `
                }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4vmin_4vmin] pointer-events-none" />

            {/* Tournament Header */}
            {(state.tournamentName || state.tournamentLogo) && (
                <div className="absolute top-[8vmin] left-0 w-full flex justify-center items-center z-10">
                    {state.tournamentLogo && (
                        <img src={state.tournamentLogo} alt="Logo" className="absolute left-[5vmin] top-1/2 -translate-y-1/2 w-[10vmin] h-[10vmin] object-contain drop-shadow-[0_0_1.5vmin_rgba(255,255,255,0.25)]" />
                    )}
                    <div className="font-sans font-extrabold text-[4vmin] tracking-[0.35em] text-white uppercase">
                        {state.tournamentName}
                    </div>
                </div>
            )}

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-[90vw] flex flex-col items-center gap-[4vmin] mt-[6vmin]">

                <div className="font-extrabold text-[3.5vmin] tracking-[0.3em] text-[color:var(--text-dim)] uppercase">
                    MATCH STARTING SOON
                </div>

                {/* Teams */}
                <div className="flex w-full items-center justify-center gap-[3vmin] my-[2vmin]">
                    <div className="flex-1 flex flex-col items-center gap-[1.5vmin]">
                        <div className="font-display text-[8vmin] tracking-[0.08em] uppercase text-center" style={{ color: homeColor, textShadow: `0 0 3vmin ${homeColor}66` }}>
                            {homeName}
                        </div>
                        <div className="w-[12vmin] h-[0.8vmin] rounded-full" style={{ background: homeColor, boxShadow: `0 0 2vmin ${homeColor}66` }} />
                    </div>

                    <div className="font-display text-[6vmin] text-[color:var(--text-dim)] shrink-0 px-[4vmin]">VS</div>

                    <div className="flex-1 flex flex-col items-center gap-[1.5vmin]">
                        <div className="font-display text-[8vmin] tracking-[0.08em] uppercase text-center" style={{ color: awayColor, textShadow: `0 0 3vmin ${awayColor}66` }}>
                            {awayName}
                        </div>
                        <div className="w-[12vmin] h-[0.8vmin] rounded-full" style={{ background: awayColor, boxShadow: `0 0 2vmin ${awayColor}66` }} />
                    </div>
                </div>

                {/* Status Label */}
                {remaining === null && (
                    <div className="font-display text-[10vmin] tracking-[0.1em] text-[color:var(--text-dim)] animate-pulse my-[6vmin]">
                        WAITING FOR COUNTDOWN...
                    </div>
                )}

                {finished && (
                    <div className="font-display text-[22vmin] leading-none text-[#10b981] tracking-[0.05em] drop-shadow-[0_0_4vmin_rgba(16,185,129,0.4)] my-[4vmin] animate-pulse">
                        GAME ON!
                    </div>
                )}

                {/* Active Timer */}
                {(remaining !== null && !finished) && (
                    <>
                        <div className="font-extrabold text-[3.5vmin] tracking-[0.3em] text-[color:var(--text-secondary)] uppercase">
                            STARTS IN
                        </div>

                        <div className="relative w-[35vmin] h-[35vmin] flex justify-center items-center">
                            {showRing && (
                                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-[0_0_2vmin_rgba(251,191,36,0.3)]" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18" fill="none" className="stroke-[color:var(--text-dim)] stroke-[1.5] opacity-20" />
                                    <circle
                                        cx="20" cy="20" r="18" fill="none"
                                        className={cn("stroke-[1.5] transition-[stroke-dashoffset] duration-1000 ease-linear", remaining <= 10 ? "stroke-[#ef4444]" : "stroke-[#fbbf24]")}
                                        strokeDasharray={CIRCUMFERENCE}
                                        strokeDashoffset={offset}
                                    />
                                </svg>
                            )}

                            <div key={remaining} className={cn("font-display tabular-nums leading-none z-10 transition-colors drop-shadow-[0_0_3vmin_rgba(255,255,255,0.2)] animate-tick", remaining <= 10 ? "text-[#ef4444] text-[15vmin]" : "text-[color:var(--text-primary)] text-[12vmin]")}>
                                {remaining <= 10 ? remaining : formatTime(remaining)}
                            </div>
                        </div>

                        <div className="font-sans font-black text-[3vmin] tracking-[0.25em] text-[#fbbf24] uppercase mt-[1vmin] drop-shadow-[0_0_2vmin_rgba(251,191,36,0.4)]">
                            {getSubText()}
                        </div>
                    </>
                )}

                {/* Schedule Loop */}
                {state.schedule && state.schedule.length > 0 && (
                    <div className="w-full max-w-[80vmin] mt-[4vmin] flex flex-col gap-[1.5vmin] animate-fade-in">
                        <div className="font-extrabold text-[2.5vmin] tracking-[0.2em] text-[color:var(--text-dim)] uppercase text-center mb-[1vmin]">
                            UPCOMING MATCHES
                        </div>
                        {state.schedule.map((match, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-[2vmin] p-[2vmin] px-[4vmin] backdrop-blur-sm shadow-xl">
                                <div className="flex-1 text-right font-display text-[3.5vmin] tracking-wider truncate px-[2vmin]" style={{ color: match.homeColor || '#fff' }}>
                                    {match.homeName}
                                </div>
                                <div className="shrink-0 flex flex-col items-center justify-center px-[3vmin] border-x border-white/10">
                                    <span className="text-[1.5vmin] text-[color:var(--text-dim)] mb-[0.5vmin]">SCHEDULED</span>
                                    <span className="font-display text-[2.5vmin] text-[#fbbf24]">{match.time}</span>
                                </div>
                                <div className="flex-1 text-left font-display text-[3.5vmin] tracking-wider truncate px-[2vmin]" style={{ color: match.awayColor || '#fff' }}>
                                    {match.awayName}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
