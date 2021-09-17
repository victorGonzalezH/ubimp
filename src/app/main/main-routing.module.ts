import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';

const routes: Routes = [

  // { path: '',
  //   component: MainComponent,
  //   loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  // },

  { path: '',
    redirectTo: 'home', pathMatch: 'full',
  },
  { path: 'home',
    component: MainComponent,
    loadChildren: () => import('./home-google-maps/home-google-maps.module').then(m => m.HomeGoogleMapsModule)
  },

  { path: 'home/home',
    component: MainComponent,
    loadChildren: () => import('./home-google-maps/home-google-maps.module').then(m => m.HomeGoogleMapsModule)
  },

  { path: 'settings/home',
    redirectTo: 'home', pathMatch: 'full',
  },

  { path: 'settings/settings',
    redirectTo: 'settings', pathMatch: 'full',
  },

  { path: 'settings/geozones',
    redirectTo: 'geozones', pathMatch: 'full',
  },

  { 
    path: 'settings',
    component: MainComponent,
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) 
  },

  { 
    path: 'geozones',
    component: MainComponent,
    loadChildren: () => import('./geozones/geozones.module').then(m => m.GeozonesModule) 
  },

  { 
    path: 'geozones/geozones',
    redirectTo: 'settings', pathMatch: 'full',
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
