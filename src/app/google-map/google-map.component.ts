import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})

export class GoogleMapComponent implements OnInit, AfterViewInit {

  readonly DEFAULT_LATITUDE   = 40.730610;
  readonly DEFAULT_LONGITUDE  = -73.935242;
  readonly DEFAULT_ZOOM       = 8;

  @ViewChild('mapContainer', {static: true}) gmap: ElementRef;
  

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


  constructor() {

    this.ready = new EventEmitter<boolean>();
  }

  ngAfterViewInit(): void {
    this.zoomLocal = this.DEFAULT_ZOOM;
    this.latitudeLocal = this.DEFAULT_LATITUDE;
    this.longitudeLocal = this.DEFAULT_LONGITUDE;
    this.mapOptions = { zoom: this.zoomLocal, center: new google.maps.LatLng(this.latitudeLocal, this.longitudeLocal) };
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.ready.emit(true);
  }

  ngOnInit(): void {
  }


}
