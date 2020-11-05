export interface VehicleTracking {

    oid: number;

    latitude: number;

    longitude: number;

    name: string;

    description: string;

    statusId: number;

    imei: string;

}

/** Interface que define el objeto de transferencia de datos en la capa
 * de tiempo real ()
 */
export interface VehicleTrackingDto {

    latitude: number;

    longitude: number;

    velocity: number;

    imei: string;

    statusId: number;

}
