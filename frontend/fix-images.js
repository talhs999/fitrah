const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const publicAssetsDir = path.join(__dirname, 'public', 'assets');

// Helper to walk directory
function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

// Map to store replacements
const replacements = {};

// Process all files
walk(srcDir, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Regex to find /api/media?path=...
  const regex = /\/api\/media\?path=([^"'\`]+)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[0];
    const encodedPath = match[1];
    let originalPath;
    try {
      originalPath = decodeURIComponent(encodedPath);
    } catch(e) {
      continue;
    }

    if (originalPath.includes('${')) continue; // Skip dynamic templates

    const fileName = path.basename(originalPath);
    let safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    
    // Copy file if exists
    if (fs.existsSync(originalPath)) {
      const destPath = path.join(publicAssetsDir, safeFileName);
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(originalPath, destPath);
        console.log(`Copied ${fileName} to public/assets`);
      }
    } else {
      console.log(`Warning: Local file not found ${originalPath}`);
    }

    // Replace in content
    const newPath = `/assets/${safeFileName}`;
    content = content.replace(fullMatch, newPath);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated paths in ${filePath}`);
  }
});
