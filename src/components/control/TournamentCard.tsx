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

            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-sb-border pt-4">
                <div>
                    <Label>Next Match Home</Label>
                    <Input
                        type="text"
                        placeholder="Next Home Team"
                        value={state.nextMatchHome}
                        onChange={(e) => updateState({ nextMatchHome: e.target.value })}
                    />
                </div>
                <div>
                    <Label>Next Match Away</Label>
                    <Input
                        type="text"
                        placeholder="Next Away Team"
                        value={state.nextMatchAway}
                        onChange={(e) => updateState({ nextMatchAway: e.target.value })}
                    />
                </div>
            </div>
        </Card>
    );
}
