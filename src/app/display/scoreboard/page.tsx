"use client";

import { useEffect, useRef, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameClock } from '@/hooks/useGameClock';
import { cn } from '@/lib/utils';

export default function ScoreboardDisplay() {
    const { state } = useGameState();
    const { clockSeconds, shotClockSeconds } = useGameClock(state);

    // Previous scores for animation triggers
    const prevHomeScore = useRef(state.homeScore);
    const prevAwayScore = useRef(state.awayScore);

    // Animation states
    const [homePop, setHomePop] = useState(false);
    const [awayPop, setAwayPop] = useState(false);
    const [homeDelta, setHomeDelta] = useState<number | null>(null);
    const [awayDelta, setAwayDelta] = useState<number | null>(null);
    const [threeOverlay, setThreeOverlay] = useState(false);

    // Apply light/dark theme to document
    useEffect(() => {
        if (state.displayTheme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }

        // Set dynamic accent colors
        document.documentElement.style.setProperty('--accent-home', state.homeColor);
        document.documentElement.style.setProperty('--accent-away', state.awayColor);
        document.documentElement.style.setProperty('--glow-home', state.homeColor + '66');
        document.documentElement.style.setProperty('--glow-away', state.awayColor + '66');
    }, [state.displayTheme, state.homeColor, state.awayColor]);

    // Use a key to force animation restart (incrementing triggers remount of inner content)
    const [threeKey, setThreeKey] = useState(0);
    const [threeTeam, setThreeTeam] = useState<'home' | 'away' | null>(null);
    const [threeDiff, setThreeDiff] = useState(0);

    // Handle Score Animations
    useEffect(() => {
        if (state.homeScore !== prevHomeScore.current) {
            const diff = state.homeScore - prevHomeScore.current;
            if (diff === 3) {
                setThreeOverlay(true);
                setThreeKey(k => k + 1);
                setThreeTeam('home');
                setThreeDiff(diff);
            } else {
                triggerPop('home', diff > 0 ? diff : null);
            }
            prevHomeScore.current = state.homeScore;
        }

        if (state.awayScore !== prevAwayScore.current) {
            const diff = state.awayScore - prevAwayScore.current;
            if (diff === 3) {
                setThreeOverlay(true);
                setThreeKey(k => k + 1);
                setThreeTeam('away');
                setThreeDiff(diff);
            } else {
                triggerPop('away', diff > 0 ? diff : null);
            }
            prevAwayScore.current = state.awayScore;
        }
    }, [state.homeScore, state.awayScore]);

    // Called when the +3 overlay animation finishes naturally
    const handleThreeAnimationEnd = (e: React.AnimationEvent) => {
        // Only act on the overlay fade, ignore the text pop bubbling up
        if (e.target !== e.currentTarget) return;
        setThreeOverlay(false);
        if (threeTeam) {
            triggerPop(threeTeam, threeDiff);
            setThreeTeam(null);
        }
    };

    const triggerPop = (team: 'home' | 'away', delta: number | null) => {
        if (team === 'home') {
            setHomePop(false);
            setTimeout(() => {
                setHomePop(true);
                if (delta) {
                    setHomeDelta(delta);
                    setTimeout(() => setHomeDelta(null), 1000);
                }
            }, 10);
            setTimeout(() => setHomePop(false), 450);
        } else {
            setAwayPop(false);
            setTimeout(() => {
                setAwayPop(true);
                if (delta) {
                    setAwayDelta(delta);
                    setTimeout(() => setAwayDelta(null), 1000);
                }
            }, 10);
            setTimeout(() => setAwayPop(false), 450);
        }
    };

    return (
        <div className="sb w-screen h-screen relative bg-sb-bg overflow-hidden flex flex-col justify-center items-center gap-[2.5vmin] p-[5vmin]">
            {/* 3-Pointer Overlay — always in DOM, visibility controlled by CSS */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none",
                    threeOverlay ? "animate-threeOverlayFade" : "opacity-0 invisible"
                )}
                style={{ background: "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(0, 0, 0, 0.85) 70%)" }}
                onAnimationEnd={handleThreeAnimationEnd}
            >
                <div
                    key={threeKey}
                    className={cn(
                        "font-display text-[50vmin]",
                        threeOverlay ? "animate-threeTextPop" : "opacity-0 scale-0"
                    )}
                    style={{
                        color: '#fbbf24',
                        textShadow: '0 0 5vmin rgba(251, 191, 36, 0.8), 0 0 15vmin rgba(251, 191, 36, 0.4), 0 0 30vmin rgba(251, 191, 36, 0.2)'
                    }}
                >
                    +3
                </div>
            </div>

            {/* Tournament Header */}
            {(state.tournamentName || state.tournamentLogo) && (
                <div className="relative z-10 w-full flex justify-center items-center">
                    {state.tournamentLogo && (
                        <img
                            src={state.tournamentLogo}
                            alt="Tournament Logo"
                            className="absolute left-0 top-0 w-[10vmin] h-[10vmin] object-contain drop-shadow-[0_0_1.5vmin_rgba(255,255,255,0.25)]"
                        />
                    )}
                    <div className="font-sans font-extrabold text-[4vmin] tracking-[0.35em] text-white uppercase">
                        {state.tournamentName}
                    </div>
                </div>
            )}

            {/* Quarter & Game Clock Row */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full gap-[0.5vmin]">
                <div className="font-display text-[5vmin] tracking-[0.2em] text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/20 px-[4vmin] py-[0.5vmin] rounded-[1vmin] drop-shadow-[0_0_1.5vmin_rgba(251,191,36,0.3)]">
                    {state.quarter}
                </div>

                {state.showGameClock && (
                    <div className={cn(
                        "font-display tabular-nums transition-colors duration-300",
                        clockSeconds === 0 ? "text-[#ef4444] animate-pulse text-[18vmin] leading-none drop-shadow-[0_0_4vmin_rgba(239,68,68,0.6)]" :
                            clockSeconds <= 60 ? "text-[#fbbf24] text-[16vmin] leading-[0.8] mt-[1vmin] drop-shadow-[0_0_3vmin_rgba(251,191,36,0.4)]" :
                                "text-sb-text text-[14vmin] leading-[0.8] mt-[1vmin] drop-shadow-[0_0_2vmin_rgba(255,255,255,0.2)]"
                    )}>
                        {Math.floor(clockSeconds / 60)}:{String(clockSeconds % 60).padStart(2, '0')}
                    </div>
                )}
            </div>

            {/* Teams Row */}
            <div className="flex items-center w-full gap-[2vmin] relative z-10">
                <div className="flex-1 flex items-center justify-start gap-[2vmin] p-[2vmin_3vmin] bg-sb-card border border-sb-border rounded-[1.5vmin] relative overflow-hidden">
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[0.6vmin] rounded-[1vmin]"
                        style={{ background: state.homeColor, boxShadow: `0 0 2vmin ${state.homeColor}66` }}
                    />
                    <span className="font-display text-[5vmin] tracking-[0.15em] text-sb-text uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                        {state.homeName}
                    </span>
                </div>

                <div className="font-display text-[3.5vmin] text-sb-text-dim tracking-[0.2em] shrink-0">VS</div>

                <div className="flex-1 flex items-center justify-end gap-[2vmin] p-[2vmin_3vmin] bg-sb-card border border-sb-border rounded-[1.5vmin] relative overflow-hidden">
                    <span className="font-display text-[5vmin] tracking-[0.15em] text-sb-text uppercase whitespace-nowrap overflow-hidden text-ellipsis text-right w-full block">
                        {state.awayName}
                    </span>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-[0.6vmin] rounded-[1vmin]"
                        style={{ background: state.awayColor, boxShadow: `0 0 2vmin ${state.awayColor}66` }}
                    />
                </div>
            </div>

            {/* Scores Row */}
            <div className="flex items-center justify-center gap-[4vmin] w-full py-[3vmin] relative z-10 overflow-visible">
                {/* Home Score */}
                <div className="relative">
                    <div className={cn("font-display text-[20vmin] leading-none text-sb-text min-w-[28vmin] text-center transition-all duration-150 tabular-nums", homePop && "animate-scorePop text-[#fbbf24] scale-115")}>
                        {state.homeScore}
                    </div>
                    {homeDelta && (
                        <div className="absolute top-[-2vmin] left-0 w-full text-center font-display text-[8vmin] text-[#fbbf24] drop-shadow-[0_0_3vmin_rgba(251,191,36,0.6)] animate-scoreDeltaFloat z-20 pointer-events-none">
                            +{homeDelta}
                        </div>
                    )}
                </div>

                {/* Shot Clock or Divider */}
                {state.showShotClock ? (
                    <div className={cn(
                        "font-display tabular-nums leading-none select-none min-w-[16vmin] text-center",
                        shotClockSeconds <= 5 ? "text-[#ef4444] text-[16vmin] animate-pulse drop-shadow-[0_0_4vmin_rgba(239,68,68,0.4)]" :
                            "text-[#fbbf24] text-[14vmin] drop-shadow-[0_0_2vmin_rgba(251,191,36,0.2)]"
                    )}>
                        {shotClockSeconds}
                    </div>
                ) : (
                    <div className="font-display text-[10vmin] text-sb-text-dim select-none min-w-[16vmin] text-center">—</div>
                )}

                {/* Away Score */}
                <div className="relative">
                    <div className={cn("font-display text-[20vmin] leading-none text-sb-text min-w-[28vmin] text-center transition-all duration-150 tabular-nums", awayPop && "animate-scorePop text-[#fbbf24] scale-115")}>
                        {state.awayScore}
                    </div>
                    {awayDelta && (
                        <div className="absolute top-[-2vmin] left-0 w-full text-center font-display text-[8vmin] text-[#fbbf24] drop-shadow-[0_0_3vmin_rgba(251,191,36,0.6)] animate-scoreDeltaFloat z-20 pointer-events-none">
                            +{awayDelta}
                        </div>
                    )}
                </div>
            </div>

            {/* Possession Row */}
            <div className="flex items-center justify-center gap-[3vmin] w-full relative z-10">
                <div
                    className={cn("text-[7vmin] transition-all duration-300", state.possession === 'home' ? "opacity-100 scale-120" : "opacity-25")}
                    style={{ color: state.possession === 'home' ? state.homeColor : 'var(--text-dim)', textShadow: state.possession === 'home' ? `0 0 3vmin ${state.homeColor}66` : 'none' }}
                >
                    ◀
                </div>
                <div className="font-sans text-[2.5vmin] font-extrabold tracking-[0.35em] text-sb-text-sec uppercase">
                    POSS
                </div>
                <div
                    className={cn("text-[7vmin] transition-all duration-300", state.possession === 'away' ? "opacity-100 scale-120" : "opacity-25")}
                    style={{ color: state.possession === 'away' ? state.awayColor : 'var(--text-dim)', textShadow: state.possession === 'away' ? `0 0 3vmin ${state.awayColor}66` : 'none' }}
                >
                    ▶
                </div>
            </div>

            {/* Timeouts */}
            <div className="w-full flex flex-col items-center gap-[1.5vmin] relative z-10">
                <div className="font-sans text-[1.8vmin] font-extrabold tracking-[0.35em] text-sb-text-sec uppercase">TIMEOUTS</div>
                <div className="flex items-center justify-center gap-[4vmin] w-full">
                    {/* Home Timeouts */}
                    <div className="flex gap-[1.2vmin] items-center justify-center flex-1">
                        {Array.from({ length: state.maxTimeouts }).map((_, i) => (
                            <div
                                key={i}
                                className="w-[2.8vmin] h-[2.8vmin] rounded-full border-[0.3vmin] border-white/15 transition-all duration-300"
                                style={{
                                    background: i < state.homeTimeoutsUsed ? state.homeColor : 'var(--timeout-empty)',
                                    borderColor: i < state.homeTimeoutsUsed ? state.homeColor : 'rgba(255,255,255,0.15)',
                                    boxShadow: i < state.homeTimeoutsUsed ? `0 0 1.5vmin ${state.homeColor}66` : 'none'
                                }}
                            />
                        ))}
                    </div>

                    <div className="w-[0.4vmin] h-[3vmin] bg-sb-text-dim rounded-[1vmin] shrink-0" />

                    {/* Away Timeouts */}
                    <div className="flex gap-[1.2vmin] items-center justify-center flex-1">
                        {Array.from({ length: state.maxTimeouts }).map((_, i) => (
                            <div
                                key={i}
                                className="w-[2.8vmin] h-[2.8vmin] rounded-full border-[0.3vmin] border-white/15 transition-all duration-300"
                                style={{
                                    background: i < state.awayTimeoutsUsed ? state.awayColor : 'var(--timeout-empty)',
                                    borderColor: i < state.awayTimeoutsUsed ? state.awayColor : 'rgba(255,255,255,0.15)',
                                    boxShadow: i < state.awayTimeoutsUsed ? `0 0 1.5vmin ${state.awayColor}66` : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
