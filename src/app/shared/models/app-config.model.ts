/**
 * Interface para obtener la configuracion de la aplicacion
 */
export interface AppConfigModel {

    endPoints: EndPoint[];

    realtimeEndPointUrl: string;

    appVersion: number;
}



export interface EndPoint {

    name: string;

    url: string;
}
