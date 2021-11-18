import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeolocationService, RealtimeService, StorageService, StorageType } from 'utils';
import { AppConfigService } from '../../shared/services/app-config.service';
import { VehiclesStatus } from '../shared/enums/vehicles-status.enum';

import { HomeSettings, ReferenceSystems } from '../shared/models/home-settings.model';
import { VehicleTrackingDto } from '../shared/models/vehicle-tracking.model';
import { VehicleDto } from '../shared/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  readonly USER_LOCATION_HIGH_ACCURACY = true;
  readonly USER_LOCATION_MAX_AGE = 0;
  readonly USER_LOCATION_TIME_OUT = 5000;

  
  /**
   * Observable para las nuevas ubicaciones
   */
  get vehiclesTracking(): Observable<VehicleTrackingDto> 
  {
      // Cuando el componente que haga uso del servicio homeService al momento de acceder
      // a esta propiedad el servicio se suscribe al observable del servicio de ubicaciones
      // (Se suscribe a el evento 'newLocation' que es en donde se recibiran las ubicaciones)
      return this.locationsService.addEvent('newLocation')
      .pipe(map( nl => 
        { 
          const vehicleTrackingDto: VehicleTrackingDto = 
          {
            latitude: nl.latitude,
            longitude: nl.longitude,
            speed: nl.speed,
            imei: nl.imei.toString(),
            statusId: nl.statusId
          };
          return vehicleTrackingDto;
        }));
  }

  constructor(private locationsService: RealtimeService,
              private userGeoLocationService: GeolocationService,
              private appConfigService: AppConfigService,
              private storageService: StorageService) {
  
    const userString = this.storageService.retrieve(this.appConfigService.currentUserKey, StorageType.Session);
    
    const user = JSON.parse(userString);

    // Se conecta el servicio de ubicaciones al servicio de tiempo real
    this.locationsService.connect(this.appConfigService.realTimeUrl, user.token);
    
    
    // this.vehicleTrackingSource = new Subject<VehicleTrackingDto>();
    // this.vehiclesTracking = this.vehicleTrackingSource.asObservable();


    // Si el servicio no esta observando los cambios de posicion entonces se activan
    if (this.userGeoLocationService.isWatchingLocation() === false) {
      // console.log('no watching');
      const result = this.userGeoLocationService.startWatching(this.USER_LOCATION_HIGH_ACCURACY, this.USER_LOCATION_MAX_AGE, this.USER_LOCATION_TIME_OUT);
    }
    else
    {
      // console.log('already watching');
    }
  }


  public getHomeSettings(): Observable<HomeSettings> {
    const settings: HomeSettings = { mapZoomLevel: 5, mapCenter: [49, -126], baseMap: 'hybrid', referenceSystem: ReferenceSystems.GPS };
    return of(settings);
  }


  /** Obtiene los vehiculos desde el servidor */
//   getVehicles(): Observable<Array<VehicleDto>> {
//     return of([
//       { name: 'A3', description: 'Audi WTW-2898', imei: '1234567890', vehicleTypeId: 0, oid: 1, tracking: null, online: true,  status: VehiclesStatus.Normal, id: 1  },
//       { name: 'Ford', description: 'F350 ETP-5272', imei: '0987654321', vehicleTypeId: 1, oid: 2, tracking: null, online: true, status: VehiclesStatus.Normal, id: 2 }
//     ]);
// }

getVehiclesWithLasTracking(): Observable<Array<VehicleDto>> {
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


/**
 * Observable para las ubicaciones de la posicion del usuario
 */
get userLocation(): Observable<any> {

  return this.userGeoLocationService.geolocationObs;

}



}
