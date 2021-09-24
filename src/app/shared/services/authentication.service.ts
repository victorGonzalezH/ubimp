import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService, DataServiceProtocols, StorageService, StorageType } from 'utils';
import { AppConfigService } from './app-config.service';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { IAuthenticationService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements IAuthenticationService {

  constructor(private appConfigService: AppConfigService, private dataService: DataService, private storageService: StorageService) { }
  
  /**
   * 
   * @returns El usuario autenticado
   */
  getUser() {
    const user = this.storageService.retrieve(this.appConfigService.currentUserKey, StorageType.Session);
    if(user !== null && user !== undefined)
    {
        return JSON.parse(user);
    }
    return null;
  }

  /**
   * Remove
   */
  logOut(): void {
       // remove user from local storage to log user out
        this.storageService.removeItem(this.appConfigService.currentUserKey, StorageType.Session);
  }

  /**
   * 
   * @param url url del servicio rest para la autenticacion
   * @param username usuario
   * @param password contrasena
   * @param lang lenguaje
   */
  public login(username: string, password: string, lang: string) {

    return this.dataService.post(this.appConfigService.apiUrl + '/auth', { username, password }, 'login', DataServiceProtocols.HTTPS)
    .pipe(catchError( error => throwError(error)), map(result => {
      const user: AuthenticatedUser = { username, token: result.token };
      this.storageService.store(this.appConfigService.currentUserKey, JSON.stringify(user), StorageType.Session);
      return user;
    }));

  }
}
