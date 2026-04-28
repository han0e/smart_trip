import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reduce toggle button icon size (24 -> 20)
content = content.replace('size={24}', 'size={20}')

# 2. Reduce picker item icon size (32 -> 26)
import re
content = re.sub(r'(<TravelIcon\s+name=\{iconName\}\s+size=\{)\s*32\s*(\})', r'\1 26 \2', content)

# 3. Reduce picker container dimensions and styles
# Old: className="absolute left-0 top-14 z-[100] p-5 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[340px] pointer-events-auto"
# New: className="absolute left-0 top-12 z-[100] p-4 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[280px] pointer-events-auto"

content = content.replace('className="absolute left-0 top-14 z-[100] p-5 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[340px] pointer-events-auto"', 
                         'className="absolute left-0 top-12 z-[100] p-4 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[280px] pointer-events-auto"')

# 4. Reduce grid gap
# Old: <div className="grid grid-cols-5 gap-4">
# New: <div className="grid grid-cols-5 gap-3">
content = content.replace('<div className="grid grid-cols-5 gap-4">', '<div className="grid grid-cols-5 gap-3">')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Reduced icon sizes and picker layout by 20% via script.")
