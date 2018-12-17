import { registerCommand } from '../command';
import store from '../storage/store';
import CmdArgs from './cmd';

function save(cmd: CmdArgs) {

}

function restore(cmd: CmdArgs) {

}

registerCommand('save', save);
registerCommand('restorage', restore);