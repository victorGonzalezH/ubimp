import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeGoogleMapsRoutingModule } from './home-google-maps-routing.module';
import { HomeGoogleMapsComponent } from './home-google-maps.component';
import { GoogleMapComponent } from 'src/app/google-map/google-map.component';

import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule } from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [HomeGoogleMapsComponent, GoogleMapComponent],
  imports: [
    CommonModule,
    HomeGoogleMapsRoutingModule,

    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class HomeGoogleMapsModule { }
