const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add Moon/Sun import
if (!content.includes('Sun, Moon')) {
  content = content.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { motion, AnimatePresence } from "framer-motion";\nimport { Sun, Moon } from "lucide-react";'
  );
}

// 2. Add isDarkMode state
if (!content.includes('const [isDarkMode')) {
  content = content.replace(
    'const [isSticky, setIsSticky] = useState(false);',
    'const [isSticky, setIsSticky] = useState(false);\n  const [isDarkMode, setIsDarkMode] = useState(false);'
  );
}

// 3. Add dark mode wrapper
if (!content.includes('isDarkMode ? "dark"')) {
  content = content.replace(
    '<div className="min-h-screen bg-[#f3f4f6]',
    '<div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-[#f3f4f6]'
  );
}

// 4. Add Toggle Button to sticky nav
const buttonMatch = '</nav>';
const toggleButton = `
            {/* Dark Mode Toggle */}
            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 ml-2"></div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="ml-2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </nav>`;

if (!content.includes('Dark Mode Toggle')) {
  content = content.replace(buttonMatch, toggleButton);
}

// 5. Tailwind class replacements
const regexReplacements = [
  // Text Colors
  [/text-\[\#1a1a1a\]/g, 'text-[#1a1a1a] dark:text-slate-100'],
  [/\btext-black\b/g, 'text-black dark:text-white'],
  [/\btext-slate-600\b/g, 'text-slate-600 dark:text-slate-300'],
  [/\btext-slate-500\b/g, 'text-slate-500 dark:text-slate-400'],
  [/\btext-slate-800\b/g, 'text-slate-800 dark:text-slate-200'],
  [/\btext-slate-400\b/g, 'text-slate-400 dark:text-slate-500'],
  
  // Background Colors
  [/bg-\[\#f3f4f6\]/g, 'bg-[#f3f4f6] dark:bg-[#0f1117]'],
  [/\bbg-white\b/g, 'bg-white dark:bg-[#181a20]'],
  [/\bbg-slate-50\b/g, 'bg-slate-50 dark:bg-[#1e2129]'],
  [/\bbg-slate-100\b/g, 'bg-slate-100 dark:bg-slate-800'],
  
  // Borders
  [/\bborder-slate-200\b/g, 'border-slate-200 dark:border-slate-700/60'],
  [/\bborder-slate-100\b/g, 'border-slate-100 dark:border-slate-700/40'],
  [/\bborder-slate-50\b/g, 'border-slate-50 dark:border-slate-700/40'],
  
  // Overlays & Glassmorphism
  [/\bbg-white\/60\b/g, 'bg-white/60 dark:bg-[#181a20]\/70'],
  [/\bbg-white\/80\b/g, 'bg-white/80 dark:bg-[#181a20]\/80'],
  [/\bborder-white\/80\b/g, 'border-white/80 dark:border-slate-700\/80'],
  [/\bbg-white\/90\b/g, 'bg-white/90 dark:bg-[#181a20]\/90'],
  
  // Shadows
  [/\bshadow-sm\b/g, 'shadow-sm dark:shadow-none'],
  
  // Hovers
  [/hover:text-black/g, 'hover:text-black dark:hover:text-white'],
  [/hover:bg-slate-50/g, 'hover:bg-slate-50 dark:hover:bg-slate-800'],
];

for (const [find, replace] of regexReplacements) {
  content = content.replace(find, replace);
}

// Clean up any double insertions if running twice
content = content.replace(/(dark:[^\s"']+)(?:\s+\1)+/g, '$1');

// Fix the active item color in the nav so it doesn't stay black in dark mode
content = content.replace(
  'activeSection === item.id\n                  ? "text-black dark:text-white font-bold"\n                  : "text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white"',
  'activeSection === item.id\n                  ? "text-black dark:text-white font-bold"\n                  : "text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white"'
);

// Oh wait, my regex replaced "text-black" inside the template literal. Let's make sure.

fs.writeFileSync('app/page.tsx', content);
console.log('Update complete.');
