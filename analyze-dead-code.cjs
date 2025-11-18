#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = '/home/user/ADAMOWO';
const srcDir = path.join(baseDir, 'src');

// Entry points
const entryPoints = [
  '/home/user/ADAMOWO/src/main.tsx',
  '/home/user/ADAMOWO/index.html',
];

// Funkcja do znalezienia wszystkich plików źródłowych
function findAllSourceFiles() {
  const cmd = `find ${srcDir} -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\) ! -name "*.test.*" ! -name "*.spec.*" ! -name "*.d.ts"`;
  const output = execSync(cmd, { encoding: 'utf8' });
  return output.trim().split('\n').filter(Boolean);
}

// Funkcja do ekstrakcji importów z pliku
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = new Set();

    // Regex dla różnych typów importów
    const patterns = [
      // import ... from '...'
      /import\s+(?:[\w*\s{},]*)\s+from\s+['"]([^'"]+)['"]/g,
      // import('...')
      /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      // require('...')
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      // export ... from '...'
      /export\s+(?:[\w*\s{},]*)\s+from\s+['"]([^'"]+)['"]/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        imports.add(match[1]);
      }
    }

    return Array.from(imports);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Funkcja do rozwiązania ścieżki importu
function resolveImportPath(importPath, fromFile) {
  // Ignoruj importy z node_modules
  if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('@/')) {
    return null;
  }

  let resolvedPath = importPath;

  // Obsługa aliasu @/
  if (importPath.startsWith('@/')) {
    resolvedPath = importPath.replace('@/', srcDir + '/');
  } else if (importPath.startsWith('.')) {
    // Ścieżka relatywna
    const dir = path.dirname(fromFile);
    resolvedPath = path.resolve(dir, importPath);
  } else {
    resolvedPath = path.resolve(baseDir, importPath);
  }

  // Spróbuj różne rozszerzenia
  const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];

  for (const ext of extensions) {
    const fullPath = resolvedPath + ext;
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }
  }

  return null;
}

// Funkcja do budowania grafu importów (BFS)
function buildImportGraph(entryPoints) {
  const visited = new Set();
  const queue = [...entryPoints];
  const graph = new Map();

  while (queue.length > 0) {
    const current = queue.shift();

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    // Dla HTML sprawdź skrypty
    if (current.endsWith('.html')) {
      try {
        const content = fs.readFileSync(current, 'utf8');
        const scriptMatch = content.match(/src=["']([^"']+)["']/);
        if (scriptMatch) {
          const scriptPath = path.resolve(path.dirname(current), scriptMatch[1]);
          if (fs.existsSync(scriptPath)) {
            queue.push(scriptPath);
          }
        }
      } catch (error) {
        console.error(`Error reading HTML ${current}:`, error.message);
      }
      continue;
    }

    // Dla plików źródłowych
    if (!current.endsWith('.ts') && !current.endsWith('.tsx') &&
        !current.endsWith('.js') && !current.endsWith('.jsx')) {
      continue;
    }

    const imports = extractImports(current);
    const resolvedImports = [];

    for (const imp of imports) {
      const resolved = resolveImportPath(imp, current);
      if (resolved && resolved.startsWith(srcDir)) {
        resolvedImports.push(resolved);
        queue.push(resolved);
      }
    }

    graph.set(current, resolvedImports);
  }

  return { visited, graph };
}

// Główna funkcja
function main() {
  console.log('=== DEAD CODE ANALYSIS ===\n');

  // Znajdź wszystkie pliki źródłowe
  console.log('Finding all source files...');
  const allFiles = findAllSourceFiles();
  console.log(`Found ${allFiles.length} source files\n`);

  // Zbuduj graf importów
  console.log('Building import graph from entry points...');
  const { visited, graph } = buildImportGraph(entryPoints);
  console.log(`Reachable files: ${visited.size}\n`);

  // Znajdź nieużywane pliki
  const usedFiles = new Set();
  for (const file of visited) {
    if (file.startsWith(srcDir)) {
      usedFiles.add(file);
    }
  }

  const unusedFiles = allFiles.filter(file => !usedFiles.has(file));

  console.log('=== ENTRY POINTS ===');
  entryPoints.forEach(ep => console.log(`  - ${ep}`));

  console.log('\n=== UNUSED FILES ===');
  console.log(`Count: ${unusedFiles.length}`);
  unusedFiles.forEach(file => {
    const relPath = path.relative(baseDir, file);
    console.log(`  - ${relPath}`);
  });

  // Zapisz wyniki
  const results = {
    summary: {
      total_files: allFiles.length,
      used_files: usedFiles.size,
      unused_files: unusedFiles.length,
      entry_points: entryPoints.length
    },
    entry_points: entryPoints,
    unused_files: unusedFiles.map(f => path.relative(baseDir, f)),
    used_files: Array.from(usedFiles).map(f => path.relative(baseDir, f))
  };

  fs.writeFileSync(
    path.join(baseDir, 'dead-code-analysis-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n=== SUMMARY ===');
  console.log(`Total source files: ${allFiles.length}`);
  console.log(`Used files: ${usedFiles.size}`);
  console.log(`Unused files: ${unusedFiles.length} (${(unusedFiles.length / allFiles.length * 100).toFixed(1)}%)`);
  console.log('\nResults saved to: dead-code-analysis-results.json');
}

main();
