import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard/dashboard-page').then((m) => m.DashboardPage) },
  { path: 'projects/:slug', loadComponent: () => import('./project/setup-sheet-page').then((m) => m.SetupSheetPage) },
  { path: '**', loadComponent: () => import('./not-found-page').then((m) => m.NotFoundPage) },
];
