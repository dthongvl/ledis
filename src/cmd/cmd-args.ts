interface StringToken {
    value: string
    end: number
}

class CmdArgs {
    name: string = "";
    key: string = "";
    values: Array<string> = new Array();

    private getValue(cmd: string): StringToken {
        let isQuote = false;
        let start: number = 0;
        let end: number = 0;
        let key: string = " ";

        while (cmd[start] === ' ' && start < cmd.length) {
            start++;
        }

        isQuote = cmd[start] === "'" || cmd[start] === '"';
        if (isQuote) {
            key = cmd[start];
            start++;
        }
        end = start;

        while (cmd[end] !== key && end < cmd.length) {
            end++;
        }

        if (isQuote) {
            if (end <= cmd.length) {
                if (cmd[end + 1] && cmd[end + 1] != " ") {
                    throw new Error("Invalid argument(s)");
                }
            }
        }

        return {
            value: cmd.substring(start, end),
            end: end + (isQuote ? 1 : 0)
        }
    }

    parse(cmd: string): void {
        cmd = cmd.trim();
        const firstSpaceIndex: number = cmd.indexOf(" ");
        if (firstSpaceIndex === -1) {
            this.name = cmd.toLowerCase();
        } else {
            this.name = cmd.substring(0, firstSpaceIndex).toLowerCase();
            cmd = cmd.substring(firstSpaceIndex + 1, cmd.length);
            let stringToken = this.getValue(cmd);
            this.key = stringToken.value;
            cmd = cmd.substring(stringToken.end, cmd.length);
            while (cmd.length > 0) {
                stringToken = this.getValue(cmd);
                if (stringToken.value.length > 0) {
                    this.values.push(stringToken.value);
                    cmd = cmd.substring(stringToken.end, cmd.length);
                } else {
                    break;
                }
            }
        }
    }

    requireNothingElse() {
        if (this.key !== "" || this.values.length > 0) {
            throw new Error(`wrong number of arguments for '${this.name}' command`);
        }
    }

    requireKey() {
        if (this.key === "") {
            throw new Error(`wrong number of arguments for '${this.name}' command`);
        }
    }

    requireKeyOnly() {
        if (this.key === "" || this.values.length > 0) {
            throw new Error(`wrong number of arguments for '${this.name}' command`);
        }
    }

    requireKeyValue() {
        if (this.key === "" || this.values.length <= 0) {
            throw new Error(`wrong number of arguments for '${this.name}' command`);
        }
    }

    print() {
        console.log({
            name: this.name,
            key: this.key,
            values: this.values
        })
    }
}

export default CmdArgs;