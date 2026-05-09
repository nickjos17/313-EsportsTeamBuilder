import { Injectable, inject } from '@angular/core';
import { Player } from '../models/player.model';
import { Firestore, collection, addDoc, updateDoc, doc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private firestore = inject(Firestore);
  private playersRef = collection(this.firestore, 'players');

  async addPlayer(player: Player) {
    return addDoc(this.playersRef, player);
  }
  async updatePlayer(player: Player) {
    const playerDoc = doc(this.firestore, `players/${player.id}`);
    return updateDoc(playerDoc, { ...player });
  }

  private currentTeam: (Player | null)[] = [null, null, null, null, null];

  constructor() { }

  // Returns all available players for the gallery
  getPlayers(): Observable<Player[]> {
  // Use idField: 'id' so Firestore IDs are mapped to your Player object
  return collectionData(this.playersRef, { idField: 'id' }) as Observable<Player[]>;
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