import store from '../src/storage/store';
import CmdArgs from '../src/cmd/cmd-args';
import { listLen, rightPush, leftPop, rightPop, listRange } from '../src/cmd/list';

beforeEach(() => {
    store.set("string", "string");
    store.set("list", ["1", "2", "3"]);
    store.set("set", new Set(["1", "2", "3"]));
});

describe("listLen", () => {
    test("Should return 0 when key does not exist", () => {
        let cmd = new CmdArgs();
        cmd.parse("LLEN foo");
        expect(listLen(cmd)).toBe("0");
    });

    test("Should return list len when everything is okay", () => {
        let cmd = new CmdArgs();
        cmd.parse("LLEN list");
        expect(listLen(cmd)).toBe("3");
    });
});

describe("rightPush", () => {
    test("Should return new list len when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("RPUSH list newItem newItem2");
        expect(rightPush(cmd)).toBe("5");
    });
});

describe("leftPop", () => {
    test("Should delete key when list is empty after deleted", () => {
        let cmd = new CmdArgs();
        cmd.parse("LPOP list");
        leftPop(cmd);
        leftPop(cmd);
        leftPop(cmd);

        expect(store.get("list")).toBeUndefined();
    });

    test("Should return deleted item when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("LPOP list");

        let cmd2 = new CmdArgs();
        cmd2.parse("LLEN list");
        expect(listLen(cmd2)).toBe("3");
        expect(leftPop(cmd)).toBe("1");
        expect(listLen(cmd2)).toBe("2");
    });
});

describe("rightPop", () => {
    test("Should delete key when list is empty after deleted", () => {
        let cmd = new CmdArgs();
        cmd.parse("RPOP list");
        rightPop(cmd);
        rightPop(cmd);
        rightPop(cmd);

        expect(store.get("list")).toBeUndefined();
    });

    test("Should return deleted item when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("RPOP list");

        let cmd2 = new CmdArgs();
        cmd2.parse("LLEN list");
        expect(listLen(cmd2)).toBe("3");
        expect(rightPop(cmd)).toBe("3");
        expect(listLen(cmd2)).toBe("2");
    });
});

describe("listRange", () => {
    test("Should throw Error when start or end is negative", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE list -1 2");
            expect(() => {
                listRange(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE list 1 -2");
            expect(() => {
                listRange(cmd);
            }).toThrow();
        }
    });

    test("Should return message when key does not exist", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE foo 0 2");
            expect(listRange(cmd)).toBe("empty list or set");
        }
    });

    test("Should return list items in range when everything is ok", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE list 0 2");
            expect(listRange(cmd)).toBe("1,2,3");
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE list 0 10");
            expect(listRange(cmd)).toBe("1,2,3");
        }
    });
});