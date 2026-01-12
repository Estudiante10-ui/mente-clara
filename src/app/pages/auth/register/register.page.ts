import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  private async toast(message: string, color: 'success' | 'warning' | 'danger' | 'medium' = 'medium') {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await t.present();
  }

  async doRegister() {
    const email = (this.email || '').trim();

    if (!email || !this.password) {
      await this.toast('Completa correo y contraseña', 'warning');
      return;
    }
    if (this.password.length < 6) {
      await this.toast('La contraseña debe tener mínimo 6 caracteres', 'warning');
      return;
    }

    this.loading = true;
    const loader = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loader.present();

    try {
      await this.auth.register(email, this.password);

      await this.toast('🎉 Cuenta creada correctamente', 'success');
      await this.router.navigateByUrl('/perfil', { replaceUrl: true });
    } catch (e: any) {
      const code = e?.code || '';
      let msg = 'No se pudo crear la cuenta ❌';

      if (code.includes('auth/email-already-in-use')) msg = 'Ese correo ya está registrado.';
      else if (code.includes('auth/invalid-email')) msg = 'El correo no tiene formato válido.';
      else if (code.includes('auth/weak-password')) msg = 'Contraseña muy débil (mínimo 6).';
      else if (code.includes('auth/network-request-failed')) msg = 'Sin conexión a internet.';
      else if (code.includes('auth/too-many-requests')) msg = 'Demasiados intentos. Intenta más tarde.';

      await this.toast(msg, 'danger');
    } finally {
      this.loading = false;
      await loader.dismiss();
    }
  }
}
