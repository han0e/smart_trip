import sys
import os

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Front Side Fix
front_old = '''                                  {isEditMode && (
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
                                  )}'''

# We want to remove this and put a better version below the closing </div> of the title row.
content = content.replace(front_old, '', 1)

# Now find the first </div> after the title row starts
# The title row starts with <div className="flex items-center gap-3 relative mt-4">
# We need to find where that ends.
# Looking at the code, it ends right before {isEditMode ? ( <textarea

insertion_point = '                                </div>\n\n                                {isEditMode ? ('
replacement = '''                                </div>

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

content = content.replace(insertion_point, replacement, 1)

# 2. Back Side Fix
back_old = '''                                  {isEditMode && (
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
                                  )}'''

# Note: The first one was already removed. So the next one is the back side.
content = content.replace(back_old, '', 1)

# The back side insertion point also matches the same pattern
content = content.replace(insertion_point, replacement, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Relocated destination input to its own row (Front & Back).")
