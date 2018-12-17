import store, { acquire } from '../storage/store';
import { registerCommand } from '../command';
import CmdArgs from './cmd';

function listLen(cmd: CmdArgs) {
    acquire(cmd.key, 'list');
    const values = store.get(cmd.key);
    return values ? values.length : 0;
}

function rightPush(cmd: CmdArgs) {
    acquire(cmd.key, 'list');
    let current: Array<string> = store.get(cmd.key) || new Array();
    current = current.concat(cmd.values);
    store.set(cmd.key, current);
    return current.length;
}

function leftPop(cmd: CmdArgs) {
    acquire(cmd.key, 'list');
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

function rightPop(cmd: CmdArgs) {
    acquire(cmd.key, 'list');
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

function listRange(cmd: CmdArgs) {
    let start = parseInt(cmd.values[0]);
    let end = parseInt(cmd.values[1]);
    if (start < 0 || end < 0) {
        throw new Error("index out of range");
    }
    acquire(cmd.key, 'list');
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