"use client";

import { useGameState } from '@/hooks/useGameState';
import { Card, CardTitle, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Minus } from 'lucide-react';

export function QuarterPossessionCard() {
    const { state, updateState } = useGameState();

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'OT'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Quarter Selection */}
            <Card className="mb-0">
                <CardTitle>Quarter</CardTitle>
                <div className="flex flex-wrap gap-2 justify-center">
                    {quarters.map((q) => (
                        <Button
                            key={q}
                            onClick={() => updateState({ quarter: q })}
                            className={cn(
                                "flex-1 min-w-[60px]",
                                state.quarter === q
                                    ? "bg-amber-500 text-black hover:bg-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                    : ""
                            )}
                        >
                            {q}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Possession Indicator */}
            <Card className="mb-0">
                <CardTitle>Possession Arrow</CardTitle>
                <div className="flex gap-3 justify-center h-[42px]">
                    <Button
                        onClick={() => updateState({ possession: 'home' })}
                        className={cn(
                            "flex-1",
                            state.possession === 'home'
                                ? "bg-sb-home/20 text-sb-home border-sb-home shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                : ""
                        )}
                    >
                        <ArrowLeft size={18} /> Home (L)
                    </Button>

                    <Button
                        onClick={() => updateState({ possession: 'none' })}
                        className={cn(
                            "px-3",
                            state.possession === 'none' ? "opacity-100" : "opacity-50"
                        )}
                        title="Clear Possession"
                    >
                        <Minus size={18} />
                    </Button>

                    <Button
                        onClick={() => updateState({ possession: 'away' })}
                        className={cn(
                            "flex-1",
                            state.possession === 'away'
                                ? "bg-sb-away/20 text-sb-away border-sb-away shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                : ""
                        )}
                    >
                        Away (R) <ArrowRight size={18} />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
