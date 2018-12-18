import store, { acquire, DataType } from '../storage/store';
import { registerCommand } from '../command';
import CmdArgs from './cmd-args';

export function listLen(cmd: CmdArgs) {
    cmd.requireKeyOnly();
    acquire(cmd.key, DataType.LIST);
    const values = store.get(cmd.key);
    return values ? values.length : 0;
}

export function rightPush(cmd: CmdArgs) {
    cmd.requireKeyValue();
    acquire(cmd.key, DataType.LIST);
    let current: Array<string> = store.get(cmd.key) || new Array();
    current = current.concat(cmd.values);
    store.set(cmd.key, current);
    return current.length;
}

export function leftPop(cmd: CmdArgs) {
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

export function rightPop(cmd: CmdArgs) {
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

export function listRange(cmd: CmdArgs) {
    cmd.requireKeyValue();
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
    return current.slice(start, end + 1);
}

registerCommand('llen', listLen);
registerCommand('rpush', rightPush);
registerCommand('rpop', rightPop);
registerCommand('lpop', leftPop);
registerCommand('lrange', listRange);