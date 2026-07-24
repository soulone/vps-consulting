import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./nosotros/nosotros.component').then(m => m.NosotrosComponent),
  },
  {
    path: 'servicios/ventilacion',
    loadComponent: () => import('./servicios/ventilacion/ventilacion.component').then(m => m.VentilacionComponent),
  },
  {
    path: 'servicios/bombeo',
    loadComponent: () => import('./servicios/bombeo/bombeo.component').then(m => m.BombeoComponent),
  },
  {
    path: 'servicios/planeamiento',
    loadComponent: () => import('./servicios/planeamiento/planeamiento.component').then(m => m.PlaneamientoComponent),
  },
];
