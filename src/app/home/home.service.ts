/*
  Author: victor.gonzalez@metricsfab.com
  Created date: 17/01/2020
  Description: Servicio para acceder a los datos del componente Home.
  Este servicio se encarga de obtener los datos de diferentes fuentes y
  proporcionarlas al componente (vista) Home.

*/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle } from '../models/vehicle';


@Injectable({
  providedIn: 'root'
})
export class HomeService 
{

  
  //Funciones
  constructor() 
  { 
      
  }


  getVehicles(): Observable<Array<Vehicle>>
  {
      return of([ 
        { name: 'A3', description: 'Audi WTW-2898', icon: 'directions_car', imei: '123456' },
        { name: 'Versa', description: 'Nissan XYW-2136', icon: 'directions_car', imei: '123456' },
        { name: 'M3', description: 'BMW OYW-1665', icon: 'directions_car', imei: '123456' }
      ]);
  }

  //Eventos
  

}
