import CmdArgs from '../src/cmd/cmd-args';

test("Should be success when parse command without quote", () => {
    {
        let cmd = new CmdArgs();
        cmd.parse("GET abc");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse("GET   abc   ");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse("GET   abc def  ");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
        expect(cmd.values).toHaveLength(1);
        expect(cmd.values).toEqual(expect.arrayContaining(['def']))
    }

    {
        let cmd = new CmdArgs();
        cmd.parse("GET   abc def  zxc");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
        expect(cmd.values).toHaveLength(2);
        expect(cmd.values).toEqual(expect.arrayContaining(['def', 'zxc']))
    }

});

test("Should be success when parse command with single quote", () => {
    {
        let cmd = new CmdArgs();
        cmd.parse("GET 'abc'");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse("GET   'abc'   ");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse("GET   'ab c   '   ");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("ab c   ");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse("GET   'ab c   '  'zxc' ");
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("ab c   ");
        expect(cmd.values).toHaveLength(1);
        expect(cmd.values).toEqual(expect.arrayContaining(['zxc']))
    }
});

test("Should be success when parse command with double quote", () => {
    {
        let cmd = new CmdArgs();
        cmd.parse('GET "abc"');
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse('GET   "abc"   ');
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("abc");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse('GET   "ab c   "  ');
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("ab c   ");
    }

    {
        let cmd = new CmdArgs();
        cmd.parse('GET   "ab c   "  "zxc" ');
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe("ab c   ");
        expect(cmd.values).toHaveLength(1);
        expect(cmd.values).toEqual(expect.arrayContaining(['zxc']))
    }

});

test("Should be success when parse command with mixin quote", () => {
    {
        let cmd = new CmdArgs();
        cmd.parse(`GET   'ab"c   '  'zxc' `);
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe('ab"c   ');
        expect(cmd.values).toHaveLength(1);
        expect(cmd.values).toEqual(expect.arrayContaining(['zxc']))
    }

    {
        let cmd = new CmdArgs();
        cmd.parse(`GET   'ab"c   '  "zxc" 123 `);
        expect(cmd.name).toBe("get");
        expect(cmd.key).toBe('ab"c   ');
        expect(cmd.values).toHaveLength(2);
        expect(cmd.values).toEqual(expect.arrayContaining(['zxc', '123']))
    }
});

test("Should throw Error when does not satisfy required", () => {
    {
        let cmd = new CmdArgs();
        cmd.parse(`GET abc abc`);
        expect(() => {
            cmd.requireKeyOnly()
        }).toThrow();
    }

    {
        let cmd = new CmdArgs();
        cmd.parse(`GET abc`);
        expect(() => {
            cmd.requireKeyValue()
        }).toThrow();
    }

    {
        let cmd = new CmdArgs();
        cmd.parse(`GET`);
        expect(() => {
            cmd.requireKey()
        }).toThrow();
        expect(() => {
            cmd.requireKeyValue()
        }).toThrow();
        expect(() => {
            cmd.requireKeyOnly()
        }).toThrow();
    }
});

test("Should not throw Error when satisfy required", () => {
    {
        let cmd = new CmdArgs();
        cmd.parse(`GET abc`);
        expect(() => {
            cmd.requireKey();
        }).not.toThrow();
    }

    {
        let cmd = new CmdArgs();
        cmd.parse(`GET abc def`);
        expect(() => {
            cmd.requireKey();
        }).not.toThrow();
        expect(() => {
            cmd.requireKeyValue();
        }).not.toThrow();
    }

    {
        let cmd = new CmdArgs();
        cmd.parse(`GET abc`);
        expect(() => {
            cmd.requireKey();
        }).not.toThrow();
        expect(() => {
            cmd.requireKeyOnly();
        }).not.toThrow();
    }
})