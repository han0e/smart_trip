import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove activeAnimations state (multi-line)
content = re.sub(r'const \[activeAnimations, setActiveAnimations\].*?\[\]>\(\[\]\);', '', content, flags=re.DOTALL)

# 2. Remove triggerAnimation function
content = re.sub(r'const triggerAnimation = \(cardKey: string, title: string\) => {.*?};', '', content, flags=re.DOTALL)

# 3. Clean up the Front side container (Exact match from Turn 124)
front_target = '''                              <div
                                
                                className={`space-y-4 mt-4 ${
                                  /조식|소바|점심|저녁|스테이크|식당|식사|타마고|호토모토|우후야|카이센테이|블루씰|스시|맛집|출발|도착|돈키호테|빌리지|수영장|만좌모|부세나|츄라우미|파인애플|파르코|쇼핑몰|마트/.test(
                                    schedule.title,
                                  )
                                    ? "cursor-pointer"
                                    : ""
                                }`}
                              >'''
content = content.replace(front_target, '                              <div className="space-y-4 mt-4">')

# 4. Clean up the Back side container
# We'll search for the back side version which is similar but uses schedule.alt.title or currentPlan.title
back_pattern = re.compile(r'<div\s+className={`space-y-4 mt-4 \$\{.*? \? "cursor-pointer" : "" \}\}`\}>', re.DOTALL)
content = back_pattern.sub('<div className="space-y-4 mt-4">', content)

# 5. Remove the rendering logic for activeAnimations
# It's usually {activeAnimations.map(...) }
content = re.sub(r'\{activeAnimations\.map\(\(anim\) => \(.*?\)\)\}', '', content, flags=re.DOTALL)

# 6. Final check for any remaining onClick={...triggerAnimation...}
content = re.sub(r'onClick=\{\(\) =>\s+triggerAnimation\(cardKey, schedule\..*?title\)\s+\}', '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Successfully removed all card click animations and cleaned up the UI.")
