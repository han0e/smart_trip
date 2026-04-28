import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '{isEditMode ? (' in line and i + 1 < len(lines) and 'value={currentPlan.desc}' in lines[i+1]:
        # Restore the missing <textarea
        lines[i+1] = '                                    <textarea\n' + lines[i+1]
        break

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Restored missing <textarea tag.")
