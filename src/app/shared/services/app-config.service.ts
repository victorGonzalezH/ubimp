import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})




export class AppConfigService {

  private ploginUrl: string;

  private currentUserKeyLocal: string;

  /**
   * Url del modulo login
   */
  get logiUrl(): string
  {
      return this.ploginUrl;
  }

  get currentUserKey(): string
  {
    return this.currentUserKeyLocal;
  }

  constructor() {
    this.ploginUrl = 'localhost:3000';
    this.currentUserKeyLocal = 'currentUser';
  }

  /**
   * Obtiene las urls de las apis. Estas urls son usadas por diferentes modulos de la aplicacion.
   * 
   */
  public getUrls()  {

  }

}
