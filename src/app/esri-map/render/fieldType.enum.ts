export enum FieldTypes {

    small_integer,
    integer,
    single,
    double,
    long,
    string,
    date,
    oid,
    geometry,
    blob,
    raster,
    guid,
    global_id,
    xml
}

export class FieldType {
    public static getFieldTypeName(fieldType: FieldTypes): string {
        switch (fieldType) {
            case FieldTypes.small_integer: return 'small-integer';
            case FieldTypes.single: return 'single';
            case FieldTypes.integer: return 'integer';
            case FieldTypes.double: return 'double';
            case FieldTypes.string: return 'string';
            case FieldTypes.date: return 'date';
            case FieldTypes.oid: return 'oid';
            case FieldTypes.geometry: return 'geometry';
            case FieldTypes.blob: return 'blob';
            case FieldTypes.raster: return 'raster';
            case FieldTypes.guid: return 'guid';
            case FieldTypes.xml: return 'xml';
        }
    }
}
