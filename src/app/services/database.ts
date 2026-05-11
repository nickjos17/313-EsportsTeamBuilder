import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class Database {
  private firestore = inject(Firestore);

  // Save the current 5-man roster
  async saveRoster(userId: string, teamName: string, players: (Player | null)[]) {
  const rosterCollection = collection(this.firestore, `users/${userId}/savedRosters`);
  
  return addDoc(rosterCollection, {
    teamName: teamName,
    players: players,
    createdAt: new Date(),
    heroCount: players.filter(p => p !== null).length
    });
  }
  async getSavedRosters(userId: string) {
  const rosterRef = collection(this.firestore, `users/${userId}/savedRosters`);
  const q = query(rosterRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }));
}

async deleteRoster(userId: string, rosterId: string) {
  const docRef = doc(this.firestore, `users/${userId}/savedRosters`, rosterId);
  return deleteDoc(docRef);
}
async updateHero(heroId: string, data: any) {
  const heroRef = doc(this.firestore, `players/${heroId}`);
  return updateDoc(heroRef, data);
}

async deleteHero(heroId: string) {
  const heroRef = doc(this.firestore, `players/${heroId}`);
  return deleteDoc(heroRef);
}
}