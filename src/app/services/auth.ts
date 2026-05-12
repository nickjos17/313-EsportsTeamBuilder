import { inject, Injectable } from '@angular/core';
import { Auth, user, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  user$ = user(this.auth);

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  constructor() {
    this.user$.pipe(
      switchMap(currentUser => {
        if (currentUser) {
          return from(this.getUserRole(currentUser.uid));
        } else {
          return of(null);
        }
      })
    ).subscribe(role => {
      this.userRoleSubject.next(role);
    });
  }

  login(email: string, pass: string) {
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
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        return userSnap.data()['role'];
      }
    } catch (e) {
      console.error("Error fetching role:", e);
    }
    return 'player';
  }

  logout() {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.userRoleSubject.next(null);
        this.router.navigate(['/']);
      })
    );
  }
}