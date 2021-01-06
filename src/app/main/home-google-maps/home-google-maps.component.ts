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
  readonly CAR_PATH = 'M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z';

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

  /**
   * Indica el modo en el que funciona el sidebar de este componente
   */
  public sidebarMode: string;

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
    this.sidebarMode = 'over';

    this.latitude = this.homeService.userLocation.pipe(map( userLocation => {
      if (this.homeInputs.showUserLocation === true && userLocation != null && userLocation != undefined) {
        return userLocation.coords.latitude;
      }
      return null;
    }));
    this.longitude = this.homeService.userLocation.pipe(map( userLocation => {
      if (this.homeInputs.showUserLocation === true && userLocation != null && userLocation != undefined) {
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
    this.matIconRegistry.addSvgIcon('pin', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/pin.svg'));

  }

  private updateVehicles(vehicles: Vehicle[], tracking: VehicleTracking): Vehicle[] {

    const foundVehicle = vehicles.filter(vehicleToSearch => vehicleToSearch.imei === tracking.imei);
    if (foundVehicle != null && foundVehicle != undefined && foundVehicle.length > 0) {

      const oldVehicle: Vehicle = foundVehicle[0];
      const newVehicle: Vehicle =  VehiclesFactory.createVehicle( oldVehicle.name, oldVehicle.description, oldVehicle.imei, oldVehicle.vehicleType, oldVehicle.status, 0, oldVehicle.online, oldVehicle.showOnMap, tracking.latitude, tracking.longitude, tracking.velocity);
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


  private updateVehiclesGlobal(tracking: VehicleTracking) {

    const foundVehicle = this.vehicles.filter(vehicleToSearch => vehicleToSearch.imei === tracking.imei);
    
    if (foundVehicle != null && foundVehicle != undefined && foundVehicle.length > 0) {

      const oldVehicle: Vehicle = foundVehicle[0];
      // Puede darse el caso que no exista una ubicacion anterior, esto quiere decir que la ubicacion que se reciben (tracking)
      // es la primera ubicacion del vehiculo
      if(oldVehicle.tracking != undefined && oldVehicle.tracking != null && oldVehicle.tracking.length > 0) {
        oldVehicle.tracking[0].latitude = tracking.latitude;
        oldVehicle.tracking[0].longitude = tracking.longitude;
        oldVehicle.tracking[0].velocity = tracking.velocity;
      }  
      else {

          oldVehicle.tracking.push(tracking);
      }
      
      // const newVehicle: Vehicle =  VehiclesFactory.createVehicle( oldVehicle.name, oldVehicle.description, oldVehicle.imei, oldVehicle.vehicleType, oldVehicle.status, 0, oldVehicle.online, oldVehicle.showOnMap, tracking.latitude, tracking.longitude, tracking.velocity);
      // const index = this.vehicles.indexOf(oldVehicle);
      // this.vehicles[index] = newVehicle;
      // const myClonedArray = [];
      // vehicles.forEach(val => myClonedArray.push(Object.assign({}, val)));
      // return myClonedArray;
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
    const vehiclesToShowOnMap: Vehicle[] = [];

    vehiclesWithLastTracking.forEach(vehicle => {


    });
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

      this.updateVehiclesGlobal(new VehicleTracking({ imei: tracking.imei, latitude: tracking.latitude, longitude: tracking.longitude, velocity: tracking.speed, oid: 0 }));
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

  sidebarToogle() {
    if (this.sidebarMode === 'over') {
      this.sidebarMode = 'side';
    } else {
      this.sidebarMode = 'over';
    }

  }



  showOnMap(show: boolean, name: string) {

  }

}
