import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Marker } from './models/marker.model';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {

  private centerProperty: Array<number>;

  @Output() mapReadyEvent: EventEmitter<any> = new EventEmitter<any>();

  public markersField: Marker[];

  @Input()
  set markers(markers: Marker[]) {
    if ( markers != undefined ) {
      this.markersField = markers;
      console.log(this.markersField);
    }
    
    // if ( this.centerProperty !== null && this.mapLoaded === true) {
    //   this.globalSetMapCenterWithGPSCoordinates(this.centerProperty[0], this.centerProperty[1], this.animationDuration);

    // }

  }

  /**
   * Latitud
   */
  public latitude: number;

  /**
   * Longitud
   */
  public longitude: number;


    constructor() {
    }

  ngOnInit(): void {
  }


  onMapReady(map: any){
    this.mapReadyEvent.emit(map);

  }

}

