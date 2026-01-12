import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';

addIcons({ checkmarkCircleOutline });


initializeApp(environment.firebase);

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
  ],
});
