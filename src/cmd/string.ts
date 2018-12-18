import { registerCommand } from '../command';
import store, { acquire, DataType } from '../storage/store';
import CmdArgs from './cmd-args';

export function stringGet(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    acquire(cmd.key, DataType.STRING);
    const value = store.get(cmd.key);
    return value ? value : "";
}

export function stringSet(cmd: CmdArgs): string {
    cmd.requireKeyValue();
    store.set(cmd.key, cmd.values[0]);
    return "OK";
}

registerCommand("get", stringGet);
registerCommand("set", stringSet);