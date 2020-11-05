
export interface HomeSettings {

    /** Indica el zoom inicial que tendra el mapa */
    mapZoomLevel: number;

    /** Indica el centro del mapa */
    mapCenter: Array<number>;

    /** Indica el tipo de mapa */
    baseMap: string;

    /** Sistema de coordenadas */
    referenceSystem: ReferenceSystems;
}


export enum ReferenceSystems {

    /** Sistema de referencia que usa latitud y longitud. En arcgis el Well Know Id es 4326 */
    GPS,

    /** Sistema de referencia que usa un mapa Web Marcator. En arcgis el Well Know id es 3857 */
    WebMarcator
}
