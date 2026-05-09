import { Injectable } from '@angular/core';
import { Player } from '../models/player.model'; // Use the model we created earlier

@Injectable({
  providedIn: 'root'
})
export class RosterService {

private mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Nick',
    role: 'DPS',
    imageUrl: 'assets/icons/Lucio.webp',
    stats: { winRate: 65, kda: 3.2, matchesPlayed: 120 }
  },
  {
    id: '2',
    name: 'Martin',
    role: 'Tank',
    imageUrl: 'assets/icons/Reinhardt.webp',
    stats: { winRate: 58, kda: 4.5, matchesPlayed: 95 }
  },
  {
    id: '3',
    name: 'Ali',
    role: 'Support',
    imageUrl: 'assets/icons/Mercy.webp',
    stats: { winRate: 72, kda: 2.1, matchesPlayed: 200 }
  },
  {
    id: '4',
    name: 'Ali',
    role: 'Support',
    imageUrl: 'assets/icons/Mercy.webp',
    stats: { winRate: 72, kda: 2.1, matchesPlayed: 200 }
  },
  {
    id: '5',
    name: 'Ali',
    role: 'Support',
    imageUrl: 'assets/icons/Mercy.webp',
    stats: { winRate: 72, kda: 2.1, matchesPlayed: 200 }
  },
  {
    id: '6',
    name: 'Ali',
    role: 'Support',
    imageUrl: 'assets/icons/Mercy.webp',
    stats: { winRate: 72, kda: 2.1, matchesPlayed: 200 }
  }
];

  constructor() { }

  getPlayers(): Player[] {
    return this.mockPlayers;
  }
}