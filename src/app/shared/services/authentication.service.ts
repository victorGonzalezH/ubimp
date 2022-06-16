import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService, DataServiceProtocols, ResponseTypes, StorageService, StorageType, UserSource } from 'utils';
import { AppConfigService } from './app-config.service';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { IAuthenticationService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements IAuthenticationService {

  
  /**
   * User subject for emiting values
   */
  private userSubject: BehaviorSubject<AuthenticatedUser>;
  
  /**
   * User observable
   */
  public user: Observable<AuthenticatedUser>;

  /**
   * Gets the current user value
   */
  get userValue(): AuthenticatedUser {
    return this.userSubject.value;
}

  private refreshTokenTimeout;

  private currentRefreshTokenSubject: BehaviorSubject<string>;
  public currentRefreshToken: Observable<string>;

  constructor(private appConfigService: AppConfigService, private dataService: DataService, private storageService: StorageService) { 

    this.userSubject = new BehaviorSubject<AuthenticatedUser>(null);
    this.user = this.userSubject.asObservable();

    this.currentRefreshTokenSubject = new BehaviorSubject<string>(null);
    this.currentRefreshToken = this.currentRefreshTokenSubject.asObservable();


  }
  
  /**
   * 
   * @returns El usuario autenticado
   */
  public getUser(userSource: UserSource) {

    if(userSource == UserSource.LocalStorage) {

      const user = this.storageService.retrieve(this.appConfigService.currentUserKey, StorageType.Session);
      if(user != null && user != undefined) {
          return JSON.parse(user);
      }
  
      return null;

    }
    else if(userSource == UserSource.Memory) {
      return this.userValue;
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
  public login(username: string, password: string, lang: string): Observable<AuthenticatedUser> {
    return this.dataService.post(this.appConfigService.apiUrl + '/auth', { username, password }, 'login', DataServiceProtocols.HTTPS, ResponseTypes.JSON, undefined)
    .pipe(catchError( error => throwError(error)),
      map(result => {
      const user: AuthenticatedUser = { username, token: result.token, refreshToken: result.refreshToken, roles: result.roles };
      this.userSubject.next(user);
      this.storageService.store(this.appConfigService.currentUserKey, JSON.stringify(user), StorageType.Session);
      this.startRefreshTokenTimer();
      return user;
    }));

  }

  /**
   * Make a refresh token call to the server
   */
  public refreshToken(): Observable<any> {
    return this.dataService.post(this.appConfigService.apiUrl + '/auth', { }, 'refreshToken', DataServiceProtocols.HTTPS, ResponseTypes.JSON, undefined, true)
    .pipe(catchError( error => throwError(error)),
     map(result => {
      const user: AuthenticatedUser = { username: result.username, token: result.token, refreshToken: result.refreshToken, roles: result.roles };
      this.userSubject.next(user);
      this.storageService.store(this.appConfigService.currentUserKey, JSON.stringify(user), StorageType.Session);
      this.currentRefreshTokenSubject.next(user.refreshToken);
      this.startRefreshTokenTimer();
      return user;
    }));

  }


  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const authToken = JSON.parse(atob(this.userValue.token.split('.')[1]));
    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(authToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
}


/**
 * Gets the last current refresh token
 * @returns 
 */
public getCurrentRefreshToken(): string {
    return this.currentRefreshTokenSubject.value;
}

}
