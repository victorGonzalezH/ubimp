import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from './settings.service';
import { AddVehicleComponent } from './modals/add-vehicle/add-vehicle.component';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AddVehicle } from './models/add-vehicle.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

  groups: [];
  
  showAddVehicleButton: boolean;

  public selectedTab: number;
  
  constructor(private settingsService: SettingsService, private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry,
              private dialog: MatDialog, private appConfigService: AppConfigService) { 

          this.showAddVehicleButton = true;
          this.matIconRegistry.addSvgIcon('car', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/car.svg'));
  }

  ngOnInit(): void {
    this.settingsService.getVehiclesGroup()
    .subscribe( result => console.log(result) );
  }


  addVehicle() {
    const dialogRef = this.dialog.open(AddVehicleComponent, { width: this.appConfigService.currentWindowConfig.modalSize, disableClose: true});

    dialogRef.afterClosed().subscribe((addVehicle: AddVehicle) => {
      if (addVehicle.imei !== undefined) {
        this.settingsService.saveVehicle(addVehicle)
        .subscribe(result => console.log(result) );
      }
    });
  }

  onSelectedTabChange() {
    switch(this.selectedTab) {
      case 0:
      case 1:
      this.showAddVehicleButton = true;
        break;

      default: 
        this.showAddVehicleButton = false;
      break;
    }
  }
}
