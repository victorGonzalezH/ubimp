import {  Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types
import * as StreamLayer from 'esri/layers/StreamLayer';


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 10;
  private _center: Array<number> = [-117.98118, 34.00679];
  private _basemap = 'gray'; //streets
  private _loaded = false;
  private _view: esri.MapView = null;

  private streamLayer: StreamLayer;
  private streamLayerView: any;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor() {}

  async initializeMap() 
  {
    try 
    {
      // Load the modules for the ArcGIS API for JavaScript
      //Carga los modulos del API de Arcgis para JS
      const [EsriMap, MapView, StreamLayer, GraphicsLayer, Polygon, Graphic] = await loadModules(['esri/Map',
      'esri/views/MapView', 'esri/layers/StreamLayer', 'esri/layers/GraphicsLayer',
      'esri/geometry/Polygon',
      'esri/Graphic']);

      // Configure the Map
      const mapProperties: esri.MapProperties = { basemap: this._basemap };

      const map: esri.Map = new EsriMap(mapProperties);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      this._view = new MapView(mapViewProperties);

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

       // Construct Stream Layer
      this.streamLayer = new StreamLayer({
        url: 'https://localhost:3000',
        purgeOptions: {
          displayCount: 10000
        }
      });

      map.add(this.streamLayer);
      
      this._view.whenLayerView(this.streamLayer).then((layerView) => {
        
        this.streamLayerView = layerView;

        // processConnect();
        console.log(1);
        layerView.watch('connectionStatus', (value) => {
          console.log(2);
          console.log(value);
          if (value === 'connected') {
            //processConnect();
          } else {
            //processDisconnect();
          }
        });

        layerView.watch('updating', (value) => {
          console.log(3);
          console.log(value);
        });

        
        layerView. on('data-received', (value) => {
          console.log(4);
          console.log(value);
        });

        // GeometryDefinitionChange event
        this.streamLayer.watch('geometryDefinition', (data) => {console.log(data)
        });
      });
      

      await this._view.when();
      return this._view;
    } 
    catch (error) 
    {
      throw error;
    }
  }

  ngOnInit() 
  {

    // Initialize MapView and return an instance of MapView
    this.initializeMap()
    .then( mapView => 
      {
        //El mapa ha sido inicializado
        //console.log('mapView ready: ', this._view.ready);
        this._loaded = this._view.ready;
        this.mapLoadedEvent.emit(true);
      })
      .catch(error => 
      { 
        //hubo un error al cargar el mapa
        this.mapLoadedEvent.emit(false);
        
      });
  }

  ngOnDestroy() 
  {
    if (this._view) 
    {
      // destroy the map view
      this._view.container = null;
    }
  }
}