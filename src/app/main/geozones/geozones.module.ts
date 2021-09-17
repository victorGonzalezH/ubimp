import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeozonesRoutingModule } from './geozones-routing.module';
import { GeozonesComponent } from './geozones.component';


@NgModule({
  declarations: [GeozonesComponent],
  imports: [
    CommonModule,
    GeozonesRoutingModule
  ]
})
export class GeozonesModule { }
