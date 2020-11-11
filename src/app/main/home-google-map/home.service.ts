import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HomeSettings, ReferenceSystems } from '../shared/models/home-settings.model';
import { VehicleDto } from '../shared/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }


  public getHomeSettings(): Observable<HomeSettings> {
    const settings: HomeSettings = { mapZoomLevel: 5, mapCenter: [49, -126], baseMap: 'hybrid', referenceSystem: ReferenceSystems.GPS };
    return of(settings);
  }


  /** Obtiene los vehiculos desde el servidor */
  getVehicles(): Observable<Array<VehicleDto>> {
    return of([
      { name: 'A3', description: 'Audi WTW-2898', imei: '1234567890', vehicleTypeId: 0, oid: 1 },
      { name: 'Ford', description: 'F350 ETP-5272', imei: '0987654321', vehicleTypeId: 1, oid: 2 }
    ]);
}


}
