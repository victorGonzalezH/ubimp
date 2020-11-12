import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { position } from 'esri/widgets/CoordinateConversion/support/Conversion';
import { HomeService } from './home.service';

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

  // Marcadores
  markers: google.maps.Marker[];

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8,
  };
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
  });

  constructor(private homeService: HomeService) { }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.marker.setMap(this.map);

    this.homeService.getVehicles()
    .subscribe( {
      next: (vehicles) => {

        this.markers = vehicles.map( vehicle => {
          const newMarker = new google.maps.Marker();
          const latlng = new google.maps.LatLng(40.73061, 73.935242);
          newMarker.setPosition(latlng);
          newMarker.setMap(this.map);
          newMarker.setIcon('/assets/images/svg/car.svg');
          return newMarker;

            });
      }
    });

   }

  ngOnInit(): void {
    
  }


  ngAfterViewInit(): void {
    this.mapInitializer();
  }

}
