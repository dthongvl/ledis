import { registerCommand } from '../command';
import store from '../storage/store';
import CmdArgs from './cmd-args';

function save(cmd: CmdArgs) {
    
}

function restore(cmd: CmdArgs) {

}

registerCommand('save', save);
registerCommand('restore', restore);