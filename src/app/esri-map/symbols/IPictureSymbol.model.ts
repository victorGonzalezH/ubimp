import { ISymbol } from './iSymbol.model';

export interface IPictureSymbol extends ISymbol {

    /**  */
    url: string;

    /** Width en px */
    width: string;

    /** height en px */
    height: string;
}