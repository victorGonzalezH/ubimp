import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { ObjectType } from '../../models/object-types.model';
import { SettingsService } from '../../settings.service';
import { AddVehicle } from '../../models/add-vehicle.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit, OnDestroy {

  public brands: Array<any>;
  public models: Array<any>;
  public devices: Array<any>;
  private objectTypes: ObjectType[];
  private brandsSubs: Subscription;
  private devicesSubs: Subscription;
  private objectTypesSubs: Subscription;
  
  get selectedObjectTypeTag() {
    return this.addVehicle.objectType !== undefined ? this.objectTypes.filter( objectType => objectType.uiId === parseInt(this.addVehicle.objectType))[0].displayNameTag: '';
  }

  get objectTypeAsNumber() {
    return this.addVehicle.objectType !== undefined? parseInt(this.addVehicle.objectType): undefined;
  }

  constructor(private settingsService: SettingsService, private translateService: TranslateService) { }
  
  public addVehicle = { } as AddVehicle;
  ngOnInit(): void {

       //Getting available devices
      this.devicesSubs = this.settingsService.getDevicesByAssigned(false)
      .subscribe(response => 
        { 
          this.devices = response.data 
        })
        
        //Getting objects types
        this.objectTypesSubs = this.settingsService.getObjectsTypes()
        .subscribe(response => {
          this.objectTypes = response;
        });

        //Getting brands with models
        this.brandsSubs = this.settingsService.getBrandsWithModels()
        .subscribe(response => {
          this.brands = response.data;
        });

  }

  
  onBrandChange(event: MatSelectChange) {
    const selectedBrandId = event.value;
    const selectedBrand = this.brands.filter(brand => brand.id === selectedBrandId)[0];
    this.models = selectedBrand.models;
  }

  ngOnDestroy(): void {
    this.brandsSubs.unsubscribe();
    this.devicesSubs.unsubscribe();
    this.objectTypesSubs.unsubscribe();
  }
}
