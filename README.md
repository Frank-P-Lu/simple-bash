# Simple Bash Clone

A functional TypeScript library that simulates basic bash commands with an in-memory file system. Perfect for building interactive terminals, educational tools, or testing environments.

## Features

- **Functional Design**: Pure functions with immutable state
- **In-Memory File System**: No actual file operations - uses object mapping
- **Basic Commands**: `cd`, `ls`, `cat` with no flags (keeping it simple)
- **Browser & Node.js Compatible**: Works in both environments
- **TypeScript**: Full type safety and excellent IDE support

## Installation

```bash
npm install simple-bash-clone
```

## Quick Start

```typescript
import { interpret, createInitialState, createSampleFileSystem } from 'simple-bash-clone';

// Create a file system
const fileSystem = createSampleFileSystem();
const initialState = createInitialState(fileSystem);

// Execute commands
let state = initialState;
const result = interpret('ls', state);
console.log(result.output); // "docs\nhello.txt\nsrc"
state = result.newState;

// Chain commands
const cdResult = interpret('cd docs', state);
const lsResult = interpret('ls', cdResult.newState);
console.log(lsResult.output); // "guide.txt\nreadme.md"
```

## API Reference

### Core Function

#### `interpret(line: string, state: State): CommandResult`

Executes a command line and returns the output and new state.

- **`line`**: The command to execute (e.g., "ls", "cd docs", "cat file.txt")
- **`state`**: Current shell state
- **Returns**: `{ output: string, newState: State }`

### State Management

#### `createInitialState(fileSystem?: FileSystem, currentDirectory?: string): State`

Creates an initial shell state.

- **`fileSystem`**: Object mapping file paths to contents (default: empty)
- **`currentDirectory`**: Starting directory (default: "/")

#### `createFileSystem(files?: { [path: string]: string }): FileSystem`

Creates a file system object.

#### `createSampleFileSystem(): FileSystem`

Creates a sample file system with example files for testing/demos.

### Types

```typescript
interface FileSystem {
  [path: string]: string;
}

interface State {
  currentDirectory: string;
  fileSystem: FileSystem;
}

interface CommandResult {
  output: string;
  newState: State;
}
```

## Supported Commands

### `ls [path]`

Lists directory contents.

```typescript
interpret('ls', state);        // List current directory
interpret('ls /docs', state);  // List specific directory
interpret('ls file.txt', state); // Show filename if it's a file
```

### `cd [path]`

Changes current directory.

```typescript
interpret('cd', state);           // Go to root
interpret('cd /docs', state);     // Absolute path
interpret('cd docs', state);      // Relative path
interpret('cd ..', state);        // Parent directory
interpret('cd .', state);         // Current directory
```

### `cat <file>`

Displays file contents.

```typescript
interpret('cat file.txt', state);      // Absolute path
interpret('cat ./docs/readme.md', state); // Relative path
```

## Examples

### Custom File System

```typescript
import { interpret, createInitialState, createFileSystem } from 'simple-bash-clone';

const fileSystem = createFileSystem({
  '/config.json': JSON.stringify({ version: '1.0' }, null, 2),
  '/src/app.ts': 'console.log("Hello, TypeScript!");',
  '/docs/README.md': '# My Project\n\nDescription here.'
});

const state = createInitialState(fileSystem);
const result = interpret('cat /config.json', state);
console.log(result.output);
// {
//   "version": "1.0"
// }
```

### Interactive Session Simulation

```typescript
function runSession(commands: string[]) {
  let state = createInitialState(createSampleFileSystem());
  
  for (const command of commands) {
    console.log(`$ ${command}`);
    const result = interpret(command, state);
    if (result.output) console.log(result.output);
    state = result.newState;
  }
}

runSession([
  'ls',
  'cd docs',
  'ls',
  'cat readme.md'
]);
```

### Error Handling

Commands return descriptive error messages:

```typescript
interpret('cd /nonexistent', state);
// { output: "cd: /nonexistent: No such file or directory", newState }

interpret('cat /docs', state);
// { output: "cat: /docs: Is a directory", newState }

interpret('unknown', state);
// { output: "unknown: command not found", newState }
```

## Design Principles

- **Functional**: All operations return new state instead of mutating existing state
- **Predictable**: Same input always produces same output
- **Simple**: No flags, options, or complex features - just the basics
- **Testable**: Pure functions make testing straightforward

## Browser Usage

Works perfectly in browser environments:

```html
<script type="module">
  import { interpret, createInitialState, createSampleFileSystem } from './dist/index.js';
  
  const state = createInitialState(createSampleFileSystem());
  const result = interpret('ls', state);
  document.getElementById('output').textContent = result.output;
</script>
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT