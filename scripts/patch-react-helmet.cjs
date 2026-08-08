const fs = require('fs');
const path = require('path');

const filesToPatch = [
  'node_modules/react-helmet-async/lib/index.js',
  'node_modules/react-helmet-async/lib/index.esm.js',
];

for (const file of filesToPatch) {
  const fullPath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Original is tag.parentNode?.removeChild(tag)
    // Or tag.parentNode.removeChild(tag)
    // Replace with safe check
    content = content.replace(/tag\.parentNode\??\.removeChild\(tag\)/g, '(tag.parentNode && tag.parentNode.removeChild(tag))');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Patched', file);
  }
}
