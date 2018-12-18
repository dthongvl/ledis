import store from '../src/storage/store';
import CmdArgs from '../src/cmd/cmd-args';
import { setAdd, setIntersect, setMembers, setRemove, scard } from '../src/cmd/set';

beforeEach(() => {
    store.set("string", "string");
    store.set("list", ["1", "2", "3"]);
    store.set("set", new Set(["1", "2", "3"]));
    store.set("set2", new Set(["3", "4", "5"]));
    store.set("set3", new Set(["7", "8", "9"]));
});

describe("scard", () => {
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SCARD string");
            expect(() => {
                scard(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SCARD list");
            expect(() => {
                scard(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SCARD");
            expect(() => {
                scard(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SCARD list bar");
            expect(() => {
                scard(cmd);
            }).toThrow();
        }
    });

    test("Should return 0 when key does not exist", () => {
        let cmd = new CmdArgs();
        cmd.parse("SCARD foo");
        expect(scard(cmd)).toBe("0");
    });

    test("Should return set len when everything is okay", () => {
        let cmd = new CmdArgs();
        cmd.parse("SCARD set");
        expect(scard(cmd)).toBe("3");
    });
});

describe("setAdd", () => {
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SADD string string");
            expect(() => {
                setAdd(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SADD list list");
            expect(() => {
                setAdd(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SADD");
            expect(() => {
                setAdd(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SADD set");
            expect(() => {
                setAdd(cmd);
            }).toThrow();
        }
    });

    test("Should return total added items when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("SADD set 3 4 5");
        expect(setAdd(cmd)).toBe("2");
    });
});

describe("setMembers", () => {
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SMEMBERS string string");
            expect(() => {
                setMembers(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SMEMBERS list list");
            expect(() => {
                setMembers(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SMEMBERS");
            expect(() => {
                setMembers(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SMEMBERS set set");
            expect(() => {
                setMembers(cmd);
            }).toThrow();
        }
    });

    test("Should return all items when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("SMEMBERS set");
        expect(setMembers(cmd)).toBe("1,2,3");
    });
});

describe("setRemove", () => {
    test("Should throw Error when get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SREM string 1");
            expect(() => {
                setRemove(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SREM list 1");
            expect(() => {
                setRemove(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SREM");
            expect(() => {
                setRemove(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SREM set");
            expect(() => {
                setRemove(cmd);
            }).toThrow();
        }
    });

    test("Should return total deleted items when everything is ok", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SREM set 1");
            expect(setRemove(cmd)).toBe("1");
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SREM set 4");
            expect(setRemove(cmd)).toBe("0");
        }
    });

    test("Should delete key when set is empty after deleted", () => {
        let cmd = new CmdArgs();
        cmd.parse("SREM set 1 2 3");
        
        expect(store.get("set").size).toBe(3);
        setRemove(cmd);
        expect(store.get("set")).toBeUndefined();
    });
});


describe("setIntersect", () => {
    test("Should throw Error when one or more keys get wrong type", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SINTER string set");
            expect(() => {
                setIntersect(cmd);
            }).toThrow();
        }

        {
            let cmd = new CmdArgs();
            cmd.parse("SINTER list set");
            expect(() => {
                setIntersect(cmd);
            }).toThrow();
        }
    });

    test("Should throw Error when does not satisfy argument", () => {
        {
            let cmd = new CmdArgs();
            cmd.parse("SINTER");
            expect(() => {
                setIntersect(cmd);
            }).toThrow();
        }
    });

    test("Should return empty when one or more keys does not exist", () => {
        let cmd = new CmdArgs();
        cmd.parse("SINTER set notExistingSet");
        expect(setIntersect(cmd)).toBe("");
    });

    test("Should return empty when no intersect", () => {
        let cmd = new CmdArgs();
        cmd.parse("SINTER set set3");
        expect(setIntersect(cmd)).toBe("");
    });

    test("Should return all intersect items when everything is ok", () => {
        let cmd = new CmdArgs();
        cmd.parse("SINTER set set2");
        expect(setIntersect(cmd)).toBe("3");
    });

    test("Should return all items when only have one key", () => {
        let cmd = new CmdArgs();
        cmd.parse("SINTER set");
        expect(setIntersect(cmd)).toBe("1,2,3");
    });
});