import { registerCommand } from '../command';
import store from '../storage/store';
import CmdArgs from './cmd-args';

function save(cmd: CmdArgs): string {
    return "";
}

function restore(cmd: CmdArgs): string {
    return "";
}

registerCommand('save', save);
registerCommand('restore', restore);