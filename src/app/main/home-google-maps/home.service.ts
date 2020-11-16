import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { RealtimeService } from 'utils';
import { VehiclesStatus } from '../shared/enums/vehicles-status.enum';

import { HomeSettings, ReferenceSystems } from '../shared/models/home-settings.model';
import { VehicleTrackingDto } from '../shared/models/vehicle-tracking.model';
import { VehicleDto } from '../shared/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  public vehiclesTracking: Observable<VehicleTrackingDto>;
  private vehiclesTrackingA: Array<VehicleTrackingDto> = [
    { latitude: 18.0615108, longitude: -92.9275847, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0531057, longitude: -92.9268551, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0396811, longitude: -92.9286576, velocity: 0, statusId: 2, imei: '0987654321' },
    { latitude: 18.0194913, longitude: -92.9359639, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0176752, longitude: -92.9435385, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0176752, longitude: -92.9435385, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0048347, longitude: -92.953114,  velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 17.9987227, longitude: -92.9578561, velocity: 0, statusId: 1, imei: '0987654321' }
  ];

  private vehicleTrackingSource: Subject<VehicleTrackingDto>;
  private counter: number;
  constructor(realtimeService: RealtimeService) {
    this.counter = 0;
    this.vehicleTrackingSource = new Subject<VehicleTrackingDto>();
    this.vehiclesTracking = this.vehicleTrackingSource.asObservable();
    setInterval(() => {
      this.vehicleTrackingSource.next(this.vehiclesTrackingA[this.counter]);
      this.counter++;
      if (this.counter === this.vehiclesTrackingA.length) {
        this.counter = 0;
      }
    }, 10000);
  }


  public getHomeSettings(): Observable<HomeSettings> {
    const settings: HomeSettings = { mapZoomLevel: 5, mapCenter: [49, -126], baseMap: 'hybrid', referenceSystem: ReferenceSystems.GPS };
    return of(settings);
  }


  /** Obtiene los vehiculos desde el servidor */
  getVehicles(): Observable<Array<VehicleDto>> {
    return of([
      { name: 'A3', description: 'Audi WTW-2898', imei: '1234567890', vehicleTypeId: 0, oid: 1, tracking: null, status: VehiclesStatus.Normal },
      { name: 'Ford', description: 'F350 ETP-5272', imei: '0987654321', vehicleTypeId: 1, oid: 2, tracking: null, status: VehiclesStatus.Normal }
    ]);
}

getVehiclesWithLasTracking(): Observable<Array<VehicleDto>> {
  return of([
    { name: 'A3', description: 'Audi WTW-2898', imei: '1234567890', vehicleTypeId: 0, oid: 1, status: VehiclesStatus.Normal, tracking: [
      { oid: 1, latitude: 40.73061, longitude: 73.935242, name: 'A3', description: '', statusId: 0, imei: '1234567890', velocity: 123 }
    ] },
    { name: 'Ford', description: 'F350 ETP-5272', imei: '0987654321', vehicleTypeId: 1, oid: 2, status: VehiclesStatus.Normal, tracking: [
      { oid: 2, latitude: 32.06485, longitude: 34.763226, name: 'Ford', description: '', statusId: 0, imei: '0987654321', velocity: 345 }

    ] }
  ]);
}


}
