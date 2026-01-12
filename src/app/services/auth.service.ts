import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth();
  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => this._user$.next(user));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email.trim(), password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email.trim(), password);
  }

  logout() {
    return signOut(this.auth);
  }
}
