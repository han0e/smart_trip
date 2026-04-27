const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// The string "dark:text-slate-400 dark:text-slate-500" happens because text-slate-500 was replaced by dark:text-slate-400, then text-slate-400 was replaced.
content = content.replace(/dark:text-slate-[0-9]+\s+dark:text-slate-[0-9]+/g, function(match) {
    const list = match.split(/\s+/);
    // keep the first one
    return list[0];
});

content = content.replace(/dark:text-slate-[0-9]+\s+dark:text-slate-[0-9]+\s+dark:text-slate-[0-9]+/g, function(match) {
    const list = match.split(/\s+/);
    return list[0];
});

content = content.replace(/dark:(text|shadow|bg|border|hover)[A-Za-z0-9\-\/\[\]#]+\s+dark:\1[A-Za-z0-9\-\/\[\]#]+/g, function(match) {
    const list = match.split(/\s+/);
    // Keep first dark class
    return list[0];
});

fs.writeFileSync('app/page.tsx', content);
console.log('cleaned');
