import { State, CommandResult, CommandHandler } from './types';
import { resolvePath, pathExists, isDirectory, getDirectoryContents } from './utils';

export const cdCommand: CommandHandler = (args: string[], state: State): CommandResult => {
  if (args.length === 0) {
    // cd with no args goes to root
    return {
      output: '',
      newState: { ...state, currentDirectory: '/' }
    };
  }
  
  if (args.length > 1) {
    return {
      output: 'cd: too many arguments',
      newState: state
    };
  }
  
  const targetPath = resolvePath(state.currentDirectory, args[0]);
  
  if (!pathExists(targetPath, state.fileSystem)) {
    return {
      output: `cd: ${args[0]}: No such file or directory`,
      newState: state
    };
  }
  
  if (!isDirectory(targetPath, state.fileSystem)) {
    return {
      output: `cd: ${args[0]}: Not a directory`,
      newState: state
    };
  }
  
  return {
    output: '',
    newState: { ...state, currentDirectory: targetPath }
  };
};

export const lsCommand: CommandHandler = (args: string[], state: State): CommandResult => {
  let targetPath = state.currentDirectory;
  
  if (args.length === 1) {
    targetPath = resolvePath(state.currentDirectory, args[0]);
  } else if (args.length > 1) {
    return {
      output: 'ls: too many arguments',
      newState: state
    };
  }
  
  if (!pathExists(targetPath, state.fileSystem)) {
    return {
      output: `ls: ${args[0] || targetPath}: No such file or directory`,
      newState: state
    };
  }
  
  if (!isDirectory(targetPath, state.fileSystem)) {
    // If it's a file, just show the filename
    const fileName = targetPath.split('/').pop() || targetPath;
    return {
      output: fileName,
      newState: state
    };
  }
  
  const contents = getDirectoryContents(targetPath, state.fileSystem);
  return {
    output: contents.join('\n'),
    newState: state
  };
};

export const catCommand: CommandHandler = (args: string[], state: State): CommandResult => {
  if (args.length === 0) {
    return {
      output: 'cat: missing file operand',
      newState: state
    };
  }
  
  if (args.length > 1) {
    return {
      output: 'cat: too many arguments',
      newState: state
    };
  }
  
  const targetPath = resolvePath(state.currentDirectory, args[0]);
  
  if (!pathExists(targetPath, state.fileSystem)) {
    return {
      output: `cat: ${args[0]}: No such file or directory`,
      newState: state
    };
  }
  
  if (isDirectory(targetPath, state.fileSystem)) {
    return {
      output: `cat: ${args[0]}: Is a directory`,
      newState: state
    };
  }
  
  const content = state.fileSystem[targetPath];
  return {
    output: content || '',
    newState: state
  };
};
