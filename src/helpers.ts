import { State, FileSystem } from './types';

export function createFileSystem(files: { [path: string]: string } = {}): FileSystem {
  return { ...files };
}

export function createInitialState(fileSystem: FileSystem = {}, currentDirectory: string = '/'): State {
  return {
    currentDirectory,
    fileSystem
  };
}

export function createSampleFileSystem(): FileSystem {
  return {
    '/hello.txt': 'Hello, world!',
    '/docs/readme.md': '# Documentation\n\nThis is a sample file.',
    '/docs/guide.txt': 'User guide content here.',
    '/src/main.js': 'console.log("Hello from main.js");',
    '/src/utils.js': 'export function helper() { return "help"; }'
  };
}
