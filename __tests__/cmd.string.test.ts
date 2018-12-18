import store from '../src/storage/store';
import { stringGet, stringSet } from '../src/cmd/string';
import CmdArgs from '../src/cmd/cmd-args';

beforeEach(() => {
    store.set("string", "string");
    store.set("list", ["1", "2", "3"]);
    store.set("set", new Set(["1", "2", "3"]));
});

describe("stringGet", () => {
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("GET list");
            expect(() => {
                stringGet(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("GET set");
            expect(() => {
                stringGet(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("GET");
            expect(() => {
                stringGet(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("GET string string");
            expect(() => {
                stringGet(cmd);
            }).toThrow();
        }
    });

    test("Should return value when key exist", () => {
        let cmd = new CmdArgs();
        cmd.parse("GET string");
        expect(stringGet(cmd)).toBe("string");
    });

    test("Should return empty string when key does not exist", () => {
        let cmd = new CmdArgs();
        cmd.parse("GET notExistingKey");
        expect(stringGet(cmd)).toBe("");
    });
});

describe("stringSet", () => {
    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SET");
            expect(() => {
                stringSet(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SET string");
            expect(() => {
                stringSet(cmd);
            }).toThrow();
        }
    });

    test("Should map key to value when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("SET string foo");
        expect(stringSet(cmd)).toBe("OK");

        let cmd2 = new CmdArgs;
        cmd2.parse("GET string");
        expect(stringGet(cmd2)).toBe("foo");
    })
});