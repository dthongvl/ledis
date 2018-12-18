import store, { acquire, DataType } from '../src/storage/store';

beforeEach(() => {
    store.set("string", "string");
    store.set("list", ["1", "2", "3"]);
    store.set("set", new Set(["1", "2", "3"]));
});

test("Should throw Error when acquire wrong type", () => {
    expect(() => {
        acquire("list", DataType.STRING);
    }).toThrow();

    expect(() => {
        acquire("list", DataType.SET);
    }).toThrow();

    expect(() => {
        acquire("set", DataType.STRING);
    }).toThrow();

    expect(() => {
        acquire("set", DataType.LIST);
    }).toThrow();

    expect(() => {
        acquire("string", DataType.LIST);
    }).toThrow();

    expect(() => {
        acquire("string", DataType.SET);
    }).toThrow();
});

test("Should not throw Error when acquire correct type", () => {
    expect(() => {
        acquire("string", DataType.STRING);
    }).not.toThrow();

    expect(() => {
        acquire("list", DataType.LIST);
    }).not.toThrow();

    expect(() => {
        acquire("set", DataType.SET);
    }).not.toThrow();
});