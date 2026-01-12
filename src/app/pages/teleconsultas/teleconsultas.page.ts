import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AppointmentsService, Appointment } from '../../services/appointments.service';

@Component({
  selector: 'app-teleconsultas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './teleconsultas.page.html',
  styleUrls: ['./teleconsultas.page.scss'],
})
export class TeleconsultasPage {
  loading = true;
  saving = false;

  items: Appointment[] = [];

  date = '';
  time = '';
  reason = '';
  mode: 'video' | 'llamada' = 'video';
  notes = '';

  constructor(private appt: AppointmentsService, private toastCtrl: ToastController) {}

  async ionViewWillEnter() {
    await this.load();
  }

  async load(event?: any) {
    this.loading = true;
    try {
      this.items = await this.appt.listMine();
    } catch (e: any) {
      await this.toast('No se pudo cargar la lista de teleconsultas.', 'danger');
      console.error('load teleconsultas error', e);
    } finally {
      this.loading = false;
      event?.target?.complete?.();
    }
  }

  async submit() {
    if (this.saving) return;

    const reason = (this.reason || '').trim();
    const notes = (this.notes || '').trim();

    if (!this.date || !this.time || reason.length < 3) {
      await this.toast('Completa fecha, hora y motivo (mín. 3 caracteres) ✍️', 'warning');
      return;
    }

    this.saving = true;

    try {
      await this.appt.create({
        date: this.date,
        time: this.time,
        reason,
        mode: this.mode,
        notes,
      });

      // ✅ limpiar formulario
      this.date = '';
      this.time = '';
      this.reason = '';
      this.mode = 'video';
      this.notes = '';

      await this.toast('Agendamiento creado ✅ (pendiente de confirmación)', 'success');

      // ✅ refrescar lista
      await this.load();
    } catch (e: any) {
      console.error('submit teleconsulta error', e);

      const code = String(e?.code || '');
      const msgRaw = String(e?.message || '');

      let msg = 'No se pudo agendar. Intenta nuevamente.';

      if (code.includes('permission') || msgRaw.toLowerCase().includes('permission')) {
        msg = 'Permisos insuficientes para agendar (Firestore Rules).';
      } else if (code.includes('network') || msgRaw.toLowerCase().includes('network')) {
        msg = 'Problema de conexión a internet.';
      } else if (msgRaw) {
        // si el servicio trae un mensaje útil, lo mostramos
        msg = msgRaw;
      }

      await this.toast(msg, 'danger');
    } finally {
      this.saving = false;
    }
  }

  badgeColor(status: Appointment['status']) {
    if (status === 'confirmed') return 'success';
    if (status === 'canceled') return 'medium';
    return 'warning';
  }

  badgeText(status: Appointment['status']) {
    if (status === 'confirmed') return 'Confirmada';
    if (status === 'canceled') return 'Cancelada';
    return 'Pendiente';
  }

  private async toast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 1800,
      position: 'top',
      color,
    });
    await t.present();
  }
}
