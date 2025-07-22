import { normalizePath, resolvePath, getDirectoryContents, pathExists, isDirectory } from './utils';

describe('Utils', () => {
  describe('normalizePath', () => {
    it('should normalize paths correctly', () => {
      expect(normalizePath('/')).toBe('/');
      expect(normalizePath('/docs')).toBe('/docs');
      expect(normalizePath('/docs/')).toBe('/docs');
      expect(normalizePath('/docs/readme.md')).toBe('/docs/readme.md');
      expect(normalizePath('')).toBe('/');
    });
  });

  describe('resolvePath', () => {
    it('should handle absolute paths', () => {
      expect(resolvePath('/current', '/absolute')).toBe('/absolute');
      expect(resolvePath('/docs', '/src/main.js')).toBe('/src/main.js');
    });

    it('should handle relative paths', () => {
      expect(resolvePath('/', 'docs')).toBe('/docs');
      expect(resolvePath('/docs', 'readme.md')).toBe('/docs/readme.md');
      expect(resolvePath('/docs', 'subdir/file.txt')).toBe('/docs/subdir/file.txt');
    });

    it('should handle . and .. in paths', () => {
      expect(resolvePath('/docs', '.')).toBe('/docs');
      expect(resolvePath('/docs', '..')).toBe('/');
      expect(resolvePath('/docs/subdir', '../readme.md')).toBe('/docs/readme.md');
      expect(resolvePath('/docs', '../src')).toBe('/src');
      expect(resolvePath('/docs', './readme.md')).toBe('/docs/readme.md');
    });

    it('should handle complex paths', () => {
      expect(resolvePath('/docs', '../src/../docs/readme.md')).toBe('/docs/readme.md');
      expect(resolvePath('/', 'docs/../src/main.js')).toBe('/src/main.js');
    });
  });

  describe('getDirectoryContents', () => {
    const fileSystem = {
      '/hello.txt': 'Hello',
      '/docs/readme.md': 'Readme',
      '/docs/guide.txt': 'Guide',
      '/src/main.js': 'Main',
      '/src/utils.js': 'Utils'
    };

    it('should list root directory contents', () => {
      const contents = getDirectoryContents('/', fileSystem);
      expect(contents).toEqual(['docs', 'hello.txt', 'src']);
    });

    it('should list subdirectory contents', () => {
      const contents = getDirectoryContents('/docs', fileSystem);
      expect(contents).toEqual(['guide.txt', 'readme.md']);
    });

    it('should return empty for non-existent directory', () => {
      const contents = getDirectoryContents('/nonexistent', fileSystem);
      expect(contents).toEqual([]);
    });
  });

  describe('pathExists', () => {
    const fileSystem = {
      '/hello.txt': 'Hello',
      '/docs/readme.md': 'Readme'
    };

    it('should return true for existing files', () => {
      expect(pathExists('/hello.txt', fileSystem)).toBe(true);
      expect(pathExists('/docs/readme.md', fileSystem)).toBe(true);
    });

    it('should return true for existing directories', () => {
      expect(pathExists('/', fileSystem)).toBe(true);
      expect(pathExists('/docs', fileSystem)).toBe(true);
    });

    it('should return false for non-existent paths', () => {
      expect(pathExists('/nonexistent.txt', fileSystem)).toBe(false);
      expect(pathExists('/nonexistent', fileSystem)).toBe(false);
    });
  });

  describe('isDirectory', () => {
    const fileSystem = {
      '/hello.txt': 'Hello',
      '/docs/readme.md': 'Readme'
    };

    it('should return true for directories', () => {
      expect(isDirectory('/', fileSystem)).toBe(true);
      expect(isDirectory('/docs', fileSystem)).toBe(true);
    });

    it('should return false for files', () => {
      expect(isDirectory('/hello.txt', fileSystem)).toBe(false);
      expect(isDirectory('/docs/readme.md', fileSystem)).toBe(false);
    });

    it('should return false for non-existent paths', () => {
      expect(isDirectory('/nonexistent', fileSystem)).toBe(false);
    });
  });
});
