import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  // 1. The Master List (Your available heroes)
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
    }
    ,
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
    },
    {
      id: '7',
      name: 'Ali',
      role: 'Support',
      imageUrl: 'assets/icons/Mercy.webp',
      stats: { winRate: 72, kda: 2.1, matchesPlayed: 200 }
    }
  ];

  private currentTeam: (Player | null)[] = [null, null, null, null, null];

  constructor() { }

  // Returns all available players for the gallery
  getPlayers(): Player[] {
    return this.mockPlayers;
  }

  // Returns the 5-slot roster array
  getTeam(): (Player | null)[] {
    return this.currentTeam;
  }

  // Handles dropping a player into a specific slot (0-4)
  updateSlot(index: number, player: Player): void {
    // A. Check if the player is already in a different slot to prevent duplicates
    const existingIndex = this.currentTeam.findIndex(p => p?.id === player.id);
    
    if (existingIndex !== -1) {
      // If they are already on the team, clear their old spot first
      this.currentTeam[existingIndex] = null;
    }
    
    // B. Place the player in the new target slot
    this.currentTeam[index] = player;
  }

  // Clears a specific slot when the user clicks the "X"
  removeFromSlot(index: number): void {
    this.currentTeam[index] = null;
  }
  clearAllSlots(): void {
  // Re-initializes the team with 5 empty spaces
  this.currentTeam = [null, null, null, null, null];
  }
}