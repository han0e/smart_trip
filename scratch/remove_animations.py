import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove activeAnimations state
content = re.sub(r'const \[activeAnimations, setActiveAnimations\].*?\[\]>\(\[\]\);', '', content, flags=re.DOTALL)

# 2. Remove triggerAnimation function
content = re.sub(r'const triggerAnimation = \(cardKey: string, title: string\) => {.*?};', '', content, flags=re.DOTALL)

# 3. Remove the onClick={...triggerAnimation...} from the card containers
# Search for: onClick={() => triggerAnimation(cardKey, schedule.title)}
content = content.replace('onClick={() =>\n                                  triggerAnimation(cardKey, schedule.title)\n                                }', '')
# Also handle different formatting if any
content = re.sub(r'onClick=\{\(\) =>\s+triggerAnimation\(cardKey, schedule\.title\)\s+\}', '', content)

# 4. Remove the cursor-pointer class logic related to animations
content = re.sub(r'className={`space-y-4 mt-4 \${.*? : "" }`}', 'className="space-y-4 mt-4"', content, flags=re.DOTALL)

# 5. Remove the rendering logic for activeAnimations
# Search for: {activeAnimations.map((anim) => ( ... ))}
content = re.sub(r'\{activeAnimations\.map\(\(anim\) => \(.*?\)\)\}', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed all card click animations.")
