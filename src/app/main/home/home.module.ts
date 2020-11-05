import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { EsriMapComponent } from '../../esri-map/esri-map.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule } from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [HomeComponent, EsriMapComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    TranslateModule,
    MatProgressSpinnerModule
  ]
})
export class HomeModule { }
