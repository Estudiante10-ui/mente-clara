import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsService, GuidedSession } from '../../services/sessions.service';

@Component({
  selector: 'app-sesiones-detalle',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './sesiones-detalle.page.html',
  styleUrls: ['./sesiones-detalle.page.scss'],
})
export class SesionesDetallePage {
  loading = true;
  session: GuidedSession | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionsSvc: SessionsService,
    private toast: ToastController
  ) {}

  completed = false;


  async ionViewWillEnter() {
  this.loading = true;
  try {
    const id = this.route.snapshot.paramMap.get('id')!;
    const [session, completed] = await Promise.all([
      this.sessionsSvc.getSession(id),
      this.sessionsSvc.isSessionCompleted(id),
    ]);

    this.session = session;
    this.completed = completed;
  } finally {
    this.loading = false;
  }
}


  async markDone() {
  if (!this.session) return;

  try {
    await this.sessionsSvc.markCompleted(this.session.id);
    this.completed = true;

    const t = await this.toast.create({
      message: 'Sesión marcada como completada ✅',
      duration: 1200,
      position: 'top',
      color: 'success',
    });
    await t.present();
  } catch (e: any) {
    const t = await this.toast.create({
      message: e?.message ?? 'No se pudo guardar tu progreso',
      duration: 2000,
      position: 'top',
      color: 'danger',
    });
    await t.present();
  }
}

}
