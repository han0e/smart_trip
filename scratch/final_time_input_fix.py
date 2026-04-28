import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Improve Time Input (Front Side)
# Target: value={currentPlan.time} ... className="... w-20 ..."
front_time_pattern = re.compile(r'(<input\s+type="text"\s+value=\{currentPlan\.time\}\s+onChange=\{.*?\}\s+className=")(.*?)w-20(.*?)(")', re.DOTALL)
content = front_time_pattern.sub(r'\1\2min-w-[140px] px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border-blue-200/50 dark:border-blue-500/30 text-[14px] font-bold shadow-sm\3\4', content)

# 2. Improve Time Input (Back Side)
# Target: value={currentPlan.time || ""} ... className="... w-20 ..."
back_time_pattern = re.compile(r'(<input\s+type="text"\s+value=\{currentPlan\.time\s*\|\|\s*""\}\s+onChange=\{.*?\}\s+className=")(.*?)w-20(.*?)(")', re.DOTALL)
content = back_time_pattern.sub(r'\1\2min-w-[140px] px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border-blue-200/50 dark:border-blue-500/30 text-[14px] font-bold shadow-sm\3\4', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated time input fields for both Front and Back sides.")
