import {  Component, OnInit, ViewChild, ElementRef, Input, Output,
  EventEmitter, OnDestroy, OnChanges, SimpleChanges, Directive } from '@angular/core';
import { loadModules } from 'esri-loader';
import { setDefaultOptions } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types
import * as StreamLayer from 'esri/layers/StreamLayer';
import * as StreamLayerView from 'esri/views/layers/StreamLayerView';
import { ReferenceSystems } from './models/referenceSystem.enum';
import * as FeatureLayer from 'esri/layers/FeatureLayer';
import * as Graphic from 'esri/Graphic';
import { Point, Extent } from 'esri/geometry';
import { Observable, of, pipe, throwError, from, fromEvent } from 'rxjs';
import { catchError, mergeMap, map, concatMap } from 'rxjs/operators';
import { IField } from './render/IField.model';
import { IPopupTemplate } from './render/iPopupTemplate.model';
import { ISymbol } from './symbols/iSymbol.model';
import { FieldType, FieldTypes } from './render/fieldType.enum';
import { IUniqueValueInfo } from './render/IUniqueValueInfo.model';
import { IUniqueValueRenderer } from './render/IUniqueValueRenderer.model';
import { SymbolsTypes } from './symbols/symbolsTypes.enum';
import { IPictureSymbol } from './symbols/IPictureSymbol.model';
import { ISimpleMarkerSymbol } from './symbols/ISimpleMarkerSymbol.model';
import { IKeyNumberValuePair } from 'utils';
import { CalciteWebCoreIcons } from './render/calciteWebCoreIcons.enum';
import * as FeatureSet from 'esri/tasks/support/FeatureSet';
import { ApplyEditsToLayerResult } from './models/apply-edits-to-layer-result.model';
import * as Layer from 'esri/layers/Layer';
import * as MapView from 'esri/views/MapView';
import * as FeatureLayerView from 'esri/views/layers/FeatureLayerView';
import { MapEvents } from './enums/mapEvents.enum';


/** Enumerado para identificar los modulos disponibles para cargar de la API de Arcgis */
export enum EsriModules {
    Config
  , Map
  , MapView
  , FeatureLayer
  , GraphicsLayer
  , Graphic
  , Point
  , Polygon
  , Font
  , TextSymbol
  , PictureMarkerSymbol
  , SimpleMarkerSymbol
  , UniqueValueRenderer
}


export interface IMap {

  zoomAndCenter();

  /**
   * @param latitude latitud
   * @param longitude longitud
   */
  // addGpsPoint(oid: number, name: string, description: string, latitude: number, longitude: number): Observable<number>;

  // addGpsPoint(): Promise<number>;
  /**
   *
   * @param oid
   * @param name
   * @param description
   * @param latitude
   * @param longitude
   * @param statusId
   * @param layerId
   */
  // tslint:disable-next-line: max-line-length
  addGpsPoint(oid: number, imei: string, name: string, description: string, latitude: number, longitude: number, statusId: number, layerId: number): Observable<number>;

  removeGpsPoint(imei: string, layerId: number): Observable<number>;

  // deletePoints(id: string): boolean;


  /**
   *
   * @param title titulo de la capa featureLayer / title
   * @param fields Campos o atributos que contendran los obejtos que se desean mostrar en la capa
   * @param popupTemplate Plantilla
   * @param valuesAndSymbols Coleccion de valores y simbolos (iconos en el mapa) que usaran los objetos
   * dependiendo del valor especificado en fieldName
   * @param fieldName Campo (que pertenece a fields) que servira para aplicar los diferentes simbolos
   */

  /**
   *
   * @param title Titulo de la capa. Este nombre debe de ser unico entre todas las capas
   * @param fields
   * @param popupTemplate
   * @param valuesAndSymbols
   * @param fieldName
   */
  // tslint:disable-next-line: unified-signatures, max-line-length
   addFeatureLayer(title: string, fields: IField[], popupTemplate: IPopupTemplate, valuesAndSymbols: IUniqueValueInfo[], fieldName: string): Observable<number>;

   addGraphicsLayer(title: string): number;

    /** Agrega un punto usando un simbolo icono de la familia CalciteWebCoreIcons de esri */
   addSymbolGraphicPoint(latitude: number, longitude: number, icon: CalciteWebCoreIcons, color: string, size: number, layerId: number): boolean;
}

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})


// tslint:disable-next-line: directive-class-suffix
export class EsriMapComponent implements OnInit, OnChanges, OnDestroy, IMap {

  /**
   * Idicates if map was sucessfully loaded or no
   */
  @Output() mapLoadedEvent: EventEmitter<boolean>;

/**
 * Evento que indica si los modulos esri se han cargado correctamente
 */
  @Output() modulesLoadedEvent: EventEmitter<boolean>;

  /**
   * Evento que indica cuando el view map ha sido actualizado
  */
  @Output() viewMapUpdatedEvent: EventEmitter<MapEvents>;

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;


  private zoomProperty: number;
  private centerProperty: Array<number>;
  private basemapProperty: string;
  private referenceSystemProperty: ReferenceSystems;
  private maploadedSucces = false;

  /** Visualizador del mapa */
  private mapView: esri.MapView;
  /** Objeto Map */
  private map: esri.Map;

  private animationDuration: number;
  private streamLayer: StreamLayer;
  private streamLayerView: StreamLayerView;
  private featureLayer: FeatureLayer;
  private esriModules: Array<any>;

  /** Objeto que contiene los ids de las capas del mapa y los relaciona con su nombre */
  private layersId: Array<IKeyNumberValuePair>;

  /**
   * Arreglo que contiene el id de la capa y las vistas de las capas (layerViews)
   */
  private layersIdsAndLayersViews: Array<IKeyNumberValuePair>;

  /**
   * Arreglo que contiene el id de la capa y el ultimo extent generado por esa capa
   */
  private layersIdsAndExtents: Array<IKeyNumberValuePair>;

  /**
   * Ultimo evento generado del mapa
   */
  private lastMapEvent: MapEvents;

  private isDraggingP: boolean;

  /**
   * Indica si esta sucediendo el evento de arratrar en el mapa
  */
  get isDragging(): boolean {
    return this.isDraggingP;
  }

  private isZoomingP: boolean;

  /**
   * Indicates if zooming its being performed / Indica si se esta realizando zoom en el mapa
   */
  get isZooming(): boolean {
    return this.isZoomingP;
  }

  get mapLoaded(): boolean {
    return this.maploadedSucces;
  }

  @Input()
  set zoom(zoom: number) {
    this.zoomProperty = zoom;
  }

  get zoom(): number {
    return this.zoomProperty;
  }

  @Input()
  set center(center: Array<number>) {
    this.centerProperty = center;
    if ( this.centerProperty !== null && this.mapLoaded === true) {
      this.globalSetMapCenterWithGPSCoordinates(this.centerProperty[0], this.centerProperty[1], this.animationDuration);

    }

  }

  get center(): Array<number> {
    return this.centerProperty;
  }


  @Input()
  set basemap(basemap: string) {
    this.basemapProperty = basemap;
  }

  get basemap(): string {
    return this.basemapProperty;
  }

  @Input()
  set referenceSystem(referenceSystem: ReferenceSystems) {
    this.referenceSystemProperty = referenceSystem;
  }

  get referenceSystem(): ReferenceSystems {
    return this.referenceSystemProperty;
  }

  constructor() {

    this.zoomProperty = -1;
    this.basemapProperty = null;
    this.animationDuration = 500;
    this.modulesLoadedEvent = new EventEmitter<boolean>();
    this.mapLoadedEvent = new EventEmitter<boolean>();
    this.viewMapUpdatedEvent = new EventEmitter<MapEvents>();
    this.layersId = [];
    this.layersIdsAndLayersViews = [];
    this.layersIdsAndExtents = [];
    this.lastMapEvent = MapEvents.None;
    this.isDraggingP = false;
  }

