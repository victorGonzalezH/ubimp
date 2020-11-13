import { VehicleTypes } from '../enums/vehicles-types.enum';
import { VehicleTracking } from './vehicle-tracking.model';

export class VehiclesFactory {

    public static createVehicle(name: string, description: string, imei: string, vehicleTypeId: number, oid: number): Vehicle {

        // tslint:disable-next-line: no-use-before-declare
        const vehicle: Vehicle = new Vehicle(name, description, imei, vehicleTypeId, oid);
        return vehicle;
    }
}


export class Vehicle {

    name: string;

    description: string;

    imei: string;

    vehicleType: VehicleTypes;

    oid: number;

    constructor(name: string, description: string, imei: string, vehicleTypeId: number, oid: number) {
        this.name = name;
        this.description = description;
        this.imei = imei;
        this.vehicleType = vehicleTypeId;
        this.oid = oid;
    }
}


export interface VehicleDto {

    name: string;

    description: string;

    imei: string;

    vehicleTypeId: number;

    oid: number;

    tracking: VehicleTracking[];
}
