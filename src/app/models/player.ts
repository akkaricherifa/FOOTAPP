export interface Player {
    id: number;
  name: string;
  number: number;
  position: string;
  nationality: string;
  dateOfBirth: string;
  height?: number;
  weight?: number;
  teamId: number;
  image?: string;
  goals: number;
  assists: number;
  appearances: number;
  yellowCards?: number;
  redCards?: number;
  marketValue?: number;
}
