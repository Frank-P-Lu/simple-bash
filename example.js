const { interpret, createInitialState, createSampleFileSystem } = require('./dist/index.js');

// Create a sample file system
const fileSystem = createSampleFileSystem();
const initialState = createInitialState(fileSystem);

console.log('=== Simple Bash Clone Demo ===\n');

// Function to execute commands and show results
function runCommand(command, state) {
  console.log(`$ ${command}`);
  const result = interpret(command, state);
  if (result.output) {
    console.log(result.output);
  }
  console.log(`Current directory: ${result.newState.currentDirectory}\n`);
  return result.newState;
}

// Demo sequence
let currentState = initialState;

console.log(`Starting in: ${currentState.currentDirectory}\n`);

// List root directory
currentState = runCommand('ls', currentState);

// Change to docs directory
currentState = runCommand('cd docs', currentState);

// List docs directory
currentState = runCommand('ls', currentState);

// Read readme file
currentState = runCommand('cat readme.md', currentState);

// Go back to root
currentState = runCommand('cd ..', currentState);

// Change to src and list contents
currentState = runCommand('cd src', currentState);
currentState = runCommand('ls', currentState);

// Read main.js
currentState = runCommand('cat main.js', currentState);

// Try some error cases
currentState = runCommand('cd /nonexistent', currentState);
currentState = runCommand('cat /nonexistent.txt', currentState);
currentState = runCommand('unknown_command', currentState);

console.log('Demo complete!');
