import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class Database {
  private firestore = inject(Firestore);

  // Save the current 5-man roster
  async saveRoster(userId: string, teamName: string, players: (Player | null)[]) {
    const rostersRef = collection(this.firestore, `users/${userId}/rosters`);
    return addDoc(rostersRef, {
      name: teamName,
      players: players.filter(p => p !== null), // Only save non-null slots
      timestamp: new Date()
    });
  }
}