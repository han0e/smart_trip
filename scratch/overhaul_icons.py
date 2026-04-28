import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Increase toggle button icon size (16 -> 24)
content = content.replace('size={16}', 'size={24}')

# 2. Increase picker item icon size (22 or 18 or 20 -> 32)
# I'll just match the pattern inside the TRAVEL_ICON_NAMES map
import re

# Match the TravelIcon inside the map loop
content = re.sub(r'(<TravelIcon\s+name=\{iconName\}\s+size=\{)\d+(\})', r'\1 32 \2', content)

# 3. Update the picker container layout
# Old: className="absolute left-0 top-10 z-100 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-[240px] pointer-events-auto"
# New: className="absolute left-0 top-14 z-100 p-5 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[340px] pointer-events-auto"

content = content.replace('className="absolute left-0 top-10 z-100 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-[240px] pointer-events-auto"', 
                         'className="absolute left-0 top-14 z-[100] p-5 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[340px] pointer-events-auto"')

# 4. Update the grid layout
# Old: <div className="grid grid-cols-6 gap-2">
# New: <div className="grid grid-cols-5 gap-4">
content = content.replace('<div className="grid grid-cols-6 gap-2">', '<div className="grid grid-cols-5 gap-4">')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Significantly increased icon sizes via script.")
