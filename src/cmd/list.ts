import store, { acquire, DataType } from '../storage/store';
import { registerCommand } from '../command';
import CmdArgs from './cmd-args';

export function listLen(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    acquire(cmd.key, DataType.LIST);
    const values = store.get(cmd.key) || new Array();
    return values.length.toString();
}

export function rightPush(cmd: CmdArgs): string {
    cmd.requireKeyValue();
    acquire(cmd.key, DataType.LIST);
    let current: Array<string> = store.get(cmd.key) || new Array();
    current = current.concat(cmd.values);
    store.set(cmd.key, current);
    return current.length.toString();
}

export function leftPop(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    acquire(cmd.key, DataType.LIST);
    let current: Array<string> = store.get(cmd.key);
    if (!current) {
        return '';
    }

    const value = current.shift();
    if (current.length <= 0) {
        store.delete(cmd.key);
    } else {
        store.set(cmd.key, current);
    }
    return value;
}

export function rightPop(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    acquire(cmd.key, DataType.LIST);
    let current: Array<string> = store.get(cmd.key);
    if (!current) {
        return '';
    }

    const value = current.pop();
    if (current.length <= 0) {
        store.delete(cmd.key);
    } else {
        store.set(cmd.key, current);
    }
    return value;
}

export function listRange(cmd: CmdArgs): string {
    cmd.requireKeyValue(2);
    let start = parseInt(cmd.values[0]);
    let end = parseInt(cmd.values[1]);
    if (start < 0 || end < 0) {
        throw new Error("index out of range");
    }
    acquire(cmd.key, DataType.LIST);
    let current: Array<string> = store.get(cmd.key);
    if (!current) {
        return 'empty list or set';
    }

    if (start >= current.length) {
        return '';
    }
    if (end >= current.length) {
        end = current.length;
    }
    return current.slice(start, end + 1).toString();
}

registerCommand('llen', listLen);
registerCommand('rpush', rightPush);
registerCommand('rpop', rightPop);
registerCommand('lpop', leftPop);
registerCommand('lrange', listRange);