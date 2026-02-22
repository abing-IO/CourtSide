"use client";

import { useGameState } from '@/hooks/useGameState';
import { Card, CardTitle, Button, Input, Label } from '@/components/ui';

export function ScoreCard() {
    const { state, updateState } = useGameState();

    const adjScore = (team: 'home' | 'away', amount: number) => {
        const key = team === 'home' ? 'homeScore' : 'awayScore';
        updateState({ [key]: Math.max(0, state[key] + amount) });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Home */}
            <Card className="mb-0 flex flex-col items-center">
                <Input
                    className="text-center font-bold text-xl mb-4 bg-transparent border-none text-sb-home"
                    value={state.homeName}
                    onChange={(e) => updateState({ homeName: e.target.value.toUpperCase() })}
                />
                <div className="text-[5rem] font-display leading-none mb-4 tabular-nums text-sb-text">
                    {state.homeScore}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => adjScore('home', -1)} className="px-3">-1</Button>
                    <Button onClick={() => adjScore('home', 1)} className="px-3">+1</Button>
                    <Button onClick={() => adjScore('home', 2)} className="px-3">+2</Button>
                    <Button onClick={() => adjScore('home', 3)} className="px-3">+3</Button>
                </div>
            </Card>

            {/* Away */}
            <Card className="mb-0 flex flex-col items-center">
                <Input
                    className="text-center font-bold text-xl mb-4 bg-transparent border-none text-sb-away"
                    value={state.awayName}
                    onChange={(e) => updateState({ awayName: e.target.value.toUpperCase() })}
                />
                <div className="text-[5rem] font-display leading-none mb-4 tabular-nums text-sb-text">
                    {state.awayScore}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => adjScore('away', -1)} className="px-3">-1</Button>
                    <Button onClick={() => adjScore('away', 1)} className="px-3">+1</Button>
                    <Button onClick={() => adjScore('away', 2)} className="px-3">+2</Button>
                    <Button onClick={() => adjScore('away', 3)} className="px-3">+3</Button>
                </div>
            </Card>
        </div>
    );
}
