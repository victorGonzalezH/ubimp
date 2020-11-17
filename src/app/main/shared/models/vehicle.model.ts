import { VehicleTypes } from '../enums/vehicles-types.enum';
import { VehicleTracking, VehicleTrackingDto } from './vehicle-tracking.model';
import { VehiclesStatus } from '../enums/vehicles-status.enum';
import { on } from 'esri/core/watchUtils';

export class VehiclesFactory {

    public static createVehicle(name: string, description: string, imei: string, vehicleTypeId: number, status: number, oid: number, online: boolean, latitude?: number, longitude?: number, velocity?: number ): Vehicle {
        let vehicle: Vehicle = null;
        if ( latitude !== undefined && longitude !== undefined && velocity !== undefined) {
            const tracking = new VehicleTracking({ imei, latitude, longitude, velocity, oid: 0 });
            vehicle = new Vehicle(name, description, imei, vehicleTypeId, status, oid, online, tracking );
        } else {
            vehicle = new Vehicle(name, description, imei, vehicleTypeId, status, oid, online );
        }

        return vehicle;
    }

    public static createVehicleFromDto(vehicleDto: VehicleDto): Vehicle {

        let vehicle: Vehicle = null;
        if (vehicleDto.tracking != null && vehicleDto.tracking != undefined && vehicleDto.tracking.length > 0) {
            const initialTracking = vehicleDto.tracking[0];
            const tracking = new VehicleTracking({ imei: vehicleDto.imei, latitude: initialTracking.latitude, longitude: initialTracking.longitude, velocity: initialTracking.velocity, oid: 0 });
            vehicle = new Vehicle(vehicleDto.name, vehicleDto.description, vehicleDto.imei, vehicleDto.vehicleTypeId, vehicleDto.status, vehicleDto.oid, vehicleDto.online, tracking);
        } else {
            vehicle = new Vehicle(vehicleDto.name, vehicleDto.description, vehicleDto.imei, vehicleDto.vehicleTypeId, vehicleDto.status, vehicleDto.oid, vehicleDto.online);
        }
        return vehicle;
    }
}


export class Vehicle {

    name: string;

    description: string;

    imei: string;

    vehicleType: VehicleTypes;

    status: VehiclesStatus;

    oid: number;

    online: boolean;

    tracking: VehicleTracking[];

    constructor(name: string, description: string, imei: string, vehicleType: number, status: number, oid: number, online: boolean, initialTracking?: VehicleTracking) {
        this.name = name;
        this.description = description;
        this.imei = imei;
        this.vehicleType = vehicleType;
        this.status = status;
        this.oid = oid;
        this.online = online;
        this.tracking = [];
        this.tracking.push(initialTracking);
    }
}


export interface VehicleDto {

    name: string;

    description: string;

    imei: string;

    vehicleTypeId: VehicleTypes;

    status: VehiclesStatus;

    oid: number;

    online: boolean;

    tracking: VehicleTrackingDto[];
}
