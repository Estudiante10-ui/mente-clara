import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;

  private auth = getAuth();

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async doLogin() {
    if (this.loading) return;

    if (!this.email || !this.password) {
      this.showToast('Completa correo y contraseña', 'warning');
      return;
    }

    this.loading = true;

    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      await this.showToast('Sesión iniciada correctamente ✅', 'success');
      await this.router.navigateByUrl('/perfil', { replaceUrl: true });
    } catch (err: any) {
      const msg = this.mapAuthError(err?.code);
      await this.showToast(msg, 'danger');
    } finally {
      this.loading = false;
    }
  }

  private mapAuthError(code?: string) {
    switch (code) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con ese correo.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'Correo inválido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      default:
        return 'No se pudo iniciar sesión.';
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
