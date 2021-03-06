import CmdArgs from './cmd-args';
import { registerCommand } from '../command';
import store, { acquire, DataType } from '../storage/store';

export function setAdd(cmd: CmdArgs): string {
    cmd.requireKeyValue();
    acquire(cmd.key, DataType.SET);
    let current: Set<string> = store.get(cmd.key) || new Set();
    let counter: number = 0;
    cmd.values.forEach((value: string) => {
        if (!current.has(value)) {
            current.add(value);
            counter++;
        }
    });
    store.set(cmd.key, current);
    return counter.toString();
}

export function scard(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    acquire(cmd.key, DataType.SET);
    const current: Set<string> = store.get(cmd.key) || new Set();
    return current.size.toString();
}

export function setMembers(cmd: CmdArgs): string {
    cmd.requireKeyOnly();
    acquire(cmd.key, DataType.SET);
    const current: Set<string> = store.get(cmd.key) || new Set();
    return Array.from(current).join(',');
}

export function setRemove(cmd: CmdArgs): string {
    cmd.requireKeyValue();
    acquire(cmd.key, DataType.SET);
    const current: Set<string> = store.get(cmd.key) || new Set();
    let counter: number = 0;
    cmd.values.forEach((value: string) => {
        if (current.has(value)) {
            current.delete(value);
            counter++;
        }
    });
    if (current.size <= 0) {
        store.delete(cmd.key);
    } else {
        store.set(cmd.key, current);
    }
    return counter.toString();
}

export function setIntersect(cmd: CmdArgs): string {
    cmd.requireKey();
    acquire(cmd.key, DataType.SET);
    cmd.values.forEach((value: string) => {
        acquire(value, DataType.SET);
    });
    let current: Set<string> = store.get(cmd.key) || new Set();
    if (current.size <= 0) {
        return "";
    }
    cmd.values.forEach((value: string) => {
        let member: Set<string> = store.get(value) || new Set();
        if (member.size <= 0) {
            current.clear();
            return;
        }
        current = new Set([...current].filter(x => member.has(x)));
    });
    return Array.from(current).join(',');
}

registerCommand('sadd', setAdd);
registerCommand('scard', scard);
registerCommand('smembers', setMembers);
registerCommand('srem', setRemove);
registerCommand('sinter', setIntersect);