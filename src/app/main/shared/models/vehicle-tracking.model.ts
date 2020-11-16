export class VehicleTracking {

    constructor({ imei, latitude, longitude, velocity, oid  }){
        this.imei = imei;
        this.latitude = latitude;
        this.longitude = longitude;
        this.velocity = velocity;
        this.oid = oid;

    }

    public oid: number;

    public latitude: number;

    public longitude: number;

    public velocity: number;

    public imei: string;

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
