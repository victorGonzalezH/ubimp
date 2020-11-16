export interface Marker {
    latitude: number;
    longitude: number;
    label: string;
    draggable: boolean;
    iconUrl?: string;
    iconWidth?: number;
    iconHeight?: number;
}


export interface Icon {
    url: string;
    scaledSize: {
        width: number;
        height: number;
    };
}
