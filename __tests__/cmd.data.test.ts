import store from '../src/storage/store';
import { flushDb, listKeys, deleteKey, expire, ttl } from '../src/cmd/data';
import { stringGet } from '../src/cmd/string';
import { advanceBy, clear, advanceTo } from 'jest-date-mock';
import CmdArgs from '../src/cmd/cmd-args';

beforeEach(() => {
    store.set("string", "string");
    store.set("list", ["1", "2", "3"]);
    store.set("set", new Set(["1", "2", "3"]));
});

describe("listKey", () => {
    test("Should throw Error when does not satisfy argument", () => {
        let cmd = new CmdArgs();
        cmd.parse("KEYS foo");
        expect(() => {
            flushDb(cmd);
        }).toThrow();
    });

    test("Should list all key when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("KEYS");
        const result = listKeys(cmd);
        expect(result).toContain("string");
        expect(result).toContain("list");
        expect(result).toContain("set");
    });
});

describe("deleteKey", () => {
    test("Should throw Error when does not satisfy argument", () => {
        let cmd = new CmdArgs();
        cmd.parse("DEL");
        expect(() => {
            deleteKey(cmd);
        }).toThrow();
    });

    test("Should return 0 when key does not exist", () => {
        let cmd = new CmdArgs();
        cmd.parse("DEL foo");
        expect(store.size()).toBe(3);
        expect(deleteKey(cmd)).toBe("0");
        expect(store.size()).toBe(3);
    });

    test("Should return 1 and delete key when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("DEL string");
        expect(store.size()).toBe(3);
        expect(deleteKey(cmd)).toBe("1");
        expect(store.size()).toBe(2);
    });
});

describe("flushDb", () => {
    test("Should throw Error when does not satisfy argument", () => {
        let cmd = new CmdArgs();
        cmd.parse("FLUSHDB foo");
        expect(() => {
            flushDb(cmd);
        }).toThrow();
    });

    test("Should clear all key when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("FLUSHDB");
        expect(store.size()).toBe(3);
        flushDb(cmd);
        expect(store.size()).toBe(0);
    });
});

describe("expire", () => {
    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("EXPIRE");
            expect(() => {
                expire(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("EXPIRE string");
            expect(() => {
                expire(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("EXPIRE string 10 10");
            expect(() => {
                expire(cmd);
            }).toThrow();
        }
    });

    test("Should return 0 when key does not exist", () => {
        let cmd = new CmdArgs();
        cmd.parse("EXPIRE foo 10");
        expect(expire(cmd)).toBe("0");
    });

    test("Should return seconds and set expire when everything is okay", () => {
        let cmd = new CmdArgs();
        cmd.parse("EXPIRE string 10");
        expect(expire(cmd)).toBe("10");

        let cmd2 = new CmdArgs();
        cmd2.parse("TTL string");
        expect(parseInt(ttl(cmd2))).toBeGreaterThan(0);
        expect(parseInt(ttl(cmd2))).toBeLessThanOrEqual(10);
    });

    test("Should be deleted when timeout", () => {
        advanceTo(Date.now());
        let cmd = new CmdArgs();
        cmd.parse("EXPIRE string 10");
        expire(cmd);

        advanceBy(11000);
        let cmd2 = new CmdArgs();
        cmd2.parse("GET string");
        expect(stringGet(cmd2)).toBe("");

        clear();
    });
});

describe("ttl", () => {
    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("TTL");
            expect(() => {
                ttl(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("TTL string string");
            expect(() => {
                ttl(cmd);
            }).toThrow();
        }
    });

    test("Should return < 0 code when get time to live on not existing key or is not set", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("TTL notExistingKey");
            expect(ttl(cmd)).toBe("-2");
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("TTL string");
            expect(ttl(cmd)).toBe("-1");
        }
    });

    test("Should return seconds when everything is okay", () => {
        let cmd = new CmdArgs();
        cmd.parse("EXPIRE string 10");
        expire(cmd);

        let cmd2 = new CmdArgs();
        cmd2.parse("TTL string");
        expect(parseInt(ttl(cmd2))).toBeLessThanOrEqual(10);
    })
});