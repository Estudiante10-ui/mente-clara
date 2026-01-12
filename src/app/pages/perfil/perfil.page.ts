import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { getAuth } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class PerfilPage implements OnInit {
  email: string | null = null;

  total = 0;
  completed = 0;
  percent = 0;

  loading = true;

  private db = getFirestore();

  constructor(private router: Router) {}

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.router.navigateByUrl('/home');
      return;
    }

    this.email = user.email;

    await this.loadProgress(user.uid);
  }

  async loadProgress(uid: string) {
    this.loading = true;

    try {
      // Total de sesiones guiadas
      const sessionsSnap = await getDocs(
        collection(this.db, 'guided_sessions')
      );
      this.total = sessionsSnap.size;

      // Sesiones completadas por el usuario
      const completedQuery = query(
        collection(this.db, 'user_sessions'),
        where('uid', '==', uid),
        where('status', '==', 'completed')
      );

      const completedSnap = await getDocs(completedQuery);
      this.completed = completedSnap.size;

      this.percent =
        this.total > 0 ? Math.round((this.completed / this.total) * 100) : 0;
    } catch (error) {
      console.error('Error calculando progreso', error);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    const auth = getAuth();
    await auth.signOut();
    this.router.navigateByUrl('/home');
  }
}
