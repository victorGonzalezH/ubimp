import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeGoogleMapsComponent } from './home-google-maps.component';

const routes: Routes = [{ path: '', component: HomeGoogleMapsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeGoogleMapsRoutingModule { }
