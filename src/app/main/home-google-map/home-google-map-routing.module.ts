import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeGoogleMapComponent } from './home-google-map.component';

const routes: Routes = [{ path: '', component: HomeGoogleMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeGoogleMapRoutingModule { }
