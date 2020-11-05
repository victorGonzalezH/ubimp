import { Component, OnInit, Input, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MessengerService, GeolocationService, UtilsService, RealtimeService } from 'utils';
import { Subscription, Observable, Subject, forkJoin, of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { HomeService } from './home.service';
import { Vehicle, VehicleDto, VehiclesFactory } from './models/vehicle.model';
import { EsriMapComponent, IMap } from '../../esri-map/esri-map.component';
import { CalciteWebCoreIcons } from '../../esri-map/render/calciteWebCoreIcons.enum';
import { ISimpleMarkerSymbol } from '../../esri-map/symbols/ISimpleMarkerSymbol.model';
import { SymbolsTypes } from '../../esri-map/symbols/symbolsTypes.enum';
import { IUniqueValueInfo } from '../../esri-map/render/IUniqueValueInfo.model';
import { MapEvents } from '../../esri-map/enums/mapEvents.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

//#region Eventos

   // tslint:disable-next-line: max-line-length
   constructor(private homeService: HomeService, private messengerService: MessengerService, private geolocationService: GeolocationService, private realtimeService: RealtimeService) {
      this.isMapReady = false;
      this.homeInputs = { autoZoomEnabled: true, realTimeEnabled: true };
   }

   /** Objeto estatico que define el simbolo (o icono) que se usara para cada capa en el mapa. Para esta implementacion
    * se usa una FeatureLayer diferente para cada tipo de vehiculo, por ejemplo para carros, camionetas, trailers etc.
    * El indice de cada simbolo 0, 1, 2, etc corresponde con el enumerado vehiclesTypes
    * */
    public static vehiclesLayersSymbols = {
      // tslint:disable-next-line: max-line-length
      0: 'M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z',
      // tslint:disable-next-line: max-line-length
      1: 'M624 288h-16v-64c0-17.67-14.33-32-32-32h-48L419.22 56.02A64.025 64.025 0 0 0 369.24 32H256c-17.67 0-32 14.33-32 32v128H64c-17.67 0-32 14.33-32 32v64H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h49.61c-.76 5.27-1.61 10.52-1.61 16 0 61.86 50.14 112 112 112s112-50.14 112-112c0-5.48-.85-10.73-1.61-16h67.23c-.76 5.27-1.61 10.52-1.61 16 0 61.86 50.14 112 112 112s112-50.14 112-112c0-5.48-.85-10.73-1.61-16H624c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM288 96h81.24l76.8 96H288V96zM176 416c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48zm288 0c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48z'
  };

  // Propiedades
  @ViewChild(EsriMapComponent) esriMapComp: EsriMapComponent;

   // Propiedades para el mapa
   private mapCenter: Array<number>;
   public basemap: string;
   public mapZoomLevel: number;
   public referenceSystem: number;
   private isMapReady: boolean;
   private isMapModulesLoaded: boolean;

   public loading = true;


   private subscriptions: Subscription[];

   settingsOpened: boolean;
   settingsOpenedObs: Observable<boolean>;

    private messengerSubscription: Subscription;

    public homeInputs: { realTimeEnabled: boolean, autoZoomEnabled: boolean };

    /** Arreglo que contiene los vehiculos que son obtenidos desde el servidor */
    // public vehicles: Array<VehicleDto>;

    public vehicles: Array<Vehicle>;

    /** Objeto que contiene los vehiculos que son obtenidos desde el servidor */
    private vehiclesObject = { };

    // Grupo de los tipos de vehiculos
    private vehiclesTypesGrouped: Map<any, any>;

    // Arreglo de la dupla statusKey/Color
    private statusKeysAndColors: Map<number, string>;

    /**
     * Areglo de las duplas de los tipos de vehiculos (vehiclesTypesId)/identificador de la capa generado layerId
     * Este arreglo de duplas se genera cuando se agregan las capas correspondientes por cada grupo de vehiculos
     * 
     *  */ 
    private vehiclesTypesIdsAndlayersIds: Map<number, number>;

    private currentPositionSubject: Subject<Array<number>>;

    public currentPositionObs: Observable<Array<number>>;

    private currentPosition: Position;

    // Arreglo los identificadores de las capas agregadas
    private layersIds: Array<number>;

    // Funciones
    homeInputsRealTimeEnabledChange(event) {
        console.log(event);
    }

    homeInputsAutoZoomEnabledChange(value) {
      console.log(value);
    }

    /** Configura la barra lateral derecha. Usa variables globales */
    private globalSetSideNav() {
      this.settingsOpenedObs =  this.messengerService.getStringsMessenger().pipe(map( eventName => {
        this.settingsOpened = !this.settingsOpened;
        return this.settingsOpened;
   }));
    }


    /**
     * Establece la configuracion para obtener la ubicacion del usuario. Usa variables globales
     */
    private globalSetUserGeolocationAndSetMapCenter(layerId: number) {
      // Si el servicio no esta observando los cambios de posicion entonces se activan
      if (this.geolocationService.isWatchingLocation() === false) {
        this.geolocationService.startWatching(true, 15000, 8000);
      }

      this.geolocationService.getGeolocationObserver()
      .subscribe((newPosition) => {
          this.currentPosition  = newPosition;
          if ( newPosition !== null && newPosition !== undefined) {
            // tslint:disable-next-line: max-line-length
            this.esriMapComp.addSymbolGraphicPoint(newPosition.coords.latitude, newPosition.coords.longitude, CalciteWebCoreIcons.MapPin, '#ff0000', 22, layerId);
            // this.mapCenter = [newPosition.coords.latitude, newPosition.coords.longitude];
            // this.currentPositionSubject.next(this.mapCenter);
           }
        } );
    }


    /**
     * Obtiene la configuracion del componente home
     */
  private globalGetAndSetHomeSettings() {
    return this.homeService.getHomeSettings().subscribe(homeSettings => {

      this.mapCenter        = homeSettings.mapCenter;
      this.mapZoomLevel     = homeSettings.mapZoomLevel;
      this.basemap          = homeSettings.baseMap;
      this.referenceSystem  = homeSettings.referenceSystem;

    });

  }


  /** Se subscribe al observable que emite las actualizaciones de los cambios
   * de ubicacion de los vehiculos y los muestra en el mapa
   */
  private globalSubscribeToVehiclesLocationUpdateAndDisplayToMap(mapComponent: IMap, vehiclesTypesIdsAndlayersIds: Map<number, number>) {

    this.homeService.vehiclesTracking.subscribe(nvt => {

      // Se obtiene el vehiculo con el imei de la ubicacion que "acaba de llegar"
      const vehicle: Vehicle = this.vehiclesObject[nvt.imei];
      const layerId: number = this.vehiclesTypesIdsAndlayersIds.get(vehicle.vehicleType);

      const featureLayers = [];
      vehiclesTypesIdsAndlayersIds.forEach(value => {
        featureLayers.push(value);
      });

      this.esriMapComp.removeGpsPoint(nvt.imei, layerId)
      .pipe(concatMap(results =>
        mapComponent.addGpsPoint(vehicle.oid, nvt.imei, vehicle.name, vehicle.description, nvt.latitude, nvt.longitude, nvt.statusId, layerId)))
        .subscribe(addGpsPointResult => {
         // mapComponent.zoomAndCenter();
          //console.log(addGpsPointResult);

          });
    });

  }

  /**
   * Establece el arreglo de duplas llave/color que se se usaran para los estatus de los vehiculos.
   * En el mapa los iconos de los vehiculos cambiaran de color de acuerdo al estutus que presenten
   * las ubicaciones.
   */
  private setAndGetStatusKeyAndColorsMap(): Map<number, string> {

    const statusKeyAndcolors = new Map<number, string>();
    statusKeyAndcolors.set(1, '#76ff03'); // verde
    statusKeyAndcolors.set(2, '#ffff00'); // amarillo

    return statusKeyAndcolors;
  }


   /** Convierte los vehiculos obtenidos desde el servidor (Dto's) a objetos tipo vehiculos */
   convertToVehicles(vehiclesDto: Array<VehicleDto>): Array<Vehicle> {

    // tslint:disable-next-line: max-line-length
    return vehiclesDto.map(vehicleDto =>  VehiclesFactory.createVehicle(vehicleDto.name, vehicleDto.description, vehicleDto.imei, vehicleDto.vehicleTypeId, vehicleDto.oid));
   }


   convertToVehiclesObject(vehicles: Array<Vehicle>) {
      const vehiclesObject = {};
      vehicles.forEach(vehicle => vehiclesObject[vehicle.imei] = vehicle );
      return vehiclesObject;
   }

   /** Crea un simbolo de un vehiculo */
   // tslint:disable-next-line: max-line-length
   createVehicleSimpleMarkerSymbol(path: string, color: string, outlineColor: any, outlineWidth: number, size: number, symbolType: SymbolsTypes): ISimpleMarkerSymbol {
    const simpleMarkerSymbol: ISimpleMarkerSymbol = {
      color,
      path,
      outline : { color: outlineColor, width: outlineWidth },
      size,
      type: symbolType

  };

    return simpleMarkerSymbol;
  }

   /**
    * 
    * @param keyAndcolors Arreglo de duplas llave/color.
    * @param size tamano del icono
    * @param outlineColor Color de la linea exterior
    * @param outlineWidth Ancho de la linea exterior
    */
   // tslint:disable-next-line: max-line-length
   createValuesInfos(keysAndcolors: Map<number, string>, size: number, outlineColor: Array<number>, outlineWidth: number, path: string, symbolsType: SymbolsTypes) {

      const valuesInfo: Array<IUniqueValueInfo> = [];

      keysAndcolors.forEach((value: string, key: number) => {
      // tslint:disable-next-line: max-line-length
      const valueinfo: IUniqueValueInfo = { value: key , symbol: this.createVehicleSimpleMarkerSymbol(path, value, outlineColor, outlineWidth, size, symbolsType)};
      valuesInfo.push(valueinfo);
     });

      return valuesInfo;
   }


   /**
    * Establece las capas 
    * @param vehiclesGroup Grupo de vehiculos
    * @param keysAndcolors  Duplas tipo de identificador de vehiculos y colores
    * @param fieldToRender  Nombre de la propiedad que se usara para cambiar los colores de los iconos
    * @param size           Tamanio de los iconos
    * @param outlineColor   Color de la linea exterior (contorno)
    * @param outlineWidth   Ancho de la linea exterior (contorno)
    */
   // tslint:disable-next-line: max-line-length
   setLayers(vehiclesGroup: Map<number, any>, keysAndcolors: Map<number, string>, fieldToRender: string, size: number, outlineColor: Array<number>, outlineWidth: number): Observable<Map<number, number>> {

    // Primero se obtienen los campos (propiedades) que tendran las ubicaciones. Tambien se obtiene el la plantilla html
    // que se usara para los popups de las ubicaciones

    return forkJoin(this.homeService.getVehicleTrackingFields(),
        this.homeService.getPopupTemplate()).pipe( concatMap(layerConfig => {

          const featureLayersObs : Observable<number>[] = [];
          const vehiclesTypesIds = [];
          const vehiclesTypesIdsAndlayersIds: Map<number, number> = new Map<number, number>();
          for (const vehicleTypeId of vehiclesGroup.keys()) {

            // Obtiene el path que define el simbolo
          const path: string = HomeComponent.vehiclesLayersSymbols[vehicleTypeId];

          // tslint:disable-next-line: max-line-length
          const valuesInfos = this.createValuesInfos(keysAndcolors, size, outlineColor, outlineWidth, path, SymbolsTypes.simpleMarkerSymbol);
          const layerName = 'layer' + vehicleTypeId.toString();
          featureLayersObs.push(this.esriMapComp.addFeatureLayer(layerName, layerConfig[0], layerConfig[1], valuesInfos, fieldToRender));
          vehiclesTypesIds.push(vehicleTypeId);
        }
          return forkJoin(featureLayersObs).pipe(concatMap(layersIds => {
            let index = 0;
            layersIds.forEach(layerId => {
              vehiclesTypesIdsAndlayersIds.set(vehiclesTypesIds[index], layerId);
              index++;
            });
            return of(vehiclesTypesIdsAndlayersIds);
          }));


        }));
   }


  ngOnInit() {

      // Se obtienen los vehiculos
      this.homeService.getVehicles()
      .subscribe(vehiclesDto => {

        this.vehicles             = this.convertToVehicles(vehiclesDto);
        this.vehiclesObject       = this.convertToVehiclesObject(this.vehicles);
        this.vehiclesTypesGrouped = UtilsService.groupBy(this.vehicles, vehicle => vehicle.vehicleType);

      });

      // this.realTimeEnabled  = true; //El valor se obtendra de la configuracion de cada usuario

      // this.settingsOpened = false;

      this.currentPositionSubject = new Subject<Array<number>>();
      this.currentPositionObs     = this.currentPositionSubject.asObservable();
      this.subscriptions          = [];
      this.statusKeysAndColors    = this.setAndGetStatusKeyAndColorsMap();
      this.subscriptions.push(this.globalGetAndSetHomeSettings());

      this.globalSetSideNav();


  }

  ngAfterViewInit(): void {


  }

  ngOnDestroy() {
    this.messengerSubscription.unsubscribe();
    this.subscriptions.forEach( subscription => { subscription.unsubscribe(); });

    this.subscriptions = [];
  }

   public mapLoadedEvent(status: boolean) {
      this.loading = false;
      this.isMapReady = status;


      // Si el mapa esta listo
      if (this.isMapReady === true) {

        const currenPositionLayerId = this.esriMapComp.addGraphicsLayer('Current Position');
        this.globalSetUserGeolocationAndSetMapCenter(currenPositionLayerId);

        this.setLayers(this.vehiclesTypesGrouped, this.statusKeysAndColors, 'StatusId', 25 , [0, 0, 0, 0.7], 0.4)
        .subscribe(vehiclesTypesIdsAndlayersIds => {

          // Se inicializa el arreglo de las duplas tipos de vehiculos e identificadores de las capas
          this.vehiclesTypesIdsAndlayersIds = vehiclesTypesIdsAndlayersIds;
          /** Se subscribe al observable de las actualizaciones de los veiculos y los muestra en el mapa.
           * Se envia el componente mapa y los identificadores de las capas que se hayan agregado
          */
          this.globalSubscribeToVehiclesLocationUpdateAndDisplayToMap(this.esriMapComp, this.vehiclesTypesIdsAndlayersIds);
        });

        // Se obtienen las configuracion para crear la capa de visualizacion de las ubicaciones de los vehiculos
        // forkJoin(this.homeService.getVehicleTrackingFields(),
        // this.homeService.getPopupTemplate(),
        // this.homeService.getValuesInfos())
        // .subscribe(featureLayerConfig => {

        //   // tslint:disable-next-line: max-line-length
        //   const vehiclePositionsLayerId = this.esriMapComp.addFeatureLayer('Vehicles Locations', featureLayerConfig[0], featureLayerConfig[1], featureLayerConfig[2], 'StatusId');
        //   if ( vehiclePositionsLayerId >= 0) {
        //   }

        // });


      } else {
        this.mapCenter = [];
      }

   }


   public modulesLoadedEvent(status: boolean) {
    this.loading = false;
    this.isMapModulesLoaded = status;
    if (status === false) {

    }
   }

   public viewMapUpdatedEvent(mapEvent: MapEvents) {
     if (mapEvent === MapEvents.GraphicAdded
      && !(this.esriMapComp as EsriMapComponent).isDragging
      && !(this.esriMapComp as EsriMapComponent).isZooming) {
        this.esriMapComp.zoomAndCenter();
     }
   }

   //#endregion

}