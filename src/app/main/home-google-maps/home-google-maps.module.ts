import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeGoogleMapsRoutingModule } from './home-google-maps-routing.module';
import { HomeGoogleMapsComponent } from './home-google-maps.component';


@NgModule({
  declarations: [HomeGoogleMapsComponent],
  imports: [
    CommonModule,
    HomeGoogleMapsRoutingModule
  ]
})
export class HomeGoogleMapsModule { }
