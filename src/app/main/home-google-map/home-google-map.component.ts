import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeolocationService, MessengerService, RealtimeService, UtilsService } from 'utils';
import { HomeService } from './home.service';
import { Vehicle, VehicleDto, VehiclesFactory } from '../shared/models/vehicle.model';
import { GoogleMapComponent } from 'src/app/google-map/google-map.component';
import { Marker } from 'src/app/google-map/models/marker.model';


@Component({
  selector: 'app-home-google-map',
  templateUrl: './home-google-map.component.html',
  styleUrls: ['./home-google-map.component.css']
})
export class HomeGoogleMapComponent implements OnInit {

  private map: google.maps.Map;
  settingsOpened: boolean;
  settingsOpenedObs: Observable<boolean>;
  public vehicles: Array<Vehicle>;
  private currentPosition: Position;
  public homeInputs: { realTimeEnabled: boolean, autoZoomEnabled: boolean };
  private currentPositionSubject: Subject<Array<number>>;
  public currentPositionObs: Observable<Array<number>>;
  private subscriptions: Subscription[];
  /** Objeto que contiene los vehiculos que son obtenidos desde el servidor */
  private vehiclesObject = { };

  // Grupo de los tipos de vehiculos
  private vehiclesTypesGrouped: Map<any, any>;

  // Propiedades para el mapa
  private mapCenter: Array<number>;
  public basemap: string;
  public mapZoomLevel: number;
  public referenceSystem: number;

  // Arreglo de la dupla statusKey/Color
  private statusKeysAndColors: Map<number, string>;

  @ViewChild(GoogleMapComponent) googleMapComp: GoogleMapComponent;

  public markers: Marker[];

  constructor(private homeService: HomeService, private messengerService: MessengerService, private geolocationService: GeolocationService, private realtimeService: RealtimeService) {
    this.homeInputs = { autoZoomEnabled: true, realTimeEnabled: true };

  }

  ngOnInit(): void {

     // Se obtienen los vehiculos
     this.homeService.getVehicles()
     .subscribe(vehiclesDto => {

       this.vehicles             = this.convertToVehicles(vehiclesDto);

       this.vehiclesObject       = this.convertToVehiclesObject(this.vehicles);
       this.vehiclesTypesGrouped = UtilsService.groupBy(this.vehicles, vehicle => vehicle.vehicleType);

     });

     this.currentPositionSubject = new Subject<Array<number>>();
     this.currentPositionObs      = this.currentPositionSubject.asObservable();
     this.subscriptions          = [];
    // this.statusKeysAndColors    = this.setAndGetStatusKeyAndColorsMap();
     this.subscriptions.push(this.globalGetAndSetHomeSettings());

     this.globalSetSideNav();
  }

  /** Configura la barra lateral derecha. Usa variables globales */
  private globalSetSideNav() {
    this.settingsOpenedObs =  this.messengerService.getStringsMessenger().pipe(map( eventName => {
      this.settingsOpened = !this.settingsOpened;
      return this.settingsOpened;
 }));
  }


  // Funciones
  homeInputsRealTimeEnabledChange(event) {
    console.log(event);
}

homeInputsAutoZoomEnabledChange(value) {
  console.log(value);
}

    /**
     * Establece la configuracion para obtener la ubicacion del usuario. Usa variables globales
     */
    private globalSetUserGeolocationAndSetMapCenter() {
      // Si el servicio no esta observando los cambios de posicion entonces se activan
      if (this.geolocationService.isWatchingLocation() === false) {
        this.geolocationService.startWatching(true, 15000, 8000);
      }

      this.geolocationService.getGeolocationObserver()
      .subscribe((newPosition) => {
          this.currentPosition  = newPosition;
          if ( newPosition !== null && newPosition !== undefined) {
            this.googleMapComp.latitude = newPosition.coords.latitude;
            this.googleMapComp.longitude = newPosition.coords.longitude;
           }
        } );
    }


    /**
     * Obtiene la configuracion del componente home
     */
  private globalGetAndSetHomeSettings() {
    return this.homeService.getHomeSettings().subscribe(homeSettings => {

      this.mapCenter        = homeSettings.mapCenter;
      this.mapZoomLevel     = homeSettings.mapZoomLevel;
      this.basemap          = homeSettings.baseMap;
      this.referenceSystem  = homeSettings.referenceSystem;

    });
  }

// Eventos
onMapReady(mapParameter: any){
    this.map = mapParameter;
    this.globalSetUserGeolocationAndSetMapCenter();
    this.markers              = this.vehicles.map<Marker>(vehicle =>  {

        return {label: vehicle.description, lat: 18.0679646, lng: -92.934682, draggable : false,
          iconUrl: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        };

      } );

  }

  /** Convierte los vehiculos obtenidos desde el servidor (Dto's) a objetos tipo vehiculos */
  convertToVehicles(vehiclesDto: Array<VehicleDto>): Array<Vehicle> {

    return vehiclesDto.map(vehicleDto =>  VehiclesFactory.createVehicle(vehicleDto.name, vehicleDto.description, vehicleDto.imei, vehicleDto.vehicleTypeId, vehicleDto.oid));
   }


   convertToVehiclesObject(vehicles: Array<Vehicle>) {
    const vehiclesObject = {};
    vehicles.forEach(vehicle => vehiclesObject[vehicle.imei] = vehicle );
    return vehiclesObject;
 }
}
