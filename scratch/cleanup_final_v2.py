import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reduce Time Input width (from 140px to 105px)
content = content.replace('min-w-[140px]', 'w-[105px]')

# 2. Thoroughly remove all triggerAnimation calls
content = re.sub(r'onClick=\{\(\) =>\s+triggerAnimation\(.*?\)\s*\}', '', content, flags=re.DOTALL)

# 3. Remove cursor-pointer logic blocks (Front & Back)
pattern_cursor = re.compile(r'className=\{\s*/조식\|.*?\.test\(.*?\)\s*\? "cursor-pointer" : ""\s*\}', re.DOTALL)
content = pattern_cursor.sub('className=""', content)

# 4. Remove activeAnimations mapping blocks
pattern_anim_map = re.compile(r'<AnimatePresence>\s*\{activeAnimations\s*\.filter\(.*?\)\s*\.map\(.*?\}\s*</AnimatePresence>', re.DOTALL)
content = pattern_anim_map.sub('', content)

# 5. Clean up any remaining activeAnimations references
content = re.sub(r'\{activeAnimations\.map\(.*?\)\}', '', content, flags=re.DOTALL)

# 6. Fix the broken className={`space-y-4 mt-4 ...`} that might still be there with extra whitespace
pattern_messy_class = re.compile(r'className={`space-y-4 mt-4 \$\{.*?\}`\}', re.DOTALL)
content = pattern_messy_class.sub('className="space-y-4 mt-4"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Optimized time input width and completely removed remaining animation logic.")
