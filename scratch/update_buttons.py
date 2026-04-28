import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update "Delete Plan B" button
# Search for: Delete Plan B
content = content.replace(
    'Delete Plan B',
    'Plan B <Trash2 size={12} />'
)

# 2. Update "Back to Plan A" button
# Search for: Back to Plan A
content = content.replace(
    'Back to Plan A <Sparkles size={12} />',
    '<ArrowLeft size={12} /> Plan A'
)

# 3. Fix the "Back to Plan A" without Sparkles if any
content = content.replace(
    'Back to Plan A',
    '<ArrowLeft size={12} /> Plan A'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Plan B/A buttons with icons.")
