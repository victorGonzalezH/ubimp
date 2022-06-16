import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { ApiResultBase, DataService, DataServiceProtocols, ErrorType, ResponseTypes } from 'utils';
import { SignInCommand } from './signin.model';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  constructor(private dataService: DataService, private appConfigService: AppConfigService) { }



/**
 * Gets the countries with their states
 * (For a quick implementation, all the countries are served in the client, it will be evaluated if
 * they are going to be moved to be served by the backend)
 * @returns Countries with their states
 */
public getCountriesWithStates(): Observable<ApiResultBase> {
  const response: ApiResultBase = { 
    data: [{

      name: 'Mexico', id: 1, states: [
        { name: 'Aguascalientes', id: 2, },
        { name: 'Baja California', id: 3, },
        { name: 'Baja California Sur', id: 4, },
        { name: 'Campeche', id: 5, },
        { name: 'Chiapas', id: 6, },
        { name: 'Chihuahua', id: 7, },
        { name: 'CD de México', id: 8, },
        { name: 'Coahuila', id: 9, },
        { name: 'Colima', id: 10, },
        { name: 'Durango', id: 11, },
        { name: 'Guerrero', id: 12, },
        { name: 'Hidalgo', id: 13, },
        { name: 'Jalisco', id: 14, },
        { name: 'Estado de México', id: 15, },
        { name: 'Michoacán', id: 16, },
        { name: 'Morelos', id: 17, },
        { name: 'Nayarit', id: 18, },
        { name: 'Nuevo León', id: 19, },
        { name: 'Oaxaca', id: 20, },
        { name: 'Puebla', id: 21, },
        { name: 'Querétaro', id: 22, },
        { name: 'Quintana Roo', id: 23, },
        { name: 'San Luis Potosí', id: 24, },
        { name: 'Sinaloa', id: 25, },
        { name: 'Sonora', id: 26, },
        { name: 'Michoacán', id: 27, },
        { name: 'Tabasco', id: 28 },
        { name: 'Tlaxcala', id: 29, },
        { name: 'Veracruz', id: 30, },
        { name: 'Yucatán', id: 31, },
        { name: 'Zacatecas', id: 32, },
    ]

  }], error: null, resultCode: 0, applicationMessage: 'Success', userMessage: 'Success', errorType: null, isSuccess: true

  };
  return of(response);
}




public signin(signinCommand: SignInCommand): Observable<ApiResultBase> {
  return this.dataService.post(this.appConfigService.apiUrl + '/auth/signin', signinCommand, null, DataServiceProtocols.HTTPS, ResponseTypes.JSON, null);
}

}
