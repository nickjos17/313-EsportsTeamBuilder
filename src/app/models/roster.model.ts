import { Player } from './player.model';

export interface Roster {
  id: string;
  rosterName: string;
  players: Player[];
  isFinalized: boolean;
  createdAt: Date;
}