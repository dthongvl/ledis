import PassiveExpiringMap from './passive-expiring-map';

var store: PassiveExpiringMap<string, any> = new PassiveExpiringMap();

export enum DataType {
    STRING = "string",
    LIST = "list",
    SET = "set"
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

export function stringify(): string {
    var result: Array<any> = new Array();
    store.forEach((value: any, key: string) => {
        var ttl = store.getTTL(key);

        var type = DataType.STRING;
        if (value instanceof Array) {
            type = DataType.LIST;
        }
        if (value instanceof Set) {
            type = DataType.SET;
            value = Array.from(value);
        }

        result.push({
            key: key,
            type: type,
            value: value,
            timeout: ttl
        })
    });
    return JSON.stringify({data: result});
}

export function parse(data: string): void {
    const json = JSON.parse(data);
    store.clear();
    json.data.forEach((item: any) => {
        switch (item.type) {
            case DataType.SET:
            store.set(item.key, new Set(item.value));
            break;

            default:
            store.set(item.key, item.value);
        }
        
        if (item.timeout !== -1) {
            store.setTTL(item.key, item.timeout);
        }
    });
}

export default store;