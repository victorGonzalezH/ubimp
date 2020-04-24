import { ISymbol } from './iSymbol.model';

export interface ISimpleMarkerSymbol extends ISymbol {

    path: string;

    size: number;

    outline: { color: any, width: number };

}
