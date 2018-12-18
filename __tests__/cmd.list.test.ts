import store from '../src/storage/store';
import CmdArgs from '../src/cmd/cmd-args';
import { listLen, rightPush, leftPop, rightPop, listRange } from '../src/cmd/list';

beforeEach(() => {
    store.set("string", "string");
    store.set("list", ["1", "2", "3"]);
    store.set("set", new Set(["1", "2", "3"]));
});

describe("listLen", () => {
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LLEN string");
            expect(() => {
                listLen(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LLEN set");
            expect(() => {
                listLen(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LLEN");
            expect(() => {
                listLen(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LLEN list bar");
            expect(() => {
                listLen(cmd);
            }).toThrow();
        }
    });

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
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("RPUSH string string");
            expect(() => {
                rightPush(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("RPUSH set set");
            expect(() => {
                rightPush(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("RPUSH");
            expect(() => {
                rightPush(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("RPUSH list");
            expect(() => {
                rightPush(cmd);
            }).toThrow();
        }
    });

    test("Should return new list len when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("RPUSH list newItem newItem2");
        expect(rightPush(cmd)).toBe("5");
    });
});

describe("leftPop", () => {
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LPOP string");
            expect(() => {
                leftPop(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LPOP set");
            expect(() => {
                leftPop(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LPOP");
            expect(() => {
                leftPop(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LPOP list list");
            expect(() => {
                leftPop(cmd);
            }).toThrow();
        }
    });

    test("Should delete key when list is empty after deleted", () => {
        let cmd = new CmdArgs();
        cmd.parse("LPOP list");

        expect(store.get("list")).toHaveLength(3);

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
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("RPOP string");
            expect(() => {
                rightPop(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("RPOP set");
            expect(() => {
                rightPop(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("RPOP");
            expect(() => {
                rightPop(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("RPOP list list");
            expect(() => {
                rightPop(cmd);
            }).toThrow();
        }
    });

    test("Should delete key when list is empty after deleted", () => {
        let cmd = new CmdArgs();
        cmd.parse("RPOP list");

        expect(store.get("list")).toHaveLength(3);
        
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
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE string 0 2");
            expect(() => {
                listRange(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE set 0 2");
            expect(() => {
                listRange(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE");
            expect(() => {
                listRange(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE list");
            expect(() => {
                listRange(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("LRANGE list 0");
            expect(() => {
                listRange(cmd);
            }).toThrow();
        }
    });

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