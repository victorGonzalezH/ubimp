import { SymbolsTypes } from './symbolsTypes.enum';

export interface ISymbol {

    /** Tipo de simbolo / symbol type */
    type: SymbolsTypes;

    /** Color del simbolo. Ejemplos de posibles valores 'green' (nombre), '#00FF00' (hex value, ) */
    color: string;
}
