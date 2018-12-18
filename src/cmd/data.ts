import store from '../storage/store';
import { registerCommand } from '../command';
import CmdArgs from './cmd-args';

export function listKeys(cmd: CmdArgs): string {
    cmd.requireNothingElse();
    return Array.from(store.keys()).toString();
}

export function deleteKey(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    return store.delete(cmd.key) ? '1' : '0';
}

export function flushDb(cmd: CmdArgs): string {
    cmd.requireNothingElse();
    store.clear();
    return '';
}

export function expire(cmd: CmdArgs): string {
    cmd.requireKeyValue();
    const seconds = parseInt(cmd.values[0]);
    return store.setTTL(cmd.key, seconds) ? '1' : '0';
}

export function ttl(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    return store.getTTL(cmd.key).toString();
}

registerCommand('keys', listKeys);
registerCommand('del', deleteKey);
registerCommand('flushdb', flushDb);
registerCommand('expire', expire);
registerCommand('ttl', ttl);