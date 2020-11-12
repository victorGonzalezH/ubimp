import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home-google-maps',
  templateUrl: './home-google-maps.component.html',
  styleUrls: ['./home-google-maps.component.css']
})
export class HomeGoogleMapsComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  map: google.maps.Map = undefined;
  lat = 40.730610;
  lng = -73.935242;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8,
  };
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
  });

  constructor() { }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.marker.setMap(this.map);
   }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.mapInitializer();
  }

}
