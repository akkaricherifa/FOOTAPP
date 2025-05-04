import { TeamStats } from "./team-stats";
import { Trophy } from "./trophy";

export interface Team {
  id: number;
  name: string;
  country: string;
  logo: string;
  trophies?: Trophy[];
}
