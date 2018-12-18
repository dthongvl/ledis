import { Response, Request } from "express";
import CmdArgs from './cmd/cmd-args';

var commandsMap: Map<string, (cmd: CmdArgs) => string> = new Map();

export function registerCommand(commandName: string, callback: (cmd: CmdArgs) => string): void {
    commandName = commandName.toLowerCase();
    if (commandsMap.has(commandName)) {
        console.log("%s has been registered", commandName);
        process.exit(1);
    }
    commandsMap.set(commandName, callback);
    console.log("Registered command:", commandName);
}

export function handleCommand(req: Request, res: Response): void {
    const cmdString: string = req.body;
    if (cmdString.length <= 0) {
        res.send("ERROR: empty command");
        return;
    }

    try {
        const cmdArgs = new CmdArgs();
        cmdArgs.parse(cmdString);
        cmdArgs.print();
        if (!commandsMap.has(cmdArgs.name)) {
            throw new Error(`unknown command ${cmdArgs.name}`);
        }
        let response = commandsMap.get(cmdArgs.name)(cmdArgs);
        res.send(response);
    } catch (e) {
        if (e instanceof Error) {
            res.send("ERROR: " + e.message);
        }
    }
}