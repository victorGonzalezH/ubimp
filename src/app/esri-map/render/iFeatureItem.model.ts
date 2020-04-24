/**
 * Interface que describe un punto para ser representado en el mapa.
 */
export interface IFeatureItem {

    /**
     * Identificador unico del punto
     */
    id: number;

    /**
     * Coordenada X del punto
     */
    x: number;

    /**
     * Coordenada y del punto
     */
    y: number;

    /**
     * Descripcion del punto
     */
    description: string;

}
