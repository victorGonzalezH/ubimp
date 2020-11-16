import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Marker } from './models/marker.model';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})

export class GoogleMapComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentInit {

  readonly DEFAULT_LATITUDE   = 40.730610;
  readonly DEFAULT_LONGITUDE  = -73.935242;
  readonly DEFAULT_ZOOM       = 8;

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;


  /**
   * mapa actual
   */
  private map: google.maps.Map;

  /**
   * latitud del centro del mapa
   */
  public latitudeLocal: number;
  @Input()
  set latitude(latitude: number) {
    this.latitudeLocal = latitude;
    this.map.setCenter(new google.maps.LatLng(this.latitudeLocal, this.longitudeLocal));
  }

  /**
   * longitud del centro del mapa
   */
  public longitudeLocal: number;
  @Input()
  set longitude(longitude: number) {
    this.longitudeLocal = longitude;
    this.map.setCenter(new google.maps.LatLng(this.latitudeLocal, this.longitudeLocal));
  }

  /**
   * zoom
   */
  public zoomLocal: number;
  @Input()
  set zoom(zoom: number) {
    this.zoomLocal = zoom;
    this.map.setZoom(this.zoomLocal);
  }


  /**
   * Opciones del mapa
   */
  private mapOptions: google.maps.MapOptions;

  /**
   * Evento que se dispara cuando el mapa se ha cargado
   */
  @Output() ready: EventEmitter<boolean>;

  private mapReady: boolean;

  private markersLocal: google.maps.Marker[];
  @Input()
  set markers(markers: Marker[]){
    if (this.mapReady === true) {
      this.clearMarkers();
      this.markersLocal = [];
      if (markers != null && markers != undefined) {

        this.markersLocal = markers.map(marker => {
          const newMarker = new google.maps.Marker();
          newMarker.setPosition(new google.maps.LatLng(marker.latitude, marker.longitude));
          newMarker.setIcon(
            {  url: marker.iconUrl,
               scaledSize: new google.maps.Size(marker.iconWidth, marker.iconHeight)
            });
          newMarker.setMap(this.map);
          return newMarker;
        });

      }
    }

  }

  constructor() {
    this.markers = [];
    this.mapReady = false;
    this.ready = new EventEmitter<boolean>();

  }

  /**
   * /////////////////////////////////////Funciones///////////////////////////////////////////////////
   */

// Sets the map on all markers in the array.
private setMapOnAll(map: google.maps.Map | null) {
  if (this.markersLocal) {
    this.markersLocal.forEach( marker => {
      marker.setMap(map);
    });
  }
}

// Removes the markers from the map, but keeps them in the array.
private clearMarkers() {
  this.setMapOnAll(null);
}


  ngAfterContentInit(): void {

  }
  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    this.zoomLocal = this.DEFAULT_ZOOM;
    this.latitudeLocal = this.DEFAULT_LATITUDE;
    this.longitudeLocal = this.DEFAULT_LONGITUDE;
    this.mapOptions = { zoom: this.zoomLocal, center: new google.maps.LatLng(this.latitudeLocal, this.longitudeLocal) };
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    // Se agrega un manejador unico (addListenerOnce que se remueve asi mismo que se remueve asi mismo
    // despues de manejar la primera ocurrencia del evento. Se escucha el evento idle del mapa
    // para emitir que el mapa esta listo
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      if (this.mapReady === false) {
        this.ready.emit(true);
        this.mapReady = true;
      }
    });

  }

  ngOnInit(): void {

  }


  /**
   * Crea un marcador para el mapa
   */
  createMarker(label: string, latitude: number, longitude: number, iconUrl?: string, iconWidth?: number, iconHeight?: number): google.maps.Marker {

    return new google.maps.Marker({ label, position : new google.maps.LatLng(latitude, longitude) });
  }



}
