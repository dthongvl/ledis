class PassiveExpiringMap<K, V> {

    private store: Map<K, V> = new Map();
    private timeout: Map<K, number> = new Map();

    getTTL = (key: K): number => {
        this.clearExpired(key);

        if (!this.store.has(key)) {
            return -2;
        }

        if (!this.timeout.has(key)) {
            return -1;
        }

        var time = new Date();
        var ttl = new Date(this.timeout.get(key) - time.getTime());
        return ttl.getSeconds();
    }

    setTTL = (key: K, second: number): boolean => {
        if (!this.has(key)) {
            return false;
        }
        var time = new Date();
        this.timeout.set(key, time.getTime() + 1000 * second);
        return true;
    }

    clear = (): void => {
        this.timeout.clear();
        this.store.clear();
    }

    delete = (key: K): boolean => {
        this.timeout.delete(key);
        return this.store.delete(key);
    }

    forEach = (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void => {
        this.clearExpired();
        this.store.forEach(callbackfn, thisArg);
    }

    get = (key: K): V | undefined => {
        this.clearExpired(key);
        return this.store.get(key);
    }

    has = (key: K): boolean => {
        this.clearExpired(key);
        return this.store.has(key);
    }

    set = (key: K, value: V): this => {
        this.store.set(key, value);
        return this;
    }

    size = (): number => {
        this.clearExpired();
        return this.store.size;
    }

    keys = (): IterableIterator<K> => {
        this.clearExpired();
        return this.store.keys();
    }

    private clearExpired = (key?: K): void => {
        if (key && this.timeout.has(key)) {
            var time = new Date();
            if (time.getTime() - this.timeout.get(key) >= 0) {
                this.timeout.delete(key);
                this.store.delete(key);
            }
            return;
        }

        this.timeout.forEach((value: number, key: K) => {
            var time = new Date();
            if (time.getTime() - value >= 0) {
                this.timeout.delete(key);
                this.store.delete(key);
            }
        });
    }
}

export default PassiveExpiringMap;