import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
// Material modules
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {TranslateModule} from '@ngx-translate/core';
import { ModalMessageComponent } from './shared/modals/modal-message/modal-message.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: 
  [MainComponent,
    ModalMessageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MainRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    TranslateModule,
    MatDialogModule, //Modulo para los dialogos
    MatTabsModule,
    MatTooltipModule,
  ], 
  entryComponents: [
    ModalMessageComponent
  ],
  
})
export class MainModule { }