  // tslint:disable-next-line: max-line-length
  addSymbolGraphicPoint(latitude: number, longitude: number, icon: CalciteWebCoreIcons, color: string, size: number, layerId: number): boolean {
    // tslint:disable-next-line: no-shadowed-variable
    const [Point, Graphic] = this.getEsriModule(EsriModules.Point, EsriModules.Graphic);

    const point = new Point({
      longitude,
      latitude
    });

    const textSymbol = {
      type: 'text', // autocasts as new TextSymbol()
      color,
      text: icon, // esri-icon
      font: { // autocasts as new Font()
        size,
        family: 'CalciteWebCoreIcons'
      }
    };

    const graphic = new Graphic({
      geometry: point,
      symbol: textSymbol
    });


    const graphicsLayer: esri.GraphicsLayer = this.getLayer(layerId);

    graphicsLayer.add(graphic);

    return true;
  }

  /**
   * Obtiene los modulos que previamente se cargaron al iniciarse el componente. Los tipos de nombres
   * deben de estar en orden ascendente, es decir, si se solicita el modulo Point con indice 0, entonces
   * los siguientes modulos deben de tener un indice mayor, por ejemplo 1, 2 etc. Consulte el enumerado
   * EsriModules para ver la prescedencia de los modulos
   * @param esriModulesTypes Arreglo de los tipos de modulos que se desea obtener
   */
  private getEsriModule(...esriModulesTypes: EsriModules[]): Array<any> {
    const loadedEsriModules: Array<any> = [];
    esriModulesTypes.forEach(esriType => {
      loadedEsriModules.push(this.esriModules[esriType]);
    });
    return loadedEsriModules;
  }

  /**
   *
   * @param oid
   * @param name
   * @param description
   * @param latitude
   * @param longitude
   * @param statusId
   * @param layerId
   */
  // tslint:disable-next-line: max-line-length
  public addGpsPoint(oid: number, imei: string, name: string, description: string, latitude: number, longitude: number, statusId: number, layerId: number): Observable<number> {
    // tslint:disable-next-line: no-shadowed-variable
    const [Point, Graphic, Font, TextSymbol, SimpleMarkerSymbol] =
    this.getEsriModule(EsriModules.Point, EsriModules.Graphic, EsriModules.Font, EsriModules.TextSymbol, EsriModules.SimpleMarkerSymbol);

    const item = { latitude, longitude, oid, name, description, statusId, imei };

    // create an array of graphics based on the data above
    const graphics: Array<Graphic> = [];

    const simpleMarkerSymbol = new SimpleMarkerSymbol({
      // use an SVG path to create an arrow shape
      // tslint:disable-next-line: max-line-length
      path: 'M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z',
      color: '#ffff00',
      outline: {
        color: [0, 0, 0, 0.7],
        width: 0.5
      },
      // since the arrow points down, you can set the angle to 180
      // to force it to point up (0 degrees North) by default
      size: 20
    });

    const point = new Point({ latitude: item.latitude, longitude: item.longitude });
    const graphic = new Graphic({ geometry: point,  attributes: item });
    graphics.push(graphic);

    const addEdits = {
      addFeatures: graphics
    };

    return this.applyEditsToLayer(layerId, addEdits).pipe(map(applyResult => {
      if (applyResult.result === 1) {
        this.lastMapEvent = MapEvents.GraphicAdded;
        return applyResult.oids[0];
      }
      return -1;
    }));

    // tslint:disable-next-line: no-shadowed-variable
    // return new Promise((resolve, reject) => {
    //   // data.forEach(item => {
    //  // });
    //   // addEdits object tells applyEdits that you want to add the features



    //   this.applyEditsToLayer(layerId, addEdits)
    //   .subscribe(editOperationResult => {

    //     resolve(editOperationResult);

    //    }, error => {
    //     reject(0);
    //    });

    // });
  }

  private getFeatureByImei(imei: string, layerId: number): Promise<FeatureSet> {
    const layer: FeatureLayer = this.getLayer(layerId);
    const query = { where: 'imei = ' + '\'' + imei + '\'' };

    return layer.queryFeatures(query);
  }

