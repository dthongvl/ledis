import { registerCommand } from '../command';
import { stringify, parse } from '../storage/store';
import CmdArgs from './cmd-args';
import { writeFileSync, readFileSync } from 'fs';

export function save(cmd: CmdArgs): string {
    cmd.requireNothingElse();
    try {
        const data = stringify();
        writeFileSync("dump.ldb", data);
        return "OK";
    } catch (e) {
        return "Cannot save state";
    }
}

export function restore(cmd: CmdArgs): string {
    cmd.requireNothingElse();
    try {
        const content = readFileSync('dump.ldb');
        parse(content.toString('utf8'));
        return "OK";
    } catch (e) {
        return "Cannot restore state";
    }
}

registerCommand('save', save);
registerCommand('restore', restore);