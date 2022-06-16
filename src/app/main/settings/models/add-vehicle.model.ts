import { EditVehicle } from "./edit-vehicle.model";

export interface AddVehicle extends EditVehicle {
    
    /**
     * The username of the user. The backend will resolve de ownerUserId
     */
    username: string; 
    
}