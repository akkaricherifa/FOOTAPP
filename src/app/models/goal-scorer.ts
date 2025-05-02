export interface GoalScorer {
    playerId: number;
    playerName: string;
    teamId: number;
    minute: number;
    isOwnGoal?: boolean;
    isPenalty?: boolean;
}

