import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The back side edit mode uses <textarea for the description
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

if target in content:
    content = content.replace(target, replacement)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated back side destination input successfully.")
else:
    print("Target not found.")
    # Debug: print a slice of the file to see why it fails
    idx = content.find('<textarea')
    if idx != -1:
        print("Found <textarea at:", idx)
        print("Context:", repr(content[idx-100:idx+50]))