  /**
   *
   * @param oid Object Id/Id del objeto
   * @param layerId Layer identifier/Identificador de la capa
   */
  public removeGpsPoint(imei: string, layerId: number): Observable<number> {
    return from(this.getFeatureByImei(imei, layerId))
    .pipe(concatMap(results => {
     if (results.features.length <= 0) {
     return of(-1);
    }

     const deleteEdits = {
        deleteFeatures: results.features
      };

     return this.applyEditsToLayer(layerId, deleteEdits).pipe(concatMap(applyEditResult => of(applyEditResult.result)));
      }));
  }


private getFeatureLayerView(layerId: number): FeatureLayerView {
  const featureLayerView = this.layersIdsAndLayersViews.find(layerView => layerView.key === layerId).value;
  return featureLayerView;
}

private getLayer(layerId: number): any {
  const title: string = this.layersId.find(layer => layer.key === layerId).value;
  const layerToReturn = this.map.layers.find(layer => layer.title === title);
  return layerToReturn;
}

private applyEditsToLayer(layerId: number, edits: esri.FeatureLayerApplyEditsEdits): Observable<ApplyEditsToLayerResult> {
    const featureLayer: esri.FeatureLayer = this.getLayer(layerId);
    return from(featureLayer.applyEdits(edits)).pipe(map(results => {

      if (results.deleteFeatureResults.length > 0) {
        return { result: -1, oids: [] };
    }

      if (results.addFeatureResults.length > 0) {
      const objectIds = [];
      results.addFeatureResults.forEach((item) => {
        objectIds.push(item.objectId);
      });

      return { result: 1, oids: objectIds };

      // Consulta las puntos reciende agregados recientemente
      // this.featureLayer.queryFeatures({
      //     objectIds
      //   }).then((results) => {
      //     return of(1);
      //   });
      }

    }), catchError(error => { console.log(error); return throwError(error); }));

  }



/**
 * @param latitude latitud
 * @param longitude longitud
 * @param animationDuratioInMs duracion de la animacion
 */
  private globalSetMapCenterWithGPSCoordinates(latitude: number, longitude: number, animationDuratioInMs: number) {

    // tslint:disable-next-line: triple-equals
    if (this.maploadedSucces == true) {

      this.mapView.goTo([longitude, latitude], { duration: animationDuratioInMs });
    }

  }

  /**
   * 
   * @param mapView
   */
  private setMapViewEvents(mapView: MapView) {

    mapView.on('drag', event => {
      switch (event.action) {
        case 'start': this.isDraggingP = true;
                      this.lastMapEvent = MapEvents.Dragging_Start;
                      break;
        case 'update': this.isDraggingP = true;
                       this.lastMapEvent = MapEvents.Dragging;
                       break;
        case 'end': this.isDraggingP = false;
                    this.lastMapEvent = MapEvents.Dragging_End;
                    break;
      }
     });
  }


  /**
   * 
   * @param mapView
   * @param properties
   */
  private setMapViewPropertiesWatch(mapView: MapView, properties: Array<string>, ) {

    properties.forEach(property => {
      mapView.watch(property, val => {
        switch (property) {
            case 'zoom':
            this.isZoomingP = true;
            break;

            case 'updating':
            if (val === false) {
              this.isZoomingP = false;
            }
            break;
        }

      });
    });

  }


  /**
   * @param basemap tipo de mapa base
   * @param zoomLevel zoom
   * @param center centro del mapa
   */
private globalInitializaMapAndSetMapView(basemap: string, zoomLevel: number, center: Array<number>) {

  if (zoomLevel > 0 && basemap !== null) {

        this.initializeMap(this.basemapProperty, this.getWkid(this.referenceSystemProperty), this.centerProperty, this.zoomProperty)
    .then( (mapView: esri.MapView) => {

        this.mapView          = mapView;
        this.maploadedSucces  = this.mapView.ready;
        this.map              = this.mapView.map;

        this.setMapViewEvents(this.mapView);
        this.setMapViewPropertiesWatch(this.mapView, ['zoom', 'updating']);
        this.mapLoadedEvent.emit(this.mapView.ready);
      }, (reason: any) => {


      })
      .catch(error => {

        // hubo un error al cargar el mapa
        this.mapLoadedEvent.emit(false);
      });
    } else {
      this.mapLoadedEvent.emit(false);
    }
}

  /** Obtiene el Well Know Id de acuerdo al sistema de referencia */
  private getWkid(referenceSystem: ReferenceSystems) {

    switch (referenceSystem) {
        default:
        case ReferenceSystems.GPS: return 4326;
        case ReferenceSystems.WebMarcator: return 3857;
      }
  }


