import PassiveExpiringMap from './passive-expiring-map';

var store: PassiveExpiringMap<string, any> = new PassiveExpiringMap();

export enum DataType {
    STRING,
    LIST,
    SET
}

export function acquire(key: string, type: DataType) {
    if (!store.has(key)) {
        return;
    }

    const value = store.get(key);

    switch (type) {
        case DataType.STRING:
            if (typeof(value) == 'string') {
                return;
            }
            break;
        case DataType.LIST:
            if (value instanceof Array) {
                return;
            }
            break;
        case DataType.SET:
            if (value instanceof Set) {
                return;
            }
            break;
    }

    throw new Error("Operation against a key holding the wrong kind of value");
}

export default store;