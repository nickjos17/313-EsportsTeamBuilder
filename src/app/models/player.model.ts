export interface Player {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  stats: {
    winRate: number;
    kda: number;
    matchesPlayed: number;
  };
}