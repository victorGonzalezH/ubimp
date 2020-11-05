import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'utils';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
// import { HomeComponent } from './internal/default/home/home.component';



const routes: Routes =
[
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canActivate: [AuthenticationGuard]
  },
  {
    // Ruta hacia el login
    path: 'login',
    // loadChildren es usado para carga sobre demanda (lazy loading) y ademas usa
    // la sintaxis import (propia del navegador) para importaciones dinamicas. La ruta
    // (en esta caso /login/login.module) es relativa
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },

  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) }

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
