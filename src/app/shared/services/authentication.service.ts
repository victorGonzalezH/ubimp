import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService, DataServiceProtocols, StorageService, StorageType } from 'utils';
import { AppConfigService } from './app-config.service';
import { AuthenticatedUser } from '../models/authenticated-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private appConfigService: AppConfigService, private dataService: DataService, private storageService: StorageService) { }

  /**
   * 
   * @param url url del servicio rest para la autenticacion
   * @param username usuario
   * @param password contrasena
   * @param lang lenguaje
   */
  public login(username: string, password: string, lang: string) {

    return this.dataService.post(this.appConfigService.logiUrl + '/auth', { username, password }, 'login', DataServiceProtocols.HTTPS)
    .pipe(catchError( error => throwError(error)), map(result => {
      const user: AuthenticatedUser = { username, token: result.token };
      this.storageService.store(this.appConfigService.currentUserKey, JSON.stringify(user), StorageType.Session);
      return user;
    }));

  }
}
