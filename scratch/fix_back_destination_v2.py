import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Precise target for the back side (Plan B) content area
target = '''                                  </div>

                                  {isEditMode ? ('''

# Find the second occurrence which is the back side
parts = content.split(target)
if len(parts) >= 3:
    # index 2 starts with the second textarea
    # we want to insert BEFORE index 2's target
    replacement = '''                                  </div>

                                  {isEditMode && (
                                    <div className="flex items-center gap-2 mt-2 px-1 py-1 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                                      <MapPin
                                        size={14}
                                        className="text-slate-400 shrink-0 ml-1"
                                      />
                                      <input
                                        type="text"
                                        value={currentPlan.mapQuery || ""}
                                        onChange={(e) =>
                                          updateScheduleItem(
                                            day.id,
                                            idx,
                                            "mapQuery",
                                            e.target.value,
                                            isFlipped,
                                          )
                                        }
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-slate-600 dark:text-slate-300 p-0"
                                        placeholder="목적지 (검색어)"
                                      />
                                    </div>
                                  )}

                                  {isEditMode ? ('''
    
    # Re-assemble: parts[0] + target + parts[1] + replacement + parts[2] + ...
    # Wait, parts[0] is front side preamble. parts[1] is between front target and back target.
    # parts[2] is back side preamble.
    # Actually, parts[0] contains first target's before.
    # parts[1] is between 1st and 2nd target.
    # so: parts[0] + target + parts[1] + replacement + parts[2] ...
    content = parts[0] + target + parts[1] + replacement + target.join(parts[2:])

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Correctly updated back side destination input.")
