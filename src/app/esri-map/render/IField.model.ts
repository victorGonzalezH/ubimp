import { FieldTypes } from './fieldType.enum';

export interface IField {

    /** El nombre para mostrar */
    alias: string;

    /** Nombre del campo */
    name: string;

    /** El tipo de dato del campo */
    fieldType: FieldTypes;

}
