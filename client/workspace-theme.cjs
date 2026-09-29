const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/CodingWorkspace.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements map
const replacements = {
  'bg-[#181818]': 'bg-gray-50 dark:bg-[#181818]',
  'bg-[#1f1f1f]': 'bg-white dark:bg-[#1f1f1f]',
  'bg-[#252525]': 'bg-gray-50 dark:bg-[#252525]',
  'bg-[#2a2a2a]': 'bg-gray-100 dark:bg-[#2a2a2a]',
  'bg-[#333]': 'bg-gray-200 dark:bg-[#333]',
  'bg-[#3a3a3a]': 'bg-gray-300 dark:bg-[#3a3a3a]',
  'bg-[#444]': 'bg-gray-300 dark:bg-[#444]',
  'bg-[#111111]': 'bg-gray-100 dark:bg-[#111111]',
  'bg-[#2a1111]': 'bg-red-50 dark:bg-[#2a1111]',
  'border-[#333]': 'border-gray-200 dark:border-[#333]',
  'border-[#444]': 'border-gray-300 dark:border-[#444]',
  'text-gray-100': 'text-gray-800 dark:text-gray-100',
  'text-gray-200': 'text-gray-700 dark:text-gray-200',
  'text-gray-300': 'text-gray-600 dark:text-gray-300',
  'text-gray-400': 'text-gray-500 dark:text-gray-400',
  'text-white': 'text-gray-900 dark:text-white',
  'text-gray-500': 'text-gray-500 dark:text-gray-400',
  'hover:bg-[#2a2a2a]': 'hover:bg-gray-100 dark:hover:bg-[#2a2a2a]',
  'hover:bg-[#333]': 'hover:bg-gray-200 dark:hover:bg-[#333]',
  'hover:bg-[#3a3a3a]': 'hover:bg-gray-300 dark:hover:bg-[#3a3a3a]',
  'hover:bg-[#444]': 'hover:bg-gray-300 dark:hover:bg-[#444]',
  'prose-invert': 'dark:prose-invert'
};

// Also inject ThemeContext
if (!content.includes('ThemeContext')) {
  content = content.replace("import { Loader2, Play", "import { ThemeContext } from '../context/ThemeContext';\nimport { useContext } from 'react';\nimport { Loader2, Play");
  content = content.replace("const [searchParams] = useSearchParams();", "const [searchParams] = useSearchParams();\n  const { theme } = useContext(ThemeContext);");
}

// Update Editor theme
content = content.replace('theme="vs-dark"', 'theme={theme === \'dark\' ? \'vs-dark\' : \'light\'}');

for (const [key, val] of Object.entries(replacements)) {
  // Be careful with word boundaries and quotes, we just do a global replace
  content = content.split(key).join(val);
}

fs.writeFileSync(filePath, content);
console.log('CodingWorkspace updated with light/dark theme support!');
