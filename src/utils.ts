export function normalizePath(path: string): string {
  // Remove trailing slashes except for root
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path || '/';
}

export function resolvePath(currentDir: string, targetPath: string): string {
  if (targetPath.startsWith('/')) {
    // Absolute path
    return normalizePath(targetPath);
  }
  
  // Relative path
  const parts = currentDir.split('/').filter(p => p.length > 0);
  const targetParts = targetPath.split('/').filter(p => p.length > 0);
  
  for (const part of targetParts) {
    if (part === '..') {
      parts.pop();
    } else if (part !== '.') {
      parts.push(part);
    }
  }
  
  return normalizePath('/' + parts.join('/'));
}

export function getDirectoryContents(path: string, fileSystem: { [key: string]: string }): string[] {
  const normalizedPath = normalizePath(path);
  const contents: Set<string> = new Set();
  
  for (const filePath of Object.keys(fileSystem)) {
    if (filePath.startsWith(normalizedPath)) {
      const relativePath = filePath.slice(normalizedPath.length);
      if (relativePath.startsWith('/')) {
        const parts = relativePath.slice(1).split('/');
        if (parts.length > 0 && parts[0]) {
          contents.add(parts[0]);
        }
      } else if (normalizedPath === '/' && filePath !== '/') {
        const parts = filePath.slice(1).split('/');
        if (parts.length > 0 && parts[0]) {
          contents.add(parts[0]);
        }
      }
    }
  }
  
  return Array.from(contents).sort();
}

export function pathExists(path: string, fileSystem: { [key: string]: string }): boolean {
  const normalizedPath = normalizePath(path);
  
  // Check if it's a file
  if (fileSystem[normalizedPath] !== undefined) {
    return true;
  }
  
  // Check if it's a directory (has files under it)
  for (const filePath of Object.keys(fileSystem)) {
    if (filePath.startsWith(normalizedPath + '/')) {
      return true;
    }
  }
  
  // Root directory always exists
  return normalizedPath === '/';
}

export function isDirectory(path: string, fileSystem: { [key: string]: string }): boolean {
  const normalizedPath = normalizePath(path);
  
  // If it's explicitly a file, it's not a directory
  if (fileSystem[normalizedPath] !== undefined) {
    return false;
  }
  
  // Check if it has files under it or is root
  if (normalizedPath === '/') {
    return true;
  }
  
  for (const filePath of Object.keys(fileSystem)) {
    if (filePath.startsWith(normalizedPath + '/')) {
      return true;
    }
  }
  
  return false;
}
