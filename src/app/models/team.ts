export interface Team {
  _id: string; // Assurez-vous d'ajouter un champ `id` pour l'identifiant de l'équipe
  name: string;
  country: string;
  league: string;
  logo: string;
  stadium: string;
  foundedYear: number;
  stadiumCapacity: number;
  description?: string;
  players: Player[];
  trophies: Trophy[];
  coach: Coach;
}


export interface Player {
  firstName: string;
  lastName: string;
  age: number;
  position: string;
  number: number;
  nationality: string;
  image: string;
}

export interface Trophy {
  name: string;
  year: number;
}

export interface Coach {
  firstName: string;
  lastName: string;
}

