import PassiveExpiringMap from './passiveExpiringMap';

var store: PassiveExpiringMap<string, any> = new PassiveExpiringMap();

export function acquire(key: string, type: string) {
    if (!store.has(key)) {
        return;
    }

    const value = store.get(key);

    switch (type) {
        case 'string':
            return;
        case 'list':
            if (value instanceof Array) {
                return;
            }
            break;
        case 'set':
            if (value instanceof Set) {
                return;
            }
            break;
    }

    throw new Error("Operation against a key holding the wrong kind of value");
}

export default store;