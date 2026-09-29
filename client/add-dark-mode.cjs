const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
  { regex: /\bbg-white\b(?! dark:bg-)/g, replacement: 'bg-white dark:bg-gray-800' },
  { regex: /\bbg-gray-50\b(?! dark:bg-)/g, replacement: 'bg-gray-50 dark:bg-gray-900' },
  { regex: /\bbg-gray-100\b(?! dark:bg-)/g, replacement: 'bg-gray-100 dark:bg-gray-700' },
  { regex: /\bbg-gray-200\b(?! dark:bg-)/g, replacement: 'bg-gray-200 dark:bg-gray-600' },
  { regex: /\btext-gray-900\b(?! dark:text-)/g, replacement: 'text-gray-900 dark:text-white' },
  { regex: /\btext-gray-800\b(?! dark:text-)/g, replacement: 'text-gray-800 dark:text-gray-100' },
  { regex: /\btext-gray-700\b(?! dark:text-)/g, replacement: 'text-gray-700 dark:text-gray-200' },
  { regex: /\btext-gray-600\b(?! dark:text-)/g, replacement: 'text-gray-600 dark:text-gray-300' },
  { regex: /\btext-gray-500\b(?! dark:text-)/g, replacement: 'text-gray-500 dark:text-gray-400' },
  { regex: /\bborder-gray-100\b(?! dark:border-)/g, replacement: 'border-gray-100 dark:border-gray-700' },
  { regex: /\bborder-gray-200\b(?! dark:border-)/g, replacement: 'border-gray-200 dark:border-gray-700' },
  { regex: /\bborder-gray-300\b(?! dark:border-)/g, replacement: 'border-gray-300 dark:border-gray-600' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Special case: CodingWorkspace.jsx already has dark mode manually written, skip it.
      if (file === 'CodingWorkspace.jsx') continue;

      let modified = false;
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
      }
    }
  }
}

processDirectory(dir);
console.log('Done!');
