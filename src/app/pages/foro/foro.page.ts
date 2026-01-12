import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ForumService, ForumPost } from '../../services/forum.service';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage {
  loading = true;
  posting = false;

  posts: ForumPost[] = [];
  message = '';

  constructor(private forum: ForumService, private toastCtrl: ToastController) {}

  async ionViewWillEnter() {
    await this.load();
  }

  async load(event?: any) {
    this.loading = true;

    try {
      this.posts = await this.forum.listPosts();
    } catch (e: any) {
      console.error('Error cargando posts', e);

      await this.toast(
        e?.message ?? 'No se pudieron cargar las publicaciones',
        'danger',
        1800
      );
    } finally {
      this.loading = false;
      event?.target?.complete?.();
    }
  }

  async publish() {
    if (this.posting) return;

    const text = (this.message || '').trim();

    if (text.length < 3) {
      await this.toast('Escribe al menos 3 caracteres ✍️', 'warning', 1400);
      return;
    }

    this.posting = true;

    try {
      await this.forum.createPost(text);

      // ✅ limpiar
      this.message = '';

      // ✅ feedback éxito
      await this.toast('Publicado en el foro ✅', 'success', 1300);

      // ✅ refrescar posts
      await this.load();
    } catch (e: any) {
      console.error('Error publicando', e);

      const msgRaw = String(e?.message || '');
      let msg = 'No se pudo publicar. Intenta nuevamente.';

      if (msgRaw.toLowerCase().includes('permission')) {
        msg = 'Permisos insuficientes para publicar (Firestore Rules).';
      } else if (msgRaw.toLowerCase().includes('network')) {
        msg = 'Problema de conexión a internet.';
      } else if (msgRaw) {
        msg = msgRaw;
      }

      await this.toast(msg, 'danger', 2000);
    } finally {
      this.posting = false;
    }
  }

  // Fecha bonita si existe (Timestamp)
  formatDate(createdAt: any): string {
    try {
      const d = createdAt?.toDate?.() ?? null;
      if (!d) return 'Recién publicado';
      return d.toLocaleString();
    } catch {
      return 'Recién publicado';
    }
  }

  private async toast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium',
    duration = 1800
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color,
    });
    await t.present();
  }
}
