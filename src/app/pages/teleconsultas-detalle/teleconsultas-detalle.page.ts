import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

import { environment } from '../../../environments/environment';

type Appointment = {
  id?: string;
  createdAt?: any;
  date?: string;   // "2026-01-23"
  time?: string;   // "18:50"
  email?: string;
  mode?: string;   // "video"
  notes?: string;
  reason?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  uid?: string;
};

@Component({
  selector: 'app-teleconsultas-detalle',
  templateUrl: './teleconsultas-detalle.page.html',
  styleUrls: ['./teleconsultas-detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonProgressBar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
  ],
})
export class TeleconsultasDetallePage {
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  loading = true;
  item: Appointment | null = null;
  private id = '';

  // ✅ Firebase (evita reinicializar si ya existe)
  private fbApp = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
  private db = getFirestore(this.fbApp);
  private auth = getAuth(this.fbApp);

  async ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    await this.load();
  }

  private async load() {
    try {
      this.loading = true;

      const ref = doc(this.db, 'appointments', this.id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        this.item = null;
        return;
      }

      this.item = { id: snap.id, ...(snap.data() as any) };
    } catch (e) {
      console.error(e);
      await this.toast('No se pudo cargar el agendamiento ❌');
    } finally {
      this.loading = false;
    }
  }

  statusLabel(status?: string) {
    if (status === 'confirmed') return 'Confirmada';
    if (status === 'cancelled') return 'Cancelada';
    return 'Pendiente';
  }

  statusColor(status?: string) {
    if (status === 'confirmed') return 'success';
    if (status === 'cancelled') return 'danger';
    return 'warning';
  }

  async confirm() {
    if (!this.item?.id) return;

    try {
      // (opcional) control simple: que sea del usuario logueado
      const currentUid = this.auth.currentUser?.uid;
      if (this.item.uid && currentUid && this.item.uid !== currentUid) {
        await this.toast('No tienes permiso para modificar este agendamiento.');
        return;
      }

      await updateDoc(doc(this.db, 'appointments', this.item.id), {
        status: 'confirmed',
      });

      this.item.status = 'confirmed';
      await this.toast('✅ Teleconsulta confirmada');
    } catch (e) {
      console.error(e);
      await this.toast('No se pudo confirmar ❌');
    }
  }

  async cancel() {
    if (!this.item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Cancelar teleconsulta',
      message: '¿Seguro que deseas cancelar este agendamiento?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí, cancelar',
          role: 'destructive',
          handler: async () => {
            try {
              await updateDoc(doc(this.db, 'appointments', this.item!.id!), {
                status: 'cancelled',
              });
              this.item!.status = 'cancelled';
              await this.toast('🚫 Teleconsulta cancelada');
            } catch (e) {
              console.error(e);
              await this.toast('No se pudo cancelar ❌');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async remove() {
    if (!this.item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: 'Esto eliminará el agendamiento permanentemente. ¿Continuar?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await deleteDoc(doc(this.db, 'appointments', this.item!.id!));
              await this.toast('🗑️ Agendamiento eliminado');
              history.back();
            } catch (e) {
              console.error(e);
              await this.toast('No se pudo eliminar ❌');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  private async toast(message: string) {
    const t = await this.toastCtrl.create({
      message,
      duration: 1600,
      position: 'top',
    });
    await t.present();
  }
}
