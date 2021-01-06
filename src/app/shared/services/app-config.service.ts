import { Injectable } from '@angular/core';
import { DataService } from 'utils';

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

  private hostUrl: string;


  private locationsRealTimeUrlLocal;

  /**
   * 
   */
  get locationsRealTimeUrl() {
    return this.locationsRealTimeUrlLocal;
  }


  constructor(private dataService: DataService) {
    this.hostUrl = window.location.host;
    this.ploginUrl = 'localhost:3000';
    this.currentUserKeyLocal = 'currentUser';
    this.defaultLanguageKeyLocal = 'defaultLanguage';
    this.locationsRealTimeUrlLocal = 'https://localhost:3000';
  }

  /**
   * Obtiene las urls de las apis. Estas urls son usadas por diferentes modulos de la aplicacion.
   * 
   */
  public getAppConfig(url: string)  {
    
    // this.dataService()
  }

}
