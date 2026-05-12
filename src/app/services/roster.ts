import { Injectable, inject } from '@angular/core';
import { Player } from '../models/player.model';
import { Firestore, collection, addDoc, updateDoc, doc, collectionData } from '@angular/fire/firestore';
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

  getPlayers(): Observable<Player[]> {
  return collectionData(this.playersRef, { idField: 'id' }) as Observable<Player[]>;
}

  getTeam(): (Player | null)[] {
    return this.currentTeam;
  }

  updateSlot(index: number, player: Player): void {
    const existingIndex = this.currentTeam.findIndex(p => p?.id === player.id);
    
    if (existingIndex !== -1) {
      this.currentTeam[existingIndex] = null;
    }
    this.currentTeam[index] = player;
  }

  removeFromSlot(index: number): void {
    this.currentTeam[index] = null;
  }
  clearAllSlots(): void {
  this.currentTeam = [null, null, null, null, null];
  }
}