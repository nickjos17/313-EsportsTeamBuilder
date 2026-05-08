export interface Player {
  id: string;
  name: string;
  role: string;      // e.g., 'Tank', 'Support', 'DPS'
  imageUrl: string;
  stats: {
    winRate: number;
    kda: number;
    matchesPlayed: number;
  };
}