import { Injectable } from '@angular/core';
import { DataService } from 'utils';
import { IWindowConfig } from '../models/iwindow-config.model';

@Injectable({
  providedIn: 'root'
})




export class AppConfigService {


  private loginUrlLocal: string;


  /**
   * Url de la api del modulo de login
   */
  get logiUrl(): string
  {
      return this.loginUrlLocal;
  }

  private currentUserKeyLocal: string;
  
  /**
  * Llave tipo cadena del usuario autenticado. Esta llave se usa para buscar el usuario en el
  * storage de la aplicacion
  */
  get currentUserKey(): string
  {
    return this.currentUserKeyLocal;
  }

  /**
   * Llave tipo cadena del lenguaje por default. Esta llave se usa para buscar el lenguaje en el
   * storage de la aplicacion
   */
  private defaultLanguageKeyLocal: string;

  get defaultLanguage(): string {
    return this.defaultLanguageKeyLocal;
  }

  private hostUrl: string;


  private realTimeUrlLocal: string;

  /**
   * Direccion url del servidor de tiempo real de ubimp
   */
  get realTimeUrl(): string {
    return this.realTimeUrlLocal;
  }

  private apiUrlLocal: string;

  /**
   * Direccion url de la api del sistema ubimp
   */
  get apiUrl(): string {
    return this.apiUrlLocal;
  }

  private currentWindowConfigLocal: IWindowConfig;
  get currentWindowConfig(): IWindowConfig
  {
      return this.currentWindowConfigLocal;
  }
  set currentWindowConfig(value: IWindowConfig)
  {
    this.currentWindowConfigLocal = value;
  }

  private authorizationKeyLocal: string;

  get authorizationKey(): string {
    return this.authorizationKeyLocal;
  }

  
  constructor(private dataService: DataService) {
    this.hostUrl = window.location.host;
    this.loginUrlLocal = 'localhost:3000';
    this.currentUserKeyLocal = 'currentUser';
    this.authorizationKeyLocal = 'authorization';
    this.defaultLanguageKeyLocal = 'defaultLanguage';
    this.realTimeUrlLocal = 'https://localhost:3000';
  }

  /**
   * Obtiene las urls de las apis. Estas urls son usadas por diferentes modulos de la aplicacion.
   * 
   */
  public getAppConfig()  {
    this.apiUrlLocal = 'localhost:3000';
  }

}
