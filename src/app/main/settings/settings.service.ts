import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { DataService, DataServiceProtocols, ResponseTypes } from 'utils';
import { VehicleGroupDto } from '../shared/models/vehicle.model';
import { ObjectType } from './models/object-types.model';
import { ApiResultBase } from 'utils';
import { AddVehicle } from './models/add-vehicle.model';
import { EditVehicle } from './models/edit-vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private dataService: DataService, private appConfigService: AppConfigService) { }

  /**
   * 
   * @param username 
   * @returns 
   */
  getVehiclesGroups(username: string, lang: string): Observable<ApiResultBase> {
    return this.dataService.get(this.appConfigService.apiUrl + '/vehicles/groups?username=' + username + '&lang=' + lang, null, null, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null)
    .pipe(catchError(error => throwError(error) ));
  }


  /**
   * Gets the assigned or no assigned devices
   * @param assigned 
   * @returns 
   */
  getDevicesByAssigned(assigned: boolean, username: string): Observable<ApiResultBase> {

    return this.dataService.get(this.appConfigService.apiUrl + '/devices', [ { name: 'isAssigned', value: assigned }, { name: 'username', value: username } ], null, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);
  }


  /**
   * Returns the objects types that can be added to the objects users. [At this moment, we choose the  client only
   * approach to get the objects types, instead of be saved in the database and get them through their web api]
   * @returns 
   */
  getObjectsTypes() {
    const objectsTypes: ObjectType[] = [
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.car', uiId: 1 },
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.taxi', uiId: 2 },
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.pickup', uiId: 3 },
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.truck', uiId: 4 },
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.motorcycle', uiId: 5 },
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.bicycle', uiId: 6 },
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.person', uiId: 7 },
      { displayNameTag: 'settings.addVehicle.catalogs.objectsTypes.location', uiId: 8 }
    ];

      return of(objectsTypes);
  }

  /**
   * 
   * @returns Get the vehicle brands with models within it
   */
  getBrandsWithModels() {
    
    return this.dataService.get(this.appConfigService.apiUrl + '/brands/models', null, null, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);
  
  }


  /**
   * Save a vehicle
   * @param addVehicle 
   * @returns 
   */
  saveVehicle(addVehicle: AddVehicle): Observable<ApiResultBase> {
    return this.dataService.post(this.appConfigService.apiUrl + '/vehicles', addVehicle, null, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);
  }

  /**
   * 
   * @param vehicleName name of the vehicle
   * @returns 
   */
  deleteVehicle(vehicleName: string, groupName: string, lang: string): Observable<ApiResultBase> {

    return this.dataService.delete(this.appConfigService.apiUrl + '/vehicles?vehiclename=' + vehicleName + '&groupname=' + groupName + '&lang=' + lang, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);

  }

  /**
   * Deletes a vehicle group
   * @param groupName 
   * @returns 
   */
  deleteGroup(groupName: string, lang: string) : Observable<ApiResultBase> {
    return this.dataService.delete(this.appConfigService.apiUrl + '/vehicles/groups?groupname=' + groupName + '&lang=' + lang, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);
  }


  /**
   * Updates a vehicle
   * @param vehicleName The vehicle name to be updated 
   * @param editVehicle part to update
   * @returns 
   */
  updateVehicle(vehicleName: string, editVehicle: EditVehicle) : Observable<ApiResultBase>  {
    return this.dataService.put(this.appConfigService.apiUrl + '/vehicles/' + vehicleName, editVehicle, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);
  }

}