import { registerCommand } from '../commands';

var store: Map<string, string | Array<string> | Set<any>> = new Map();

function hashGet(cmd: string) {
    var cmds = cmd.split(" ");
    var result = store.get(cmds[1]);
    console.log(result);
}

function hashSet(cmd: string) {
    var cmds = cmd.split(" ");
    store.set(cmds[1], cmds[2]);
}

registerCommand("get", hashGet);
registerCommand("set", hashSet);