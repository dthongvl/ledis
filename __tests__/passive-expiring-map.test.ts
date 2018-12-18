import PassiveExpiringMap from '../src/storage/passive-expiring-map';
import { advanceBy, clear, advanceTo } from 'jest-date-mock';

var map: PassiveExpiringMap<String, any>;

beforeEach(() => {
    map = new PassiveExpiringMap();
    map.set("key", "value");
    map.set("key2", "value2");
})

test("Passive expiring map base feature should work", () => {
    expect(map.size()).toBe(2);
    expect(Array.from(map.keys())).toEqual(expect.arrayContaining(['key', 'key2']));

    expect(map.get("key")).toBe("value");
    expect(map.get("notExistingKey")).toBeUndefined();

    expect(map.has("key")).toBe(true);
    expect(map.has("notExistingKey")).toBe(false);

    expect(map.delete("notExistingKey")).toBe(false);
    expect(map.delete("key")).toBe(true);
    expect(map.size()).toBe(1);

    map.clear();
    expect(map.get("key2")).toBeUndefined();
    expect(map.size()).toBe(0);
});

test("Should return < 0 code when get time to live on not existing key or is not set", () => {
    expect(map.getTTL("key")).toBe(-1);
    expect(map.getTTL("notExistingKey")).toBe(-2);
});

test("Should return seconds when get time to live on key that is set", () => {
    expect(map.setTTL("notExistingKey", 10)).toBe(false);
    expect(map.setTTL("key", 10)).toBe(true);
    expect(map.getTTL("key")).toBeLessThanOrEqual(10);   
})

test("Key should be deleted when timeout", () => {
    advanceTo(Date.now());
    map.setTTL("key2", 5);

    advanceBy(2000);
    expect(map.get("key2")).toBe("value2");

    advanceBy(6000);
    expect(map.get("key2")).toBeUndefined();

    clear();
});