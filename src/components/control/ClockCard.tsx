"use client";

import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameClock } from '@/hooks/useGameClock';
import { Card, CardTitle, Button, Label, Input } from '@/components/ui';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ClockCard() {
    const { state, updateState } = useGameState();
    const { clockSeconds, shotClockSeconds } = useGameClock(state);
    const [editMins, setEditMins] = useState('');
    const [editSecs, setEditSecs] = useState('');

    // Format the clock for display in the control panel
    const displayMins = Math.floor(clockSeconds / 60);
    const displaySecs = clockSeconds % 60;

    const toggleGameClock = () => updateState({ clockRunning: !state.clockRunning });
    const toggleShotClock = () => updateState({ shotClockRunning: !state.shotClockRunning });

    // Quick Sets
    const setGameClock = (mins: number) => {
        updateState({ clockSeconds: mins * 60, clockRunning: false });
    };

    const setShotClock = (secs: number) => {
        updateState({ shotClockSeconds: secs });
    };

    // Manual Edit
    const handleApplyManualTime = () => {
        const m = parseInt(editMins) || 0;
        const s = parseInt(editSecs) || 0;
        updateState({ clockSeconds: (m * 60) + s, clockRunning: false });
        setEditMins('');
        setEditSecs('');
    };

    return (
        <Card className="col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-sb-border pb-2 mb-4">
                <CardTitle className="border-0 pb-0 mb-0">Time & Clocks</CardTitle>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                        <input
                            type="checkbox"
                            checked={state.showGameClock}
                            onChange={(e) => updateState({ showGameClock: e.target.checked })}
                            className="w-4 h-4 accent-sb-home"
                        />
                        Show Game Clock
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                        <input
                            type="checkbox"
                            checked={state.showShotClock}
                            onChange={(e) => updateState({ showShotClock: e.target.checked })}
                            className="w-4 h-4 accent-sb-away"
                        />
                        Show Shot Clock
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* GAME CLOCK SECTION */}
                <div className={cn("flex flex-col gap-4 p-4 rounded-xl border border-sb-border transition-all", state.showGameClock ? "bg-white/5" : "opacity-30 pointer-events-none grayscale")}>
                    <div className="flex justify-between flex-wrap gap-4 items-center">
                        <div className="font-sans text-xs font-bold text-sb-text-dim tracking-widest uppercase">
                            Main Game Clock
                        </div>
                        <div className="flex gap-2">
                            <Button variant="default" className="text-xs px-2 py-1" onClick={() => setGameClock(12)}>12:00</Button>
                            <Button variant="default" className="text-xs px-2 py-1" onClick={() => setGameClock(10)}>10:00</Button>
                            <Button variant="default" className="text-xs px-2 py-1" onClick={() => setGameClock(5)}>5:00</Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-black/40 rounded-lg p-4 border border-white/10">
                        <div className="font-display text-5xl tabular-nums text-sb-text drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            {String(displayMins).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}
                        </div>

                        <Button
                            className={cn("w-16 h-16 rounded-full border-2", state.clockRunning ? "bg-amber-500/20 text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-white" : "bg-emerald-500/20 text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white")}
                            onClick={toggleGameClock}
                        >
                            {state.clockRunning ? <Pause size={28} /> : <Play size={28} className="translate-x-[2px]" />}
                        </Button>
                    </div>

                    {/* Manual Input */}
                    <div className="flex items-end gap-2 mt-2">
                        <div className="flex-1">
                            <Label>Set Min</Label>
                            <Input type="number" placeholder="MM" value={editMins} onChange={e => setEditMins(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <Label>Set Sec</Label>
                            <Input type="number" placeholder="SS" value={editSecs} onChange={e => setEditSecs(e.target.value)} />
                        </div>
                        <Button onClick={handleApplyManualTime} className="mb-[2px] h-[38px]">Apply</Button>
                    </div>
                </div>


                {/* SHOT CLOCK SECTION */}
                <div className={cn("flex flex-col gap-4 p-4 rounded-xl border border-sb-border transition-all", state.showShotClock ? "bg-white/5" : "opacity-30 pointer-events-none grayscale")}>
                    <div className="flex justify-between flex-wrap gap-4 items-center">
                        <div className="font-sans text-xs font-bold text-sb-text-dim tracking-widest uppercase">
                            Shot Clock
                        </div>
                        <div className="flex gap-2">
                            <Button variant="default" className="text-xs px-2 py-1 bg-sb-away/20 text-sb-away border-sb-away/30 hover:bg-sb-away hover:text-white" onClick={() => setShotClock(24)}><RotateCcw size={14} /> 24</Button>
                            <Button variant="default" className="text-xs px-2 py-1 bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-white" onClick={() => setShotClock(14)}><RotateCcw size={14} /> 14</Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-black/40 rounded-lg p-4 border border-white/10 flex-1">
                        <div className="font-display text-7xl tabular-nums text-sb-away drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] flex-1 text-center">
                            {shotClockSeconds}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className={cn("w-14 h-14 rounded-full border-2", state.shotClockRunning ? "bg-amber-500/20 text-amber-500 border-amber-500 hover:bg-amber-500 hover:text-white" : "bg-emerald-500/20 text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white")}
                                onClick={toggleShotClock}
                            >
                                {state.shotClockRunning ? <Pause size={24} /> : <Play size={24} className="translate-x-[2px]" />}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
}
