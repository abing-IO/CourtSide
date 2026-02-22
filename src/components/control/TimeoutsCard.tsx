"use client";

import { useGameState } from '@/hooks/useGameState';
import { Card, CardTitle, Button, Input, Label } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

export function TimeoutsCard() {
    const { state, updateState } = useGameState();

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 5;
        updateState({ maxTimeouts: Math.max(1, Math.min(10, val)) });
    };

    const adjTimeout = (team: 'home' | 'away', amount: number) => {
        const key = team === 'home' ? 'homeTimeoutsUsed' : 'awayTimeoutsUsed';
        const current = state[key];
        const max = state.maxTimeouts;
        const newVal = Math.max(0, Math.min(max, current + amount));
        updateState({ [key]: newVal });
    };

    const renderDots = (team: 'home' | 'away') => {
        const used = team === 'home' ? state.homeTimeoutsUsed : state.awayTimeoutsUsed;
        const activeClass = team === 'home' ? 'bg-sb-home border-sb-home shadow-[0_0_1.5vmin_rgba(59,130,246,0.4)]' : 'bg-sb-away border-sb-away shadow-[0_0_1.5vmin_rgba(239,68,68,0.4)]';

        return Array.from({ length: state.maxTimeouts }).map((_, i) => (
            <div
                key={i}
                onClick={() => {
                    if (used > i) adjTimeout(team, -1);
                    else adjTimeout(team, 1);
                }}
                className={cn(
                    "w-5 h-5 rounded-full border-2 border-white/15 bg-white/10 cursor-pointer transition-all hover:scale-110",
                    i < used && activeClass
                )}
            />
        ));
    };

    return (
        <Card>
            <div className="flex justify-between items-center border-b border-sb-border pb-2 mb-4">
                <CardTitle className="border-0 pb-0 mb-0">Timeouts</CardTitle>
                <div className="flex items-center gap-2">
                    <Label className="mb-0">Max / Team:</Label>
                    <Input
                        type="number"
                        min="1" max="10"
                        value={state.maxTimeouts}
                        onChange={handleMaxChange}
                        className="w-16 h-8 text-center px-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home */}
                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-sb-text-dim uppercase tracking-widest mb-3">
                        {state.homeName || 'Home'}
                    </div>
                    <div className="flex gap-2 mb-4">
                        {renderDots('home')}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="default" className="px-3" onClick={() => adjTimeout('home', -1)}><Minus size={16} /></Button>
                        <div className="text-sm text-sb-text-dim font-bold font-sans">
                            {state.homeTimeoutsUsed} / {state.maxTimeouts} used
                        </div>
                        <Button variant="default" className="px-3" onClick={() => adjTimeout('home', 1)}><Plus size={16} /></Button>
                    </div>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-sb-text-dim uppercase tracking-widest mb-3">
                        {state.awayName || 'Away'}
                    </div>
                    <div className="flex gap-2 mb-4">
                        {renderDots('away')}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="default" className="px-3" onClick={() => adjTimeout('away', -1)}><Minus size={16} /></Button>
                        <div className="text-sm text-sb-text-dim font-bold font-sans">
                            {state.awayTimeoutsUsed} / {state.maxTimeouts} used
                        </div>
                        <Button variant="default" className="px-3" onClick={() => adjTimeout('away', 1)}><Plus size={16} /></Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
