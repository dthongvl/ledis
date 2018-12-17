import { Response, Request } from "express";

var commandsMap: Map<string, Function> = new Map();

export function registerCommand(commandName: string, callback: Function) {
    if (commandsMap.has(commandName)) {
        console.log("%s has been registered", commandName);
        process.exit(1);
    }
    commandsMap.set(commandName, callback);
    console.log("Registered command:", commandName);
}

export function handleCommand(req: Request, res: Response) {
    const cmdString: string = req.body;
    if (cmdString.length <= 0) {
        res.send("ERROR");
        return;
    }

    const cmdPattern = /^([a-zA-Z]+)( |$)/;
    const result = cmdString.match(cmdPattern);
    if (!result) {
        res.send("ERROR");
        return;
    }
    const cmd = result[1].toLowerCase();
    console.log("Received command:", cmd);
    if (!commandsMap.has(cmd)) {
        res.send("ERROR: Command not found");
        return;
    }
    commandsMap.get(cmd)(cmdString);
    res.send("ahihi");
}