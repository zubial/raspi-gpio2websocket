import {ICommand} from "./icommand";

export class TestCommand implements ICommand {

    args: any;

    constructor() {

    }

    async run(args: any): Promise<boolean> {
        this.args = args;

        console.log('Test');

        return false;
    }
}