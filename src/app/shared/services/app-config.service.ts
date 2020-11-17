import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})




export class AppConfigService {

  private ploginUrl: string;


  /**
   * Url del modulo login
   */
  get logiUrl(): string
  {
      return this.ploginUrl;
  }

  private currentUserKeyLocal: string;

  get currentUserKey(): string
  {
    return this.currentUserKeyLocal;
  }

  private defaultLanguageKeyLocal: string;

  get defaultLanguage(): string {
    return this.defaultLanguageKeyLocal;
  }

  constructor() {
    this.ploginUrl = 'localhost:3000';
    this.currentUserKeyLocal = 'currentUser';
    this.defaultLanguageKeyLocal = 'defaultLanguage';
  }

  /**
   * Obtiene las urls de las apis. Estas urls son usadas por diferentes modulos de la aplicacion.
   * 
   */
  public getUrls()  {

  }

}
