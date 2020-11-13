import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { position } from 'esri/widgets/CoordinateConversion/support/Conversion';
import { Observable, Subject } from 'rxjs';
import { Marker } from 'src/app/google-map/models/marker.model';
import { VehicleDto } from '../shared/models/vehicle.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home-google-maps',
  templateUrl: './home-google-maps.component.html',
  styleUrls: ['./home-google-maps.component.css']
})
export class HomeGoogleMapsComponent implements OnInit, AfterViewInit, AfterViewChecked {

  /**
   * Listado de los vehiculos
   */
  private vehicles: VehicleDto[];

  /**
   * Marcadores del mapa, que representaran a los vehiculos
   */
  public markers: Marker[];

  /**
   * 
   */
  
  private markersSub: Subject<Marker[]>;
  public markersObs: Observable<Marker[]>;

  private mapReady: boolean;

  private firstTime: boolean;

  constructor(private homeService: HomeService) {
    this.vehicles = [];
    this.markersSub = new Subject<Marker[]>();
    this.markersObs = this.markersSub.asObservable();
    this.mapReady = false;
    this.firstTime = false;

    // Esta sentencia literalmente vale oro. Pues es este observable en donde llegan
    // las ubicaciones de los dispositivos
    this.homeService.vehiclesTracking.subscribe(vehicleTracking => {

    });

  }

   /*
   * /////////////////////////////////////Funciones///////////////////////////////////
   */


   /*
   * Obtiene los vehiculos con su ultima ubacion registrada. Si no tiene ubicacion registrada
   * la propiedad tracking del vehiculo viene como arreglo vacio
   */
  private getVehiclesWithLastTracking(){
    this.homeService.getVehiclesWithLasTracking()
    .subscribe( {
      next: (vehicles) => {
        this.vehicles = vehicles;
      }
    });
  }

  /**
   * Convierte las ubicaciones de los vehiculos a marcadores para el mapa.
   * Solo se convierten aquellos vehiculos que tiene al menos una ubicacion y se
   * toma la ultima registrada ubicacion registrada
   * @param vehicles vehiculos que se van a convertir
   */
  private convertVehiclesTrackingToMarkers(vehicles: VehicleDto[]) {

    const vehiclesWithLastTracking = this.vehicles.filter(vehicle => vehicle.tracking != null && vehicle.tracking != undefined && vehicle.tracking.length > 0);

    this.markers = vehiclesWithLastTracking.map( vehicle => {
      const lastTracking = vehicle.tracking[0];
      return {
        draggable: false,
        latitude: lastTracking.latitude,
        longitude: lastTracking.longitude,
        label: vehicle.name,
        iconUrl: this.calculateVehicleIcon(vehicle.vehicleTypeId)
      };
    });
  }

  
  private calculateVehicleIcon(vehicleTypeId: number): string {
    return '/assets/images/svg/car.svg';
  }


  /*
   * /////////////////////////////////////Eventos///////////////////////////////////
   */

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {

  }


  ngOnInit(): void {

    this.getVehiclesWithLastTracking();
  }


  onMapReady(ready: boolean){
    this.mapReady = ready;
    if (this.mapReady === true) {
      // Si filtran aquellos vehiculos que al menos ya tiene una ultima posicion registrada, esto
      // para que solo se muestron estos vehiculos
      const vehiclesWithLastTracking = this.vehicles.filter(vehicle => vehicle.tracking != null && vehicle.tracking != undefined && vehicle.tracking.length > 0);

      
      this.markersSub.next(this.markers);
    }
  }

}
