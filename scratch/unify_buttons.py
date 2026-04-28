import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports: Replace ArrowLeft with Undo2
content = content.replace('ArrowLeft,', 'Undo2,')

# 2. Unify Plan B (Delete) button style
# Old: px-3 py-1.5 ... text-[11px] font-bold ... gap-1
# New: px-3.5 py-1.5 ... text-[12px] font-bold ... gap-1.5
content = content.replace(
    'className="px-3 py-1.5 rounded-full border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[11px] font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-1"',
    'className="px-3.5 py-1.5 rounded-full border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[12px] font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-1.5 shadow-sm"'
)

# 3. Unify Plan A (Back) button style and icon
# Old: px-4 py-2 ... text-[12px] font-semibold ... gap-1.5 ... <ArrowLeft size={12} /> Plan A
# New: px-3.5 py-1.5 ... text-[12px] font-bold ... gap-1.5 ... <Undo2 size={12} /> Plan A
content = content.replace(
    'className="px-4 py-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[12px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center gap-1.5 shadow-sm"',
    'className="px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[12px] font-bold transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-1.5 shadow-sm"'
)

content = content.replace('<ArrowLeft size={12} /> Plan A', '<Undo2 size={12} /> Plan A')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Unified button sizes/fonts and updated back icon to Undo2.")
