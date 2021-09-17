import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VehicleGroupDto } from '../shared/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  getVehiclesGroup(): Observable<Array<VehicleGroupDto>> {
    return of([
      // { name: 'A3', description: 'Audi WTW-2898', imei: '866044051234947', vehicleTypeId: 0, oid: 1, online: true, status: VehiclesStatus.Normal, id: 1,
      // // tracking: []
      //   // { oid: 1, latitude: 40.73061, longitude: 73.935242, name: 'A3', description: '', statusId: 0, imei: '1234567890', speed: 123 }
      //  },
      // { name: 'Ford', description: 'F350 ETP-5272', imei: '0987654321', vehicleTypeId: 1, oid: 2, online: true, status: VehiclesStatus.Normal, id: 2,
      // // tracking: []
      //   // { oid: 2, latitude: 32.06485, longitude: 34.763226, name: 'Ford', description: '', statusId: 0, imei: '0987654321', speed: 345 }
      //  }
    ]);
  }
}