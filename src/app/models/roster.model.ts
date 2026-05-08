import { Player } from './player.model';

export interface Roster {
  id: string;
  rosterName: string;
  players: Player[]; // Array of 5-6 players depending on the game
  isFinalized: boolean;
  createdAt: Date;
}