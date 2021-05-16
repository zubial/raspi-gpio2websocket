#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var argparse_1 = require("argparse");
var test_command_1 = require("./commands/test-command");
// Arguments
var argsParser = new argparse_1.ArgumentParser({
    description: 'Raspberry GPIO Mapping to WebSocket'
});
var subParser = argsParser.add_subparsers({ dest: 'command', help: '', metavar: '' });
// Commands - Test
var testArgs = subParser.add_parser('test', { description: 'Test command',
    help: 'Test command' });
testArgs.add_argument('-v', '--verbose', { help: 'Show debug messages', action: "store_true" });
var args = argsParser.parse_args();
////////////////////////////////////////////////
// Console management
////////////////////////////////////////////////
var verbose = args.verbose;
console.debug = function () {
    if (!verbose)
        return;
    // @ts-ignore
    console.log.apply(console, arguments);
};
////////////////////////////////////////////////
// Main command
////////////////////////////////////////////////
var command;
switch (args.command) {
    case 'test': {
        command = new test_command_1.TestCommand();
        break;
    }
}
// Run command
console.debug('Command : ', args.command);
console.debug('Arguments : ', args);
if (command !== undefined) {
    command.runSync();
    // command.run(args).then(() => {
    //     console.debug('Finished successfully');
    //     process.exit(0);
    // }).catch(e => {
    //     console.error(e);
    //     process.exit(99);
    // });
}
else {
    console.error('Command is not implemented !');
}
