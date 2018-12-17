import { registerCommand } from '../command';
import store, { acquire } from '../storage/store';
import CmdArgs from './cmd';

function stringGet(cmd: CmdArgs) {
    cmd.requireKeyOnly();
    const value = store.get(cmd.key);
    if (value && typeof(value) !== 'string') {
        throw new Error("Operation against a key holding the wrong kind of value");
    }
    return value ? value : "";
}

function stringSet(cmd: CmdArgs) {
    cmd.requireKeyValue();
    acquire(cmd.key, 'string');
    store.set(cmd.key, cmd.values[0]);
    return "OK";
}

registerCommand("get", stringGet);
registerCommand("set", stringSet);