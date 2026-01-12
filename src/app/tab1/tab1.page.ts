import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ajusta si tu ruta es distinta

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tab1.page.html',
})
export class Tab1Page {
  userEmail: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(u => (this.userEmail = u?.email ?? null));
  }

  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