  private createFeatureLayerConfig(title: string): any {
    // tslint:disable-next-line: max-line-length
    const [Font, TextSymbol, SimpleMarkerSymbol] = this.getEsriModule(EsriModules.Font, EsriModules.TextSymbol, EsriModules.SimpleMarkerSymbol);
    const font = new Font('20pt', Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, 'CalciteWebCoreIcons');
    const textSymbol: esri.TextSymbol = new TextSymbol( {
      color: '#7A003C',
      backgroundColor: '#FFFFFF',
      text: '\uf5de', // esri-icon-map-pin
      font: {
        // autocasts as new Font()
        size: 20,
        family: 'FontAwesome'// 'CalciteWebCoreIcons'
      }
    });

  //   const pictureSymbol = new PictureSymbol( {
  // url: 'assets/images/svg/car.svg',
  // width: '48px',
  // height: '48px'});

    const simpleMarkerSymbol = new SimpleMarkerSymbol({
    // use an SVG path to create an arrow shape
    // tslint:disable-next-line: max-line-length
    path: 'M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z',
    color: '#ffff00',
    outline: {
      color: [0, 0, 0, 0.7],
      width: 0.5
    },
    // since the arrow points down, you can set the angle to 180
    // to force it to point up (0 degrees North) by default
    size: 20
  });

    const featureLayerConfig = {
      // create an instance of esri/layers/support/Field for each field object
      title,
      fields: [
        {
          name: 'ObjectID',
          alias: 'ObjectID',
          type: 'oid'
        },
        {
          name: 'Name',
          alias: 'Name',
          type: 'string'
        },
        {
          name: 'Type',
          alias: 'Type',
          type: 'string'
        }
      ],
      objectIdField: 'ObjectID',
      geometryType: 'point',
      spatialReference: { wkid: 4326 },
      source: [], // adding an empty feature collection
      renderer: {
        type: 'simple',
        // , symbol: simpleMarkerSymbol
      },
      popupTemplate: {
        title: '{Name}'
      }
    };

    return featureLayerConfig;

  }

