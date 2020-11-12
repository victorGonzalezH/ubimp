import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { position } from 'esri/widgets/CoordinateConversion/support/Conversion';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home-google-maps',
  templateUrl: './home-google-maps.component.html',
  styleUrls: ['./home-google-maps.component.css']
})
export class HomeGoogleMapsComponent implements OnInit {


  constructor(private homeService: HomeService) {

  }


  ngOnInit(): void {

    this.homeService.getVehicles()
    .subscribe( {
      next: (vehicles) => {

        // this.markers = vehicles.map( vehicle => {
        //   const newMarker = new google.maps.Marker();
        //   const latlng = new google.maps.LatLng(40.73061, 73.935242);
        //   newMarker.setPosition(latlng);
        //   newMarker.setMap(this.map);
        //   newMarker.setIcon('/assets/images/svg/car.svg');
        //   return newMarker;

        //     });
      }
    });

  }


  onMapReady(ready: boolean){

    // Si el mapa esta listo
    if (ready === true) {

    }
  }

}
