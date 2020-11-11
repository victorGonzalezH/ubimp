import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {TranslateModule} from '@ngx-translate/core';

import { AgmCoreModule } from '@agm/core';


import { HomeGoogleMapRoutingModule } from './home-google-map-routing.module';
import { HomeGoogleMapComponent } from './home-google-map.component';

import { GoogleMapComponent } from 'src/app/google-map/google-map.component';

import { HomeService } from './home.service';

@NgModule({
  declarations: [HomeGoogleMapComponent, GoogleMapComponent],
  imports: [
    CommonModule,
    HomeGoogleMapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    TranslateModule,
    MatProgressSpinnerModule,
    AgmCoreModule
  ], providers : [ HomeService ]
})
export class HomeGoogleMapModule { }
