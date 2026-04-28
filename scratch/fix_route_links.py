import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the broken updateTravelTime call
content = content.replace('updateTravelTime(\n                                      day.id,\n                                      idx,\n),\n                                     )', 
                         'updateTravelTime(\n                                      day.id,\n                                      idx,\n                                      e.target.value,\n                                      flippedItems[cardKey],\n                                    )')

# 2. Refine the route link href to be Plan B aware
old_href = 'href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(\n                                       schedule.mapQuery || "",\n                                     )}&destination=${encodeURIComponent(\n                                       nextSchedule.mapQuery || "",\n                                     )}`}'

new_href = 'href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(\n                                       (flippedItems[cardKey] && schedule.alt?.mapQuery\n                                         ? schedule.alt.mapQuery\n                                         : schedule.mapQuery) || ""\n                                     )}&destination=${encodeURIComponent(\n                                       (flippedItems[nextCardKey] && nextSchedule.alt?.mapQuery\n                                         ? nextSchedule.alt.mapQuery\n                                         : nextSchedule.mapQuery) || ""\n                                     )}`}'

content = content.replace(old_href, new_href)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed broken code and refined route links via script.")
