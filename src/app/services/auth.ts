import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { from } from 'rxjs'; // Important for the .subscribe() in your component

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  user$ = user(this.auth);

  // ENSURE THIS METHOD IS HERE
  login(email: string, pass: string) {
    // We wrap this in 'from' so your component can use .subscribe()
    return from(signInWithEmailAndPassword(this.auth, email, pass));
  }

  async register(email: string, pass: string, role: 'admin' | 'player') {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    await setDoc(doc(this.firestore, `users/${credential.user.uid}`), {
      email: email,
      role: role
    });
    return credential;
  }

  async getUserRole(uid: string): Promise<string> {
  try {
    // Ensure you are using the 'doc' and 'getDoc' imported from @angular/fire/firestore
    const userDocRef = doc(this.firestore, `users/${uid}`); 
    const userSnap = await getDoc(userDocRef);
    
    if (userSnap.exists()) {
      return userSnap.data()['role'];
    }
  } catch (e) {
    console.error("Error fetching role:", e);
  }
  return 'player'; // Default fallback
}

  logout() {
    return from(signOut(this.auth));
  }
}