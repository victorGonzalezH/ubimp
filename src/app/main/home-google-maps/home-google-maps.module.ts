import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeGoogleMapsRoutingModule } from './home-google-maps-routing.module';
import { HomeGoogleMapsComponent } from './home-google-maps.component';
import { GoogleMapComponent } from 'src/app/google-map/google-map.component';


@NgModule({
  declarations: [HomeGoogleMapsComponent, GoogleMapComponent],
  imports: [
    CommonModule,
    HomeGoogleMapsRoutingModule
  ]
})
export class HomeGoogleMapsModule { }
