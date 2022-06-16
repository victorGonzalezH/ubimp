import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { ObjectType } from '../../models/object-types.model';
import { SettingsService } from '../../settings.service';
import { AddVehicle } from '../../models/add-vehicle.model';
import { Subscription } from 'rxjs';
import { StorageService, StorageType } from 'utils';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { Vehicle, VehicleDto, VehicleGroupDto } from 'src/app/main/shared/models/vehicle.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-add-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrls: ['./add-edit-vehicle.component.css']
})
export class AddEditVehicleComponent implements OnInit, OnDestroy {

  public vehiclesGroups: Array<VehicleGroupDto>;
  public brands: Array<any>;
  public models: Array<any>;
  public devices: Array<any>;
  private objectTypes: ObjectType[];
  private brandsSubs: Subscription;
  private devicesSubs: Subscription;
  private objectTypesSubs: Subscription;
  private vehiclesGroupsSubs: Subscription;
  private currentUser: any;
  private defaultLanguage: string;
  public addingVehicleGroup: boolean;
  public newVehicleGroupName: string;
  public vehicle: VehicleDto;
  public isAddingVehicle: boolean;
  public addVehicle = { } as AddVehicle;
  get selectedObjectTypeTag() {
    return this.addVehicle.objectTypeId != undefined ? this.objectTypes.filter( objectType => objectType.uiId === parseInt(this.addVehicle.objectTypeId))[0].displayNameTag: '';
  }

  get objectTypeAsNumber() {
    return this.addVehicle.objectTypeId != undefined? parseInt(this.addVehicle.objectTypeId): undefined;
  }

  constructor(private settingsService: SettingsService,
              private storageService: StorageService,
              private appConfigService: AppConfigService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.addingVehicleGroup = false;
                this.vehicle = data.vehicle;
                this.isAddingVehicle = this.vehicle !== undefined ? false: true;
                if(this.isAddingVehicle == false) {
                  this.addVehicle.description = this.vehicle.description;
                  this.addVehicle.vehicleGroupName = this.vehicle.vehicleGroupName;
                  this.addVehicle.objectTypeId = this.vehicle.objectTypeId;
                  this.addVehicle.name = this.vehicle.name;
                  this.addVehicle.year = this.vehicle.year;
                  this.addVehicle.licensePlate = this.vehicle.licensePlate;
                }
              }
  
  
  ngOnInit(): void {
      this.defaultLanguage = this.storageService.retrieve(this.appConfigService.defaultLanguage, StorageType.Session);
      this.currentUser = JSON.parse(this.storageService.retrieve(this.appConfigService.currentUserKey, StorageType.Session));
      this.addVehicle.username = this.currentUser.username;
      //Getting available devices
      this.devicesSubs = this.settingsService.getDevicesByAssigned(false, this.currentUser.username)
      .subscribe(response => 
        { 
          this.devices = response.data;
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
          if(this.isAddingVehicle == false) {
            this.addVehicle.brand = this.vehicle.brand;
            const selectedBrand = this.brands.filter(brand => brand.name === this.addVehicle.brand)[0];
            this.models = selectedBrand.models;
            this.addVehicle.model = this.vehicle.model;
          }
        }); 
        
        //Getting vehicles groups
        this.vehiclesGroupsSubs = this.settingsService.getVehiclesGroups(this.currentUser.username, this.defaultLanguage)
        .subscribe(response => {
          this.vehiclesGroups = response.data;
        });
  }


  addVehicleGroup() {
    this.addingVehicleGroup = true;
  }

  
  saveVehicleGroup() {

    this.addingVehicleGroup = false;
    if(this.newVehicleGroupName != undefined && this.newVehicleGroupName != "") {
      const newVehicleGroup: VehicleGroupDto = {
        name: this.newVehicleGroupName,
        order: this.vehiclesGroups.length + 1,
        vehicles: [],
        visible: true,
      };

      this.vehiclesGroups.push(newVehicleGroup);
    }
    
  }

  onBrandChange(event: MatSelectChange) {
    const selectedBrandId = event.value;
    const selectedBrand = this.brands.filter(brand => brand.name === selectedBrandId)[0];
    this.models = selectedBrand.models;
  }



  ngOnDestroy(): void {
    this.brandsSubs.unsubscribe();
    this.devicesSubs.unsubscribe();
    this.objectTypesSubs.unsubscribe();
    this.vehiclesGroupsSubs.unsubscribe();
  }
}
