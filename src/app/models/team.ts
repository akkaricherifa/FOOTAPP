import { Coach } from "./coach";
import { Player } from "./player";
import { Trophy } from "./trophy";

export interface Team {
  id: string;
  name: string;
  country: string;
  league: string;
  logo: string;
  stadium: string;
  foundedYear: number;
  stadiumCapacity: number;
  description: string;
  players: Player[];
  trophies: Trophy[];
  coach: Coach;
}
