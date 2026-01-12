import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { SessionsService, GuidedSession } from '../../services/sessions.service';

@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './sesiones.page.html',
  styleUrls: ['./sesiones.page.scss'],
})
export class SesionesPage {
  loading = true;
  sessions: GuidedSession[] = [];

  constructor(private sessionsSvc: SessionsService) {}

  completed = new Set<string>();

async ionViewWillEnter() {
  this.loading = true;
  try {
    await this.sessionsSvc.seedIfEmpty();

    const [sessions, completed] = await Promise.all([
      this.sessionsSvc.listSessions(),
      this.sessionsSvc.listCompletedSessionIds(),
    ]);

    this.sessions = sessions;
    this.completed = completed;
  } finally {
    this.loading = false;
  }
}
}
