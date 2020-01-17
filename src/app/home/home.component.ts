import { Component, OnInit, Input } from '@angular/core';
import { MessengerService } from 'utils';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit 
{

  //Propiedades
  
   //Mapa
   mapCenter = [-122.4194, 37.7749];
   basemapType = 'satellite';
   mapZoomLevel = 12;
   loading = true;

   settingsOpened: boolean;
   settingsOpenedObs: Observable<boolean>;

    private messengerSubscription: Subscription;



  //Funciones


  //Eventos
   constructor(private messengerService: MessengerService)
   {

   }


  
  ngOnInit() 
  {
  
      this.settingsOpened = false;

      this.settingsOpenedObs =  this.messengerService.getStringsMessenger().pipe(map( eventName => 
        { 
             this.settingsOpened = !this.settingsOpened;
             return this.settingsOpened;
        }));
      
      // this.messengerSubscription = this.messengerService.getStringsMessenger().subscribe({ 
      //   next(message) 
      //   { 
          
      //       console.log('got value ' + message);
            
      //       this.settingsOpened = !this.settingsOpened;

      //       console.log(this.settingsOpened);
      //   },
      //   error(err){  },
      //   complete(){ }
      // });

      
  }


  ngOnDestroy() 
  {
    this.messengerSubscription.unsubscribe();
  }

   
   mapLoadedEvent(status: boolean) 
   {
      this.loading = false;
      console.log('The map loaded: ' + status);
      
   }

}
