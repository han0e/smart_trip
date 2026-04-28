import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target the specific animation class logic block
# We search for the pattern that includes the regex
import re
pattern = re.compile(r'className={`space-y-4 mt-4 \$\{\s*/조식\|.*?\.test\(.*?\)\s*\? "cursor-pointer" : ""\s*\}\}`\}', re.DOTALL)

content = pattern.sub('className="space-y-4 mt-4"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Final cleanup of card animation classes successful.")
