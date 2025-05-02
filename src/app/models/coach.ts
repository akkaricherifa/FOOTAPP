import { Trophy } from "./trophy";

export interface Coach {
    id: number;
    name: string;
    nationality: string;
    dateOfBirth: string;
    teamId: number;
    image?: string;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    startDate: string;
    previousTeams?: string[];
    trophies?: Trophy[];
    biography?: string;
}
