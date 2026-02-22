export interface GameSchedule {
    homeName: string;
    awayName: string;
    homeColor: string;
    awayColor: string;
    time: string;
}

export interface GameState {
    tournamentName: string;
    tournamentLogo: string;
    homeName: string;
    awayName: string;
    homeColor: string;
    awayColor: string;
    homeScore: number;
    awayScore: number;
    quarter: string; // 'Q1', 'Q2', 'Q3', 'Q4', 'OT'
    possession: 'home' | 'away' | 'none';
    displayTheme: 'dark' | 'light';
    maxTimeouts: number;
    homeTimeoutsUsed: number;
    awayTimeoutsUsed: number;
    countdownTarget: string;
    countdownHomeName: string;
    countdownAwayName: string;
    countdownHomeColor: string;
    countdownAwayColor: string;
    nextMatchHome: string;
    nextMatchAway: string;
    schedule: GameSchedule[];

    showGameClock: boolean;
    clockSeconds: number;
    clockRunning: boolean;
    showShotClock: boolean;
    shotClockSeconds: number;
    shotClockRunning: boolean;

    clockUpdateAt: number;
    shotClockUpdateAt: number;
    serverTime: number;
}

export const defaultState: GameState = {
    tournamentName: '',
    tournamentLogo: '',
    homeName: 'HOME',
    awayName: 'AWAY',
    homeColor: '#3b82f6',
    awayColor: '#ef4444',
    homeScore: 0,
    awayScore: 0,
    quarter: 'Q1',
    possession: 'none',
    displayTheme: 'dark',
    maxTimeouts: 5,
    homeTimeoutsUsed: 0,
    awayTimeoutsUsed: 0,
    countdownTarget: '',
    countdownHomeName: '',
    countdownAwayName: '',
    countdownHomeColor: '',
    countdownAwayColor: '',
    nextMatchHome: '',
    nextMatchAway: '',
    schedule: [],

    showGameClock: false,
    clockSeconds: 720, // 12 mins
    clockRunning: false,
    showShotClock: false,
    shotClockSeconds: 24,
    shotClockRunning: false,

    clockUpdateAt: Date.now(),
    shotClockUpdateAt: Date.now(),
    serverTime: Date.now(),
};
