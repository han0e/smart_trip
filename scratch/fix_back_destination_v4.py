import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Precise search for the back side gap
target = '                                  </div>\n\n\n\n                                  {isEditMode ? ('
replacement = '''                                  </div>

                                {isEditMode && (
                                  <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3 group/dest focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-sm mb-4">
                                    <MapPin
                                      size={15}
                                      className="text-slate-400 group-focus-within/dest:text-blue-500 transition-colors shrink-0"
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
                                      className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 dark:text-slate-200 p-0 placeholder:text-slate-400"
                                      placeholder="목적지 (구글 지도 검색어)"
                                    />
                                  </div>
                                )}

                                {isEditMode ? ('''

if target in content:
    content = content.replace(target, replacement)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed back side destination input layout.")
else:
    print("Target not found in back side.")
