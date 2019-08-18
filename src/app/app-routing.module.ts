import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes =
[
  {
    path: '',
    redirectTo: 'default',
    pathMatch: 'full'
  },
  {
    path: 'default',
    loadChildren: () => import('./internal/default/default.module')
    .then(mod => mod.DefaultModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
