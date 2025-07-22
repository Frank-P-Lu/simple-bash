export interface FileSystem {
  [path: string]: string;
}

export interface State {
  currentDirectory: string;
  fileSystem: FileSystem;
}

export interface CommandResult {
  output: string;
  newState: State;
}

export type CommandHandler = (args: string[], state: State) => CommandResult;
