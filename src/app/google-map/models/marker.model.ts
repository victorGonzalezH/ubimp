export interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    iconUrl?: string;
}

export interface Icon {
    url: string;
    scaledSize: {
        width: number;
        height: number;
    };
}
