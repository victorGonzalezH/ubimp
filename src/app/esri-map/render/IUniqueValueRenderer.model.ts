import { IUniqueValueInfo } from './IUniqueValueInfo.model';

export interface IUniqueValueRenderer {

    /** Nombre de la propiedad que define que simbolo de se usara */
    field: string;

    /** Valors que puede tener la propiedad field y el simbolo que se usara en el mapa cuando el objeto tenga ese valor */
    uniqueValuesInfos: IUniqueValueInfo[];
}
