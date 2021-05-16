#!/usr/bin/env node
'use strict';
import {ArgumentParser} from "argparse";
import {ICommand} from "./commands/icommand";
import {TestCommand} from "./commands/test-command";

// Arguments
const argsParser = new ArgumentParser({
    description: 'Raspberry GPIO Mapping to WebSocket'
});
const subParser = argsParser.add_subparsers({dest: 'command', help:'', metavar: ''});

// Commands - Test
const testArgs = subParser.add_parser('test', {description: 'Test command',
    help: 'Test command'})
testArgs.add_argument('-v', '--verbose', { help: 'Show debug messages', action:"store_true"});

const args = argsParser.parse_args();


////////////////////////////////////////////////
// Console management
////////////////////////////////////////////////
const verbose:boolean = args.verbose;
console.debug = function() {
    if(!verbose) return;
    // @ts-ignore
    console.log.apply(console, arguments);
};


////////////////////////////////////////////////
// Main command
////////////////////////////////////////////////
let command:ICommand;
switch (args.command) {
    case 'test': {
        command = new TestCommand();
        break;
    }
}

// Run command
console.debug('Command : ', args.command);
console.debug('Arguments : ', args);
if (command !== undefined) {
    command.run(args);
} else {
    console.error('Command is not implemented !');
}