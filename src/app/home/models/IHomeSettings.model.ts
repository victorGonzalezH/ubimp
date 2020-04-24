import { ReferenceSystems } from 'src/app/esri-map/models/referenceSystem.enum';

export interface IHomeSettings {

    /** Indica el zoom inicial que tendra el mapa */
    mapZoomLevel: number;

    /** Indica el centro del mapa */
    mapCenter: Array<number>;

    /** Indica el tipo de mapa */
    baseMap: string;

    /** Sistema de coordenadas */
    referenceSystem: ReferenceSystems;
}
