const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

// Function to replace indigo and blue with orange
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We will replace indigo-100, blue-500 etc. with orange-100, orange-500 etc.
      let originalContent = content;
      content = content.replace(/\bindigo-(\d+)\b/g, 'orange-$1');
      content = content.replace(/\bblue-(\d+)\b/g, 'orange-$1');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated colors in ${file}`);
      }
    }
  }
}

processDirectory(dir);
console.log('All theme colors replaced with orange!');
