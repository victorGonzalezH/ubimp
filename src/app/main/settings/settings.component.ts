import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { AddVehicleComponent } from './modals/add-vehicle/add-vehicle.component';

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
  
  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry,
              private dialog: MatDialog) { 

          this.showAddVehicleButton = true;
          this.matIconRegistry.addSvgIcon('car', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/car.svg'));

  }

  ngOnInit(): void {
  }


  addVehicle() {
    const dialogRef = this.dialog.open(AddVehicleComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });
  }

  onSelectedTabChange() {
    switch(this.selectedTab) {
      case 0: 
      this.showAddVehicleButton = true;
        break;

      default: 
        this.showAddVehicleButton = false;
      break;
    }
  }
}
