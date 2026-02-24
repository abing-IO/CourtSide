"use client";

import { useGameState } from '@/hooks/useGameState';
import { Card, CardTitle, Input, Label, Button } from '@/components/ui';

export function TournamentCard() {
    const { state, updateState } = useGameState();

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Logo must be less than 2MB");
                e.target.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = (reEvent) => {
                updateState({ tournamentLogo: reEvent.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card>
            <CardTitle>Tournament Info</CardTitle>

            <div className="mb-4">
                <Label>Tournament Name</Label>
                <Input
                    type="text"
                    placeholder="e.g. CHAMPIONSHIP FINALS"
                    value={state.tournamentName}
                    onChange={(e) => updateState({ tournamentName: e.target.value })}
                />
            </div>

            <div className="mb-4">
                <Label>Tournament Logo</Label>
                <div className="flex gap-4 items-center">
                    {state.tournamentLogo && (
                        <img src={state.tournamentLogo} alt="Logo" className="w-12 h-12 object-contain bg-black/20 rounded p-1" />
                    )}
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleLogoUpload}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sb-card border border-sb-border rounded w-full"
                    />
                </div>
            </div>

            <div className="mt-6 border-t border-sb-border pt-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Countdown & Next Match</h3>

                <div className="mb-4">
                    <Label>Countdown Target Time</Label>
                    <Input
                        type="datetime-local"
                        value={state.countdownTarget ? new Date(state.countdownTarget).toISOString().slice(0, 16) : ''}
                        onChange={(e) => {
                            const date = new Date(e.target.value);
                            updateState({ countdownTarget: isNaN(date.getTime()) ? '' : date.toISOString() });
                        }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to hide countdown timer</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label>Next Match Home</Label>
                        <Input
                            type="text"
                            placeholder="Home Team"
                            value={state.nextMatchHome}
                            onChange={(e) => updateState({ nextMatchHome: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>Next Match Away</Label>
                        <Input
                            type="text"
                            placeholder="Away Team"
                            value={state.nextMatchAway}
                            onChange={(e) => updateState({ nextMatchAway: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-6 border-t border-sb-border pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <Label className="mb-0">Match Schedule</Label>
                        <Button
                            variant="primary"
                            className="h-8"
                            onClick={() => {
                                updateState({
                                    schedule: [...state.schedule, { homeName: 'HOME', awayName: 'AWAY', homeColor: '#3b82f6', awayColor: '#ef4444', time: '12:00 PM' }]
                                });
                            }}
                        >
                            + Add Match
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {state.schedule.map((match, idx) => (
                            <div key={idx} className="p-3 bg-black/20 rounded-lg border border-white/5 relative group">
                                <button
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                        const newSchedule = [...state.schedule];
                                        newSchedule.splice(idx, 1);
                                        updateState({ schedule: newSchedule });
                                    }}
                                >
                                    ✕
                                </button>

                                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-2 items-center">
                                    <Input
                                        type="text"
                                        className="h-8"
                                        value={match.homeName}
                                        onChange={(e) => {
                                            const newSchedule = [...state.schedule];
                                            newSchedule[idx] = { ...newSchedule[idx], homeName: e.target.value };
                                            updateState({ schedule: newSchedule });
                                        }}
                                    />
                                    <span className="text-xs font-bold text-gray-500">VS</span>
                                    <Input
                                        type="text"
                                        className="h-8"
                                        value={match.awayName}
                                        onChange={(e) => {
                                            const newSchedule = [...state.schedule];
                                            newSchedule[idx] = { ...newSchedule[idx], awayName: e.target.value };
                                            updateState({ schedule: newSchedule });
                                        }}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="text"
                                        className="h-8 text-center"
                                        placeholder="Time (e.g. 14:00 or 2:00 PM)"
                                        value={match.time}
                                        onChange={(e) => {
                                            const newSchedule = [...state.schedule];
                                            newSchedule[idx] = { ...newSchedule[idx], time: e.target.value };
                                            updateState({ schedule: newSchedule });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {state.schedule.length === 0 && (
                            <p className="text-center text-xs text-gray-500 py-4 italic">No upcoming matches scheduled.</p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
