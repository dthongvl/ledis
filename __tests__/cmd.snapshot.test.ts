import { save, restore } from '../src/cmd/snapshot';
import { deleteKey } from '../src/cmd/data';
import CmdArgs from '../src/cmd/cmd-args';
import store from '../src/storage/store';

beforeEach(() => {
    store.set("string", "string");
    store.set("list", ["1", "2", "3"]);
    store.set("set", new Set(["1", "2", "3"]));
});

test("Should success when everything is ok", () => {
    expect(store.size()).toBe(3);
    let saveCmd = new CmdArgs();
    saveCmd.parse("SAVE");
    save(saveCmd);
    
    let deleteCmd = new CmdArgs();
    deleteCmd.parse("DEL list");
    deleteKey(deleteCmd);
    expect(store.size()).toBe(2);

    let restoreCmd = new CmdArgs();
    restoreCmd.parse("RESTORE");
    restore(restoreCmd);

    expect(store.size()).toBe(3);
});