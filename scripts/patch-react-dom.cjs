const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..', 'node_modules', 'react-dom', 'cjs');
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // First safely replace all occurrences of something.parentNode.removeChild(something)
    content = content.replace(/([a-zA-Z0-9_$]+)\.parentNode\.removeChild\(\1\)/g, '($1.parentNode && $1.parentNode.removeChild($1))');
    
    // Then replace any other .removeChild calls where the caller is an identifier
    // We match `parentInstance.removeChild(node)` 
    // We must ensure there is no dot immediately before the identifier, to avoid matching `foo.bar.removeChild` and capturing `bar`
    content = content.replace(/(?<!\.)\b([a-zA-Z0-9_$]+)\.removeChild\(([^)]+)\)/g, '($1 && $1.removeChild($2))');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Patched', file);
  }
}
