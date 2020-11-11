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
    loadChildren: () => import('./home-google-map/home-google-map.module').then(m => m.HomeGoogleMapModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
