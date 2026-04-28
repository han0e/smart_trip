import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target the specific back side edit mode area
target = '{isEditMode ? (\n                                    <textarea'
replacement = '''{isEditMode && (
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

# Only replace the second occurrence (back side) or use a more specific search
# The back side has schedule.alt.desc later
if content.count(target) >= 2:
    # Find all occurrences
    parts = content.split(target)
    # Reassemble with replacement in the second part
    new_content = parts[0] + target + parts[1] + replacement + target.join(parts[2:])
    content = new_content

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated back side destination input.")
