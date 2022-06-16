export interface EditVehicle {
    
    /**
     * In case is a object this is its name
     */
     name?: string;

    /**
     * The imei of the device
     */
    imei?: string;

    /**
     * Object type id 
     */
     objectTypeId?: string;

     /**
      * name of the vehicle group
      */
    vehicleGroupName?: string;
    
    /**
     * Name of the brand
     */
    brand? : string;

    /**
     * Name of the model
     */
    model? : string;

    /**
     * Licence plate
     */
    licensePlate? : string;

    /**
     * Year
     */
    year?: string;

    /**
     * Description
     */
    description?: string;

}