import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'utils';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
// import { HomeComponent } from './internal/default/home/home.component';



const routes: Routes =
[
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthenticationGuard],
    children:
    [
        {  path: '', component: HomeComponent },

    ]
  },
  {
    // Ruta hacia el login
    path: 'login',
    // loadChildren es usado para carga sobre demanda (lazy loading) y ademas usa
    // la sintaxis import (propia del navegador) para importaciones dinamicas. La ruta
    // (en esta caso /login/login.module) es relativa
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
