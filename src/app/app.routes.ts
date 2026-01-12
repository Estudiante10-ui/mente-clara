import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
  },

  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then(m => m.LoginPage),
  },

  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register/register.page').then(m => m.RegisterPage),
  },

  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },

  
  { path: 'sesiones', 
    loadComponent: () => import('./pages/sesiones/sesiones.page').then(m => m.SesionesPage) 
  },

  { path: 'sesiones/:id', 
    loadComponent: () => import('./pages/sesiones-detalle/sesiones-detalle.page').then(m => m.SesionesDetallePage) 
  },

  {
    path: 'foro',
    loadComponent: () => import('./pages/foro/foro.page').then( m => m.ForoPage)
  },

  {
    path: 'teleconsultas',
    loadComponent: () => import('./pages/teleconsultas/teleconsultas.page').then( m => m.TeleconsultasPage)
  },
  
  {
    path: 'teleconsultas-detalle',
    loadComponent: () => import('./pages/teleconsultas-detalle/teleconsultas-detalle.page').then( m => m.TeleconsultasDetallePage)
  },

  { 
    path: 'teleconsultas/:id', 
    loadComponent: () => import('./pages/teleconsultas-detalle/teleconsultas-detalle.page').then(m => m.TeleconsultasDetallePage) 
  },

  


  { 
    path: '**', 
    redirectTo: 'home' 
  },
  


  
  


];
