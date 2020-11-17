import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { position } from 'esri/widgets/CoordinateConversion/support/Conversion';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { flatMap, map, switchMap } from 'rxjs/operators';
import { Marker } from 'src/app/google-map/models/marker.model';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { MessengerService, StorageService, StorageType } from 'utils';
import { VehicleTracking, VehicleTrackingDto } from '../shared/models/vehicle-tracking.model';
import { Vehicle, VehicleDto, VehiclesFactory } from '../shared/models/vehicle.model';
import { HomeService } from './home.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-home-google-maps',
  templateUrl: './home-google-maps.component.html',
  styleUrls: ['./home-google-maps.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeGoogleMapsComponent implements OnInit, AfterViewInit, AfterViewChecked {

  readonly ICONS_ON_MAP_DRAGABLES = false;
  readonly ICONS_ON_MAP_WIDTH     = 30;
  readonly ICONS_ON_MAP_HEIGHT    = 30;

  /**
   * Listado de los vehiculos
   */
  public vehicles: Vehicle[];

  /**
   * Marcadores del mapa, que representaran a los vehiculos
   */
  public markers: Marker[];

  /**
   * 
   */
  
  private markersSub: BehaviorSubject<Marker[]>;
  public markersObs: Observable<Marker[]>;

  private mapReady: boolean;

  /**
   * Propiedad de la interfaz de usuario home
   */

  public settingsOpenedObs: Observable<boolean>;
  public settingsOpened: boolean;

  public homeInputs: { realTimeEnabled: boolean, autoZoomEnabled: boolean, showUserLocation: boolean };

  public loading: boolean;

  public latitude: Observable<number>;

  public longitude: Observable<number>;


  public longitudeSub: BehaviorSubject<number>;

   /*
   * /////////////////////////////////////Funciones///////////////////////////////////
   */


  constructor(private homeService: HomeService, private messengerService: MessengerService,
              private translateService: TranslateService, private storageService: StorageService,
              private appConfigService: AppConfigService, private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.vehicles = [];
    this.mapReady = false;
    this.homeInputs = { autoZoomEnabled: true, realTimeEnabled: true, showUserLocation: true };
    this.loading = false;

    this.latitude = this.homeService.userLocation.pipe(map( userLocation => {
      if (this.homeInputs.showUserLocation === true) {
        return userLocation.coords.latitude;
      }
      return null;
    }));
    this.longitude = this.homeService.userLocation.pipe(map( userLocation => {
      if (this.homeInputs.showUserLocation === true) {
        return userLocation.coords.longitude;
      }

      return null;

    }));

    if (this.storageService.retrieve(this.appConfigService.defaultLanguage, StorageType.Session) == undefined) {

      // Se establece ingles como idioma por default.
      this.translateService.setDefaultLang('es');

    } else {

      const defaultLanguage = this.storageService.retrieve(this.appConfigService.defaultLanguage, StorageType.Session);
      this.translateService.setDefaultLang(defaultLanguage);
    }

    this.matIconRegistry.addSvgIcon('car', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/car.svg'));

  }

  private updateVehicles(vehicles: Vehicle[], tracking: VehicleTracking): Vehicle[] {

    const foundVehicle = vehicles.filter(vehicleToSearch => vehicleToSearch.imei === tracking.imei);
    if (foundVehicle != null && foundVehicle != undefined && foundVehicle.length > 0) {

      const oldVehicle: Vehicle = foundVehicle[0];
      const newVehicle: Vehicle =  VehiclesFactory.createVehicle( oldVehicle.name, oldVehicle.description, oldVehicle.imei, oldVehicle.vehicleType, oldVehicle.status, 0, oldVehicle.online, tracking.latitude, tracking.longitude, tracking.velocity);
      const index = vehicles.indexOf(oldVehicle);
      vehicles[index] = newVehicle;
      const myClonedArray = [];
      vehicles.forEach(val => myClonedArray.push(Object.assign({}, val)));
      return myClonedArray;
    } else {
      // Dado que no es posible que se obtenga un tracking de un vehiculo que que no esta en 
      // la lista de vehiculos no se contempla esta opcion
    }
  }


  homeInputsHandler(event: any, input: number) {

  }

   /*
   * Obtiene los vehiculos con su ultima ubacion registrada. Si no tiene ubicacion registrada
   * la propiedad tracking del vehiculo viene como arreglo vacio
   * @param setMarkers Indica si se establecen o no los marcadores en el mapa
   */
  private getVehiclesWithLastTracking(){
    this.homeService.getVehiclesWithLasTracking()
    .subscribe( {
      error: (error) => {
        this.loading = false;
      },
      next: (vehicles) => {
        this.vehicles = vehicles.map(vehicleDto => VehiclesFactory.createVehicleFromDto(vehicleDto));
        this.loading = false;
      }
    });
  }

  /**
   * Convierte las ubicaciones de los vehiculos a marcadores para el mapa.
   * Solo se convierten aquellos vehiculos que tiene al menos una ubicacion y se
   * toma la ultima registrada ubicacion registrada
   * @param vehicles vehiculos que se van a convertir
   */
  private convertVehiclesTrackingToMarkers(vehicles: Vehicle[], draggables: boolean, iconWidth: number, iconHeight: number): Marker[] {

    const vehiclesWithLastTracking = vehicles.filter(vehicle => vehicle.tracking != null && vehicle.tracking != undefined && vehicle.tracking.length > 0);

    return vehiclesWithLastTracking.map( vehicle => {
      return this.createMarkerFromVehicle(vehicle, draggables, iconWidth, iconHeight);
    });
  }

  /**
   * Calcula el icono correspondiente de acuerdo al tipo de vehiculo y sus estatus
   * @param vehicleTypeId tipo de vehiculo
   * @param vehicleStatus Estatus del vehiculo
   */
  private calculateVehicleIcon(vehicleTypeId: number, vehicleStatus: number): string {
    return '/assets/images/svg/car.svg';
  }

  /**
   *
   * @param vehicle Vehiculo en el cual se basara para crear el marcador
   * @param draggable Indica si el marcador se podra arrastrar con el mouse
   * @param iconWidth Indica el ancho del icono en el mapa
   * @param iconHeight Indica la altura del icono en el mapa
   */
  private createMarkerFromVehicle(vehicle: Vehicle, draggable: boolean, iconWidth: number, iconHeight: number): Marker {
    return this.createMarker(vehicle.name, vehicle.tracking[0].latitude, vehicle.tracking[0].longitude, draggable, this.calculateVehicleIcon(vehicle.vehicleType, vehicle.status), iconWidth, iconHeight);
  }

  private createMarker(label: string, latitude: number, longitude: number, draggable: boolean, iconUrl: string, iconWidth: number, iconHeight: number): Marker {
    return { label, latitude, longitude, draggable, iconHeight, iconUrl,  iconWidth };

  }

  /** Configura la barra lateral derecha. Usa variables globales */
  private globalSetSideNav() {
    this.settingsOpenedObs =  this.messengerService.getStringsMessenger().pipe(map( eventName => {
      this.settingsOpened = !this.settingsOpened;
      return this.settingsOpened;
 }));
  }

  /*
   * /////////////////////////////////////Eventos///////////////////////////////////
   */

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {

  }


  ngOnInit(): void {
    this.loading = true;
    this.globalSetSideNav();

    this.markersSub = new BehaviorSubject<Marker[]>(null);
    this.markersObs = this.markersSub.asObservable();
    // this.longitudeSub = new BehaviorSubject<number>(0);
    // this.longitude = this.longitudeSub.asObservable();

    this.getVehiclesWithLastTracking();

    // Esta sentencia literalmente vale oro. Pues es en este observable en donde llegan
    // las ubicaciones de los dispositivos
    this.homeService.vehiclesTracking
    .subscribe(tracking => {
      this.vehicles = this.updateVehicles(this.vehicles, new VehicleTracking({ imei: tracking.imei, latitude: tracking.latitude, longitude: tracking.longitude, velocity: tracking.velocity, oid: 0 }));
      this.markers = this.convertVehiclesTrackingToMarkers(this.vehicles, this.ICONS_ON_MAP_DRAGABLES, this.ICONS_ON_MAP_WIDTH, this.ICONS_ON_MAP_WIDTH);
      this.markersSub.next(this.markers);
    });

  }

 /**
  * Evento que se ejecuta cuando el mapa esta listo.
  * @param ready Bandera que indica si el mapa esta listo o no
  */
  onMapReady(ready: boolean){
    this.mapReady = ready;
    // Si el mapa esta listo
    if (this.mapReady === true) {

      this.markers = this.convertVehiclesTrackingToMarkers(this.vehicles, this.ICONS_ON_MAP_DRAGABLES, this.ICONS_ON_MAP_WIDTH, this.ICONS_ON_MAP_WIDTH);
      this.markersSub.next(this.markers);
  }
  }

}
