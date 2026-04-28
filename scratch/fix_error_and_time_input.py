import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Thoroughly remove all triggerAnimation calls
# This targets any onClick that calls triggerAnimation
content = re.sub(r'onClick=\{\(\) =>\s+triggerAnimation\(.*?\)\s*\}', '', content, flags=re.DOTALL)

# 2. Increase Time Input width and improve layout
# Current time input pattern:
# <input type="text" value={currentPlan.time || ...} onChange={...} className="..." placeholder="00:00" />
# We'll search for inputs with placeholder="00:00" or value involving .time

# Improvement: Increase width from current (likely small) to a fixed comfortable width like w-32 or w-40
time_input_pattern = re.compile(r'(<input\s+type="text"\s+value=\{currentPlan\.time\s*\|\|\s*""\}\s+onChange=\{.*?\}\s+className=")(.*?)(")', re.DOTALL)
# Replace 'w-20' or similar with 'w-36' or 'min-w-[140px]'
content = time_input_pattern.sub(r'\1\2 min-w-[140px] px-3 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-blue-200/50 dark:border-blue-500/20 text-[14px] font-bold\3', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed remaining triggerAnimation calls and improved time input width.")