  /**
   * Crea el mapa y lo inicializa
   */
  async initializeMap(basemap: string, wkid: number, center: Array<number>, zoom: number) {

    try {

      // Carga los modulos del API de Arcgis para JavaScript
      // tslint:disable-next-line: no-shadowed-variable
      const [Config, EsriMap, MapView, FeatureLayer] = this.getEsriModule(EsriModules.Config,
                                                        EsriModules.Map, EsriModules.MapView,
                                                        EsriModules.FeatureLayer);

      // Configuracion del mapa
      const mapProperties: esri.MapProperties = { basemap };

      const map: esri.Map = new EsriMap(mapProperties);

      // Inicializa el mapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center,
        zoom,
        // spatialReference : { wkid },
        map,
        constraints: { snapToZoom: false }
      };

      const mapView: esri.MapView = new MapView(mapViewProperties);
      // const featureLayer: esri.FeatureLayer = new FeatureLayer(this.createFeatureLayerConfig('features'));
      // map.add(featureLayer);

      await mapView.when();

      return mapView;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /** Carga los modulos esri */
  async loadEsriModules(): Promise<any[]> {

    return await loadModules(['esri/config', 'esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer', 'esri/Graphic', 'esri/geometry/Point', 'esri/geometry/Polygon', 'esri/symbols/Font',
    'esri/symbols/TextSymbol', 'esri/symbols/PictureMarkerSymbol', 'esri/symbols/SimpleMarkerSymbol',
    'esri/renderers/UniqueValueRenderer']);
  }


  /** Crea el simbolo */
  private createSymbol(symbol: ISymbol): any {

  const [PictureSymbol, SimpleMarkerSymbol] = this.getEsriModule(EsriModules.PictureMarkerSymbol, EsriModules.SimpleMarkerSymbol);

  // const simpleMarkerSymbol = new SimpleMarkerSymbol({
  //   // use an SVG path to create an arrow shape
  //   // tslint:disable-next-line: max-line-length
  //   path: 'M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z',
  //   color: '#ffff00',
  //   outline: {
  //     color: [0, 0, 0, 0.7],
  //     width: 0.5
  //   },
  //   // since the arrow points down, you can set the angle to 180
  //   // to force it to point up (0 degrees North) by default
  //   size: 20
  // });

  if (symbol.type === SymbolsTypes.pictureSymbol) {

  const pictureSymbol = new PictureSymbol( {
   url:  (symbol as IPictureSymbol).url,
   width: (symbol as IPictureSymbol).width,
   height: (symbol as IPictureSymbol).height });
  return pictureSymbol;
  }
  if (symbol.type === SymbolsTypes.simpleMarkerSymbol) {

    const simpleMarkerSymbol = new SimpleMarkerSymbol({

      path: (symbol as ISimpleMarkerSymbol).path,
      color: (symbol as ISimpleMarkerSymbol).color,
      outline: {
        color: (symbol as ISimpleMarkerSymbol).outline.color,
        width: (symbol as ISimpleMarkerSymbol).outline.width
      },
      size: (symbol as ISimpleMarkerSymbol).size
    });

    return simpleMarkerSymbol;
  }

  return null;
}

  private createRenderer(filedName: string, valuesInfos: IUniqueValueInfo[]): esri.UniqueValueRenderer {
    const [UniqueValueRenderer] = this.getEsriModule(EsriModules.UniqueValueRenderer);
    const renderer: esri.UniqueValueRenderer = new UniqueValueRenderer ({
      field: filedName,
      uniqueValueInfos: valuesInfos.map( valueInfo => ({ value: valueInfo.value, symbol : this.createSymbol(valueInfo.symbol) }) ),
    });

    // renderer.defaultSymbol = this.createSymbol(valuesInfos[0].symbol);
    return renderer;
  }


addGraphicsLayer(title: string): number {
  const [GraphicsLayer] = this.getEsriModule(EsriModules.GraphicsLayer);

  // Add graphic when GraphicsLayer is constructed
  const graphicsLayer = new GraphicsLayer({ title });

  this.map.add(graphicsLayer);
  const layerId = this.layersId.length;
  this.layersId.push({ key : layerId, value: graphicsLayer.title });
  return layerId;
}

/**
 * 
 * @param extents
 */
private getFullExtent(extents: Array<Extent>): Extent {

let cloned = extents[0].clone();
for (let i = 1; i < extents.length; i++) {
  if (extents[i] != null) {
    const extended = cloned.union(extents[i]);
    cloned = extended;
  }
}
return extents.length === 1 ? cloned.expand(5.0) : cloned.expand(2.5);

}


public zoomAndCenter() {
  if (this.layersIdsAndExtents.length > 0) {

    if (this.layersIdsAndExtents.length === 1) {
      this.mapView.goTo({target: this.layersIdsAndExtents[0].value.center, zoom: 12});
    } else {
      const fullExtent: Extent = this.getFullExtent(this.layersIdsAndExtents.map(layerIdAndExtent => layerIdAndExtent.value));
      this.mapView.goTo(fullExtent);
    }
  }
  
  // const promises = Array<any>();
  // layersIds.forEach(layerId => {

  //   const featureLayerView: FeatureLayerView = this.getFeatureLayerView(layerId);
  //   //console.log(featureLayerView.layer.title);
  //   promises.push(featureLayerView.queryExtent());

  // });

  // from(Promise.all(promises)).subscribe( result => console.log(result));
}

/**
 * 
 * @param layer Capa
 * @param mapView map View
 */
private setAndGetFeatureLayerView(layer: FeatureLayer, mapView: MapView): Observable<FeatureLayerView> {

  return from(mapView.whenLayerView(layer));

}


//#region Funciones
// tslint:disable-next-line: max-line-length
addFeatureLayer(title: string, fields: IField[], popupTemplate: IPopupTemplate, valuesAndSymbol: IUniqueValueInfo[], fieldName: string): Observable<number> {

  // tslint:disable-next-line: no-shadowed-variable
  const [FeatureLayer] = this.getEsriModule(EsriModules.FeatureLayer);

  let objectIdField = fields.find(field => field.fieldType === FieldTypes.oid);


  // Si el campo objectId Field no se encuentra se agrega
  if (objectIdField === undefined) {
    objectIdField = { alias: 'objectId', fieldType: FieldTypes.oid, name: 'objectId' };
    fields.push(objectIdField);
  }

  const featureLayerConfig = {
    title,
    fields: fields.map(field =>  ({name: field.name, alias: field.alias, type: FieldType.getFieldTypeName(field.fieldType)})),
    objectIdField: objectIdField.name,
    geometryType: 'point',
    spatialReference: { wkid: 4326 },
    source: [], // Se agrega una colleccion vacia
    renderer: this.createRenderer(fieldName, valuesAndSymbol),
    popupTemplate: {
      title: popupTemplate.title, content: popupTemplate.content
    }
  };

  const featureLayer: esri.FeatureLayer = new FeatureLayer(featureLayerConfig);
  this.map.add(featureLayer);
  const layerId = this.layersId.length;
  this.layersId.push({ key : layerId, value: featureLayer.title });
  // Se llama a la funcion setAndGetFeatureLayerView que crea y devuelve el featureLayerView de la capa creada.
  return this.setAndGetFeatureLayerView(featureLayer, this.mapView)
  .pipe(map(featureLayerView => {

    featureLayerView.watch('updating', val => {

      if (!val) {  // wait for the layer view to finish updating
        if (this.isDraggingP === false && this.lastMapEvent === MapEvents.GraphicAdded) {
          featureLayerView.queryExtent()
        .then(results => {
          if (results.count > 0 ) {
              const layerIdAndExtent = this.layersIdsAndExtents.find(localLayerIdAndExtent => localLayerIdAndExtent.key === layerId);
              if (layerIdAndExtent === undefined || layerIdAndExtent === null) {
                this.layersIdsAndExtents.push({ key: layerId, value: results.extent });
              } else {
                layerIdAndExtent.value = results.extent;
              }

              this.viewMapUpdatedEvent.emit(this.lastMapEvent);

          }
        });
        } else {

        }
      }
    });

    // Se agrega el layerView al arreglo de layersView con el indice de la capa que le corresponde
    this.layersIdsAndLayersViews.push({key: layerId, value: featureLayerView });
    return layerId;
  }));

}
//#endregion



ngOnInit() {
    setDefaultOptions({ css: true  });
    this.mapView = null;
    this.loadEsriModules().then( esriModules => {
      // Los modulos se han cargado correctamente
      // Se comunica al componente padre que los modulos de esri se cargaron correctamente
      this.modulesLoadedEvent.emit(true);
      this.esriModules = esriModules;
      this.globalInitializaMapAndSetMapView(this.basemapProperty, this.zoomProperty, this.centerProperty);
    }, (reason: any) => {
      // Se comunica al componente padre que los modulos de esri no se cargaron correctamente
      this.modulesLoadedEvent.emit(false);
    });

  }

  /**
   * @param changes Cambios detectados en las propiedades del componente
   */
ngOnChanges(changes: SimpleChanges): void {



  }



ngOnDestroy() {
    if (this.mapView) {

      // Destruye el mapView
      this.mapView.container = null;
    }
  }
}


//  // Construct Stream Layer
      // this.streamLayer = new StreamLayer({
      //   url: 'https://localhost:3000',
      //   purgeOptions: {
      //     displayCount: 10000
      //   }
      // });

       // map.add(this.streamLayer);

      // mapView.whenLayerView(this.streamLayer).then((layerView) => {

      //   this.streamLayerView = layerView;
      //   layerView.watch('connectionStatus', (value) => {

      //     if (value === 'connected') {

      //     } else {

      //     }
      //   });


      //   layerView.watch('updating', (value) => {

      //     if(!value){

      //       layerView.queryExtent().then(features => {

      //         console.log(features.extent);
      //         if (features.extent != null) {
      //           const centerPosition = {  center: [features.extent.center ], zoom: 10 };
      // tslint:disable-next-line: max-line-length
      //           this._view.goTo(centerPosition, {duration: 1000}).then((result) => { console.log(result); }, (err) => { console.log(err); }); }
      //         }

      //         ,(error) => { console.log(error); });
      //       }});

      //   layerView.on('data-received', (value) => {

      //   });

        // GeometryDefinitionChange event
        // this.streamLayer.watch('geometryDefinition', (data) => {console.log(data)});

      // });
