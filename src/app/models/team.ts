import { TeamStats } from "./team-stats";
import { Trophy } from "./trophy";

export interface Team {
    id: number;
  name: string;
  country: string;
  league: string;
  logo: string;
  stadium: string;
  foundedYear: number;
  stadiumCapacity: number;
  description?: string;
  trophies?: Trophy[];
  stats?: TeamStats;
}
