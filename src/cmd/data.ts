import store from '../storage/store';
import { registerCommand } from '../command';
import CmdArgs from './cmd';

function listKeys(cmd: CmdArgs) {
    return Array.from(store.keys());
}

function deleteKey(cmd: CmdArgs) {
    return store.delete(cmd.key) ? 1 : 0;
}

function flushDb(cmd: CmdArgs) {
    store.clear();
    return '';
}

function expire(cmd: CmdArgs) {
    const seconds = parseInt(cmd.values[0]);
    return store.setTTL(cmd.key, seconds) ? 1 : 0;
}

function ttl(cmd: CmdArgs) {
    return store.getTTL(cmd.key);
}

registerCommand('keys', listKeys);
registerCommand('del', deleteKey);
registerCommand('flushdb', flushDb);
registerCommand('expire', expire);
registerCommand('ttl', ttl);