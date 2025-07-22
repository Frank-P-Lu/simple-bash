import { State, CommandResult, CommandHandler } from './types';
import { cdCommand, lsCommand, catCommand } from './commands';

const commands: { [key: string]: CommandHandler } = {
  cd: cdCommand,
  ls: lsCommand,
  cat: catCommand,
};

function parseCommand(line: string): { command: string; args: string[] } {
  const trimmed = line.trim();
  if (!trimmed) {
    return { command: '', args: [] };
  }
  
  // Simple tokenization - split by spaces, but this could be enhanced for quotes, etc.
  const tokens = trimmed.split(/\s+/);
  const command = tokens[0];
  const args = tokens.slice(1);
  
  return { command, args };
}

export function interpret(line: string, state: State): CommandResult {
  const { command, args } = parseCommand(line);
  
  if (!command) {
    return {
      output: '',
      newState: state
    };
  }
  
  const handler = commands[command];
  if (!handler) {
    return {
      output: `${command}: command not found`,
      newState: state
    };
  }
  
  return handler(args, state);
}
