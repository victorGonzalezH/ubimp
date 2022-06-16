import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import {TranslateModule} from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddEditVehicleComponent } from './modals/add-vehicle/add-edit-vehicle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { SwitchMulticasePipe } from '../../shared/pipes/switch-multicase.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';




@NgModule({
  declarations: [SettingsComponent,
    AddEditVehicleComponent, SwitchMulticasePipe],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    TranslateModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ]
})
export class SettingsModule { }
