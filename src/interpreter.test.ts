import { interpret } from './interpreter';
import { createInitialState, createSampleFileSystem } from './helpers';

describe('Shell Interpreter', () => {
  const fileSystem = createSampleFileSystem();
  const initialState = createInitialState(fileSystem);

  describe('empty commands', () => {
    it('should handle empty line', () => {
      const result = interpret('', initialState);
      expect(result.output).toBe('');
      expect(result.newState).toEqual(initialState);
    });

    it('should handle whitespace-only line', () => {
      const result = interpret('   ', initialState);
      expect(result.output).toBe('');
      expect(result.newState).toEqual(initialState);
    });
  });

  describe('unknown commands', () => {
    it('should return command not found', () => {
      const result = interpret('unknown', initialState);
      expect(result.output).toBe('unknown: command not found');
      expect(result.newState).toEqual(initialState);
    });
  });

  describe('ls command', () => {
    it('should list root directory contents', () => {
      const result = interpret('ls', initialState);
      expect(result.output).toBe('docs\nhello.txt\nsrc');
      expect(result.newState).toEqual(initialState);
    });

    it('should list specific directory contents', () => {
      const result = interpret('ls /docs', initialState);
      expect(result.output).toBe('guide.txt\nreadme.md');
    });

    it('should show file name when ls on a file', () => {
      const result = interpret('ls /hello.txt', initialState);
      expect(result.output).toBe('hello.txt');
    });

    it('should handle non-existent path', () => {
      const result = interpret('ls /nonexistent', initialState);
      expect(result.output).toBe('ls: /nonexistent: No such file or directory');
    });

    it('should reject too many arguments', () => {
      const result = interpret('ls /docs /src', initialState);
      expect(result.output).toBe('ls: too many arguments');
    });
  });

  describe('cd command', () => {
    it('should change to root with no arguments', () => {
      const state = { ...initialState, currentDirectory: '/docs' };
      const result = interpret('cd', state);
      expect(result.output).toBe('');
      expect(result.newState.currentDirectory).toBe('/');
    });

    it('should change to absolute directory', () => {
      const result = interpret('cd /docs', initialState);
      expect(result.output).toBe('');
      expect(result.newState.currentDirectory).toBe('/docs');
    });

    it('should change to relative directory', () => {
      const state = { ...initialState, currentDirectory: '/' };
      const result = interpret('cd docs', state);
      expect(result.output).toBe('');
      expect(result.newState.currentDirectory).toBe('/docs');
    });

    it('should handle .. (parent directory)', () => {
      const state = { ...initialState, currentDirectory: '/docs' };
      const result = interpret('cd ..', state);
      expect(result.output).toBe('');
      expect(result.newState.currentDirectory).toBe('/');
    });

    it('should handle . (current directory)', () => {
      const state = { ...initialState, currentDirectory: '/docs' };
      const result = interpret('cd .', state);
      expect(result.output).toBe('');
      expect(result.newState.currentDirectory).toBe('/docs');
    });

    it('should reject non-existent directory', () => {
      const result = interpret('cd /nonexistent', initialState);
      expect(result.output).toBe('cd: /nonexistent: No such file or directory');
      expect(result.newState).toEqual(initialState);
    });

    it('should reject changing to a file', () => {
      const result = interpret('cd /hello.txt', initialState);
      expect(result.output).toBe('cd: /hello.txt: Not a directory');
      expect(result.newState).toEqual(initialState);
    });

    it('should reject too many arguments', () => {
      const result = interpret('cd /docs /src', initialState);
      expect(result.output).toBe('cd: too many arguments');
    });
  });

  describe('cat command', () => {
    it('should display file contents', () => {
      const result = interpret('cat /hello.txt', initialState);
      expect(result.output).toBe('Hello, world!');
      expect(result.newState).toEqual(initialState);
    });

    it('should work with relative paths', () => {
      const state = { ...initialState, currentDirectory: '/docs' };
      const result = interpret('cat readme.md', state);
      expect(result.output).toBe('# Documentation\n\nThis is a sample file.');
    });

    it('should reject directories', () => {
      const result = interpret('cat /docs', initialState);
      expect(result.output).toBe('cat: /docs: Is a directory');
    });

    it('should reject non-existent files', () => {
      const result = interpret('cat /nonexistent.txt', initialState);
      expect(result.output).toBe('cat: /nonexistent.txt: No such file or directory');
    });

    it('should require file operand', () => {
      const result = interpret('cat', initialState);
      expect(result.output).toBe('cat: missing file operand');
    });

    it('should reject too many arguments', () => {
      const result = interpret('cat /hello.txt /docs/readme.md', initialState);
      expect(result.output).toBe('cat: too many arguments');
    });
  });

  describe('integration tests', () => {
    it('should maintain state across commands', () => {
      let state = initialState;
      
      // Change directory
      let result = interpret('cd /docs', state);
      expect(result.newState.currentDirectory).toBe('/docs');
      state = result.newState;
      
      // List current directory
      result = interpret('ls', state);
      expect(result.output).toBe('guide.txt\nreadme.md');
      state = result.newState;
      
      // Read file in current directory
      result = interpret('cat readme.md', state);
      expect(result.output).toBe('# Documentation\n\nThis is a sample file.');
    });

    it('should handle complex path navigation', () => {
      let state = initialState;
      
      // Go to src
      let result = interpret('cd src', state);
      expect(result.newState.currentDirectory).toBe('/src');
      state = result.newState;
      
      // Go back to parent and then to docs
      result = interpret('cd ../docs', state);
      expect(result.newState.currentDirectory).toBe('/docs');
      state = result.newState;
      
      // Verify we're in the right place
      result = interpret('ls', state);
      expect(result.output).toBe('guide.txt\nreadme.md');
    });
  });
});
