import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target the card containers (Front and Back)
# Front Side pattern
content = content.replace('group relative overflow-hidden border border-white/40', 'group relative overflow-visible border border-white/40')

# Back Side pattern
content = content.replace('group overflow-hidden border border-white/40', 'group overflow-visible border border-white/40')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Changed card overflow to visible.")
