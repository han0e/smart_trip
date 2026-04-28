import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean up the Front side container
front_target = re.compile(r'<div\s+\n\s+\n\s+className={`space-y-4 mt-4 \$\{.*? \? "cursor-pointer" : "" \}\}`\}', re.DOTALL)
content = front_target.sub('<div className="space-y-4 mt-4"', content)

# 2. Clean up the Back side container
back_target = re.compile(r'<div className={`space-y-4 mt-4 \$\{.*? \? "cursor-pointer" : "" \}\}`\}>', re.DOTALL)
content = back_target.sub('<div className="space-y-4 mt-4">', content)

# Also check for the onClick that might have left messy whitespace
content = re.sub(r'onClick=\{\(\) => triggerAnimation\(cardKey, schedule\.title\)\}', '', content)
content = re.sub(r'onClick=\{\(\) => triggerAnimation\(cardKey, schedule\.alt\.title\)\}', '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up card containers and removed all animation logic.")
