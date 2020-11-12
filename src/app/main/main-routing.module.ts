import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';

const routes: Routes = [

  // { path: '',
  //   component: MainComponent,
  //   loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  // },
  { path: '',
  component: MainComponent,
  loadChildren: () => import('./home-google-maps/home-google-maps.module').then(m => m.HomeGoogleMapsModule)
  },
  { path: 'customers', loadChildren: () => import('./home-google-maps/home-google-maps.module').then(m => m.HomeGoogleMapsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
