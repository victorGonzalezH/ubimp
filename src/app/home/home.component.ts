import { Component, OnInit, Input } from '@angular/core';
import { MessengerService, GeolocationService } from 'utils';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { HomeService } from './home.service';
import { Vehicle } from '../models/vehicle';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit 
{

  //Propiedades
  
   //Mapa
   mapCenter = [-117.98118, 34.00679];
   basemapType = 'gray';
   mapZoomLevel = 10;
   loading = true;
   isMapReady: boolean;

   settingsOpened: boolean;
   settingsOpenedObs: Observable<boolean>;

    private messengerSubscription: Subscription;

    public homeInputs: { realTimeEnabled: boolean, autoZoomEnabled: boolean };
    
    public vehicles: Array<Vehicle>;

    public currentPositionObs: Observable<Position>;
    private currentPosition: Position;

    //Funciones
    homeInputsRealTimeEnabledChange(event)
    {
        console.log(event);
    }

    homeInputsAutoZoomEnabledChange(value)
    {
      console.log(value);
    }

  //Eventos
   constructor(private homeService: HomeService, private messengerService: MessengerService, private geolocationService: GeolocationService)
   {
      this.isMapReady = false;
      this.homeInputs = { autoZoomEnabled: true, realTimeEnabled: true };
   }


  
  ngOnInit() 
  {
    
      this.homeService.getVehicles().subscribe(vehicles => { this.vehicles = vehicles; })

      //this.realTimeEnabled  = true; //El valor se obtendra de la configuracion de cada usuario
      
      
      //this.settingsOpened = false;

      this.settingsOpenedObs =  this.messengerService.getStringsMessenger().pipe(map( eventName => 
        { 
             this.settingsOpened = !this.settingsOpened;
             return this.settingsOpened;
        }));

      //Si el servicio no esta observando los cambios en posicion entonces se activan
      if (!this.geolocationService.isWatchingLocation()) {
          this.geolocationService.startWatching(true, 30000, 2700);
        }

      this.currentPositionObs = this.geolocationService.getGeolocationObserver();
      this.currentPositionObs.subscribe((newPosition) => {
            this.currentPosition  = newPosition;
             console.log(this.currentPosition);
          } );

  }


  ngOnDestroy() 
  {
    this.messengerSubscription.unsubscribe();
  }

   
   mapLoadedEvent(status: boolean) 
   {
      this.loading = false;
      this.isMapReady = status;
      
      
   }

}
