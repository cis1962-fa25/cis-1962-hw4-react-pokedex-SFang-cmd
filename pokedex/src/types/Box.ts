// Box entry types
export interface BoxEntry {
  id: string;
  createdAt: string;
  level: number;
  location: string;
  notes?: string;
  pokemonId: number;
}

export interface InsertBoxEntry {
  createdAt: string;
  level: number;
  location: string;
  notes?: string;
  pokemonId: number;
}

export interface UpdateBoxEntry {
  createdAt?: string;
  level?: number;
  location?: string;
  notes?: string;
  pokemonId?: number;
}