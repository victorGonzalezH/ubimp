/*
  Author: victor.gonzalez@metricsfab.com
  Created date: 17/01/2020
  Description: Servicio para acceder a los datos del componente Home.
  Este servicio se encarga de obtener los datos de diferentes fuentes y
  proporcionarlas al componente (vista) Home.

*/
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Vehicle, VehicleDto } from '../models/vehicle';
import { IHomeSettings } from './models/IHomeSettings.model';
import { ReferenceSystems } from '../esri-map/models/referenceSystem.enum';
import { VehicleTracking, VehicleTrackingDto } from '../models/vehicleTracking.model';
import { IField } from '../esri-map/render/IField.model';
import { FieldTypes } from '../esri-map/render/fieldType.enum';
import { IPopupTemplate } from '../esri-map/render/iPopupTemplate.model';
import { IUniqueValueInfo } from '../esri-map/render/IUniqueValueInfo.model';
import { ISimpleMarkerSymbol } from '../esri-map/symbols/ISimpleMarkerSymbol.model';
import { SymbolsTypes } from '../esri-map/symbols/symbolsTypes.enum';
import { VehicleTypes } from './enums/vehicleTypes.enum';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private vehicleTrackingSource: Subject<VehicleTrackingDto>;

  public vehiclesTracking: Observable<VehicleTrackingDto>;
  private vehiclesTrackingA: Array<VehicleTrackingDto> = [
    { latitude: 18.0615108, longitude: -92.9275847, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0531057, longitude: -92.9268551, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0396811, longitude: -92.9286576, velocity: 0, statusId: 2, imei: '0987654321' },
    { latitude: 18.0194913, longitude: -92.9359639, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0176752, longitude: -92.9435385, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0176752, longitude: -92.9435385, velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 18.0048347, longitude: -92.953114,  velocity: 0, statusId: 1, imei: '1234567890' },
    { latitude: 17.9987227, longitude: -92.9578561, velocity: 0, statusId: 1, imei: '0987654321' }];

    private counter: number;
// Funciones
  constructor() {
    this.counter = 0;
    this.vehicleTrackingSource = new Subject<VehicleTrackingDto>();
    this.vehiclesTracking = this.vehicleTrackingSource.asObservable();
    setInterval(() => {
      this.vehicleTrackingSource.next(this.vehiclesTrackingA[this.counter]);
      this.counter++;
      if (this.counter === this.vehiclesTrackingA.length) {
        this.counter = 0;
      } 
    }, 10000);
  }

  /**
   * Obtiene la configuracion del modulo home
   */
  public getHomeSettings(): Observable<IHomeSettings> {
    const settings: IHomeSettings = { mapZoomLevel: 5, mapCenter: [49, -126], baseMap: 'streets', referenceSystem: ReferenceSystems.GPS };
    return of(settings);
  }


  /** Obtiene los vehiculos desde el servidor */
  getVehicles(): Observable<Array<VehicleDto>> {
      return of([
        { name: 'A3', description: 'Audi WTW-2898', imei: '1234567890', vehicleTypeId: 0, oid: 1 },
        { name: 'Ford', description: 'F350 ETP-5272', imei: '0987654321', vehicleTypeId: 1, oid: 2 }
      ]);
  }



  /**  */
  public getVehicleTrackingFields(): Observable<Array<IField>> {

    const fields: Array<IField> = [
      { alias: 'Name', name: 'name', fieldType: FieldTypes.string  },
      { alias: 'Description', name: 'description', fieldType: FieldTypes.string },
      { alias: 'Oid', name: 'oid', fieldType: FieldTypes.oid  },
      { alias: 'Latitude', name: 'latitude', fieldType: FieldTypes.double  },
      { alias: 'Longitude', name: 'longitude', fieldType: FieldTypes.double  },
      { alias: 'StatusId', name: 'statusId', fieldType: FieldTypes.string  },
      { alias: 'Imei', name: 'imei', fieldType: FieldTypes.string  }
    ];

    return of(fields);
  }


  /** Obtiene la plantilla que se mostrara en el poppup */
  public getPopupTemplate(): Observable<IPopupTemplate> {
    const popupTemplate: IPopupTemplate = {
      content: '{Name}', title: ''
     };

    return of(popupTemplate);
  }

  // tslint:disable-next-line: max-line-length
  private getVehicleSimpleMarkerSymbol(color: string, outlineColor: any, outlineWidth: number, size: number, symbolType: SymbolsTypes): ISimpleMarkerSymbol {

    const simpleMarkerSymbol: ISimpleMarkerSymbol = {
        color,
        // tslint:disable-next-line: max-line-length
        path: 'M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z',
        outline : { color: outlineColor, width: outlineWidth },
        size,
        type: symbolType

    };

    return simpleMarkerSymbol;
  }

  /** Obtiene los valores y sus simbolores que se usaran para las ubicaciones de los vehiculos */
  public getValuesInfos(): Observable<Array<IUniqueValueInfo>> {
      const size = 25;
      const outlineColor = [0, 0, 0, 0.7];
      const outlineWidth = 0.4;
      const valuesInfo: Array<IUniqueValueInfo> = [
      { value: 1, symbol: this.getVehicleSimpleMarkerSymbol('#76ff03', outlineColor, outlineWidth, size, SymbolsTypes.simpleMarkerSymbol) },
      { value: 2, symbol: this.getVehicleSimpleMarkerSymbol('#ffff00', outlineColor, outlineWidth, size, SymbolsTypes.simpleMarkerSymbol) }
    ];

      return of(valuesInfo);
  }


  // Eventos


}
