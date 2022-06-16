import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from './settings.service';
import { AddEditVehicleComponent } from './modals/add-vehicle/add-edit-vehicle.component';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AddVehicle } from './models/add-vehicle.model';
import { StorageService, StorageType } from 'utils';
import { Subscription } from 'rxjs';
import { OkCancelDialogComponent } from 'src/app/shared/modals/ok-cancel-dialog/ok-cancel-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { VehicleDto, VehicleGroupDto } from '../shared/models/vehicle.model';
import { MatSelectionList } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SimpleMessageComponent } from 'src/app/shared/modals/simple-message/simple-message.component';
import { EditVehicle } from './models/edit-vehicle.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {

  groups: [];
  private currentUser: any;
  private defaultLanguage: string;
  private getVehiclesGroupSubs: Subscription;
  private lastVehicleGroupName: string;
  public isSmallScreen: boolean;
  showAddVehicleButton: boolean;
  @ViewChild('vehiclesList') public vehiclesList: MatSelectionList;
  public selectedTab: number;
  public isListItemSelected: boolean;
  public currentVehicleName: string;
  public currentGroupName: string;
  private currentVehicle: VehicleDto;
  constructor(private settingsService: SettingsService, private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry,
              private dialog: MatDialog, private appConfigService: AppConfigService,
              private storageService: StorageService,
              private translateService: TranslateService,
              private breakpointObserver: BreakpointObserver) { 

          this.showAddVehicleButton = true;
          this.isListItemSelected = false;
          this.matIconRegistry.addSvgIcon('car', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/car.svg'));
  }
  

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.storageService.retrieve(this.appConfigService.currentUserKey, StorageType.Session));
    this.defaultLanguage = this.storageService.retrieve(this.appConfigService.defaultLanguage, StorageType.Session);
    this.getVehiclesGroupSubs = this.settingsService.getVehiclesGroups(this.currentUser.username, this.defaultLanguage)
    .subscribe(response => {
      this.groups = response.data;
      
    });

    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 400px)');

    this.breakpointObserver.observe('(max-width: 400px)').subscribe(result => {
      if (result.matches === true)  {
        this.isSmallScreen = true;
      }
      else
        this.isSmallScreen = false;
    });

  }


  /**
   * 
   * @param isAddingVehicle Indicates the action to perform
   * @param vehicle 
   */
  addEditVehicle(isAddingVehicle: boolean, event: Event, vehicle?: VehicleDto) {
  event.stopPropagation();
  let vehicleFirstSnapshot: VehicleDto;
   if(!isAddingVehicle) {
    vehicleFirstSnapshot = vehicle != undefined? vehicle: this.currentVehicle;
    
   }
    const dialogRef = this.dialog.open(AddEditVehicleComponent, 
      { width: this.appConfigService.currentWindowConfig.modalSize,
        disableClose: true, data: { vehicle : vehicleFirstSnapshot }});

    dialogRef.afterClosed().subscribe((addVehicle: AddVehicle) => {
      
      if (addVehicle.imei !== undefined) {
        if(isAddingVehicle === true) {
          this.settingsService.saveVehicle(addVehicle)
          .subscribe(result => {
  
            if(result.isSuccess === true) {
              this.getVehiclesGroupSubs = this.settingsService.getVehiclesGroups(this.currentUser.username, this.defaultLanguage)
              .subscribe(response => {
                this.groups = response.data;
              });
            } 
            
          });
        }
      } else {

        //To guarantee that properties that
        //have changed will be mapped. Be carefull using this
        //technique
        const editVehicle: EditVehicle = {};
        Object.keys(addVehicle as EditVehicle).forEach(editKey => {
          const dtoProperty = Object.keys(vehicleFirstSnapshot)
          .filter(dtoKey => 
           {  
              if(editKey === dtoKey) return editKey;
              return undefined;
           })[0];
          if(dtoProperty != undefined &&
            dtoProperty !== null &&
             vehicleFirstSnapshot[dtoProperty] != addVehicle[editKey] ) {
             editVehicle[editKey] = addVehicle[editKey]
          }
        });


        const vehicleName = vehicle != undefined? vehicle.name: this.currentVehicleName;
        this.settingsService.updateVehicle(vehicleName, editVehicle)
        .subscribe(response => {
          
        });
      }
    });
  }

  
  /**
   * 
   * @param vehicleNameParam 
   * @param groupNameParam 
   */
  deleteVehicle(vehicleNameParam? : string, groupNameParam? : string) {
    const vehicleName = vehicleNameParam != undefined ? vehicleNameParam: this.currentVehicleName;
    const groupName   = groupNameParam != undefined ? groupNameParam: this.currentGroupName;
    const title = this.translateService.instant('settings.vehicle.delete.title');
    const message = (this.translateService.instant('settings.vehicle.delete.message') as string).replace("{vehicle-name}", vehicleName);
    const dialogRef = this.dialog.open(OkCancelDialogComponent, {data: { title: title, message: message }, width: this.appConfigService.currentWindowConfig.modalSize, disableClose: true});

    dialogRef.afterClosed().subscribe((result: any) => {
      this.resetSelection();
      if(result === true) {
        this.settingsService.deleteVehicle(vehicleName, groupName, this.defaultLanguage)
        .subscribe(response => {
          if(response.isSuccess === true) {
            this.getVehiclesGroupSubs = this.settingsService.getVehiclesGroups(this.currentUser.username, this.defaultLanguage)
            .subscribe(response => {
              this.groups = response.data;
            });
          } 
          else {
            const messageTitle = this.translateService.instant('settings.vehicle.delete.title');
            const message = response.userMessage;
          
            const dialogRef = this.dialog.open(SimpleMessageComponent, {
              data: { title: messageTitle, message: message }
            });
          }
        });
      }
      
    });
  }


  /**
   * 
   * @param groupName 
   */
  deleteGroup(groupName: string) {
    this.settingsService.deleteGroup(groupName, this.defaultLanguage)
    .subscribe(response => {

      if(response.isSuccess === true) {
        this.getVehiclesGroupSubs = this.settingsService.getVehiclesGroups(this.currentUser.username, this.defaultLanguage)
        .subscribe(response => {
          this.groups = response.data;
        });
      } else {
        
          const messageTitle = this.translateService.instant('settings.group.delete.title');
          const message = response.userMessage;
          
          const dialogRef = this.dialog.open(SimpleMessageComponent, {
            data: { title: messageTitle, message: message }
          });
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


  editVehicleGroup(vehicleGroup: VehicleGroupDto, editingFlag: boolean) {
    if(editingFlag === true) {
      this.lastVehicleGroupName = vehicleGroup.name;
    }
    vehicleGroup.editing = editingFlag;
    
    if(vehicleGroup.name == '') {
      vehicleGroup.name = this.lastVehicleGroupName;
      this.lastVehicleGroupName = '';
    }
  }


  itemClick(vehicle: VehicleDto, groupName: string) {
    if(vehicle.name === this.currentVehicleName) {
      this.resetSelection();
    } 
    else
    {
      this.currentVehicleName = vehicle.name;
      this.currentVehicle = vehicle;
      this.currentGroupName = groupName;
      this.isListItemSelected = true;
    }
    
  }


  groupClick() {
    this.resetSelection();
  }


  resetSelection() {
    this.vehiclesList.deselectAll();
    this.currentVehicleName = null;
    this.currentGroupName = null;
    this.isListItemSelected = false;
  }

  ngOnDestroy(): void {
    this.getVehiclesGroupSubs.unsubscribe();    

  }

}

