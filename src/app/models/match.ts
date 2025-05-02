import { GoalScorer } from "./goal-scorer";

export interface Match {
    id: number;
    date: string;
    competition: string;
    homeTeamId: number;
    awayTeamId: number;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    homeScore: number;
    awayScore: number;
    status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
    stadium?: string;
    attendance?: number;
    referee?: string;
    goalScorers?: GoalScorer[];
}
