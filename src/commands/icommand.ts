export interface ICommand {
  run(args: any): Promise<boolean>;
  runSync(): boolean;
}
