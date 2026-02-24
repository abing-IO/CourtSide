"use client";

import { useGameState } from '@/hooks/useGameState';
import { Card, CardTitle, Button, Input, Label } from '@/components/ui';
import { ArrowUpRight, RotateCcw, Palette, Download, Upload } from 'lucide-react';
import { defaultState, GameState } from '@/lib/state';

export function ActionsCard() {
    const { state, updateState } = useGameState();

    const openWindow = (path: string) => {
        window.open(path, '_blank', 'width=1280,height=1024');
    };

    const handleReset = () => {
        if (confirm("Reset everything to default? All scores and names will be lost.")) {
            updateState(defaultState);
        }
    };

    const toggleTheme = () => {
        updateState({ displayTheme: state.displayTheme === 'dark' ? 'light' : 'dark' });
    };

    const exportState = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `scoreboard-state-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const importState = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (reEvent) => {
                try {
                    const loadedState = JSON.parse(reEvent.target?.result as string);
                    // Merge with defaults to ensure all required fields exist (handles old/partial files)
                    updateState({ ...defaultState, ...loadedState });
                } catch (error) {
                    alert('Invalid scoreboard state file');
                }
            };
            reader.readAsText(file);
        }
        e.target.value = ''; // reset
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Popouts */}
            <Card className="mb-0">
                <CardTitle>Display Windows</CardTitle>
                <div className="flex flex-col gap-3">
                    <Button onClick={() => openWindow('/display/scoreboard')} className="justify-between bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-white">
                        Open Scoreboard <ArrowUpRight size={18} />
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => openWindow('/display/countdown')} className="justify-between text-xs">
                            Countdown <ArrowUpRight size={14} />
                        </Button>
                        <Button onClick={() => openWindow('/display/halftime')} className="justify-between text-xs">
                            Halftime <ArrowUpRight size={14} />
                        </Button>
                        <Button onClick={() => openWindow('/display/fulltime')} className="justify-between text-xs col-span-2">
                            Fulltime <ArrowUpRight size={14} />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Theme & Meta */}
            <Card className="mb-0">
                <CardTitle>System</CardTitle>
                <div className="flex flex-col gap-3">
                    <Button onClick={toggleTheme} className="justify-center">
                        <Palette size={16} />
                        Switch to {state.displayTheme === 'dark' ? 'Light' : 'Dark'} Mode
                    </Button>

                    <div className="grid grid-cols-2 gap-3 mt-4 border-t border-sb-border pt-4">
                        <Button onClick={exportState} className="text-xs">
                            <Download size={14} /> Export Game
                        </Button>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={importState}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button className="w-full text-xs pointer-events-none">
                                <Upload size={14} /> Import Game
                            </Button>
                        </div>
                    </div>

                    <Button
                        onClick={async () => {
                            try {
                                const { supabase } = await import('@/lib/supabase');
                                const { error } = await supabase.from('game_history').insert([{ state }]);
                                if (error) throw error;
                                alert('Match saved to database history successfully!');
                            } catch (e) {
                                alert('Failed to save to database. Check console.');
                                console.error(e);
                            }
                        }}
                        className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500 hover:text-white mt-2"
                    >
                        <Download size={16} /> Save Match to Database
                    </Button>

                    <Button variant="danger" onClick={handleReset} className="mt-4">
                        <RotateCcw size={16} /> Hard Reset App
                    </Button>
                </div>
            </Card>
        </div>
    );
}
