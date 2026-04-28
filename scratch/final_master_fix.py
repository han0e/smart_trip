import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Aggressive removal of all animation logic
content = re.sub(r'const \[activeAnimations, setActiveAnimations\].*?\[\]>\(\[\]\);', '', content, flags=re.DOTALL)
content = re.sub(r'const triggerAnimation = \(cardKey: string, title: string\) => {.*?};', '', content, flags=re.DOTALL)
content = re.sub(r'\{activeAnimations.*?\.map\(.*?\)\s*\}', '', content, flags=re.DOTALL)
content = re.sub(r'<AnimatePresence>\s*\{activeAnimations.*?\}\s*</AnimatePresence>', '', content, flags=re.DOTALL)
content = re.sub(r'onClick=\{\(\) => triggerAnimation\(.*?\)\}', '', content)

# 2. Global Unification of Plan B/A Buttons (Back Side)
# We search for the pattern of the two buttons together
button_block_pattern = re.compile(r'\{isEditMode && \(.*?Delete Plan B.*?</button>.*?Back to Plan A.*?</button>', re.DOTALL)
unified_buttons = '''{isEditMode && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePlanB(day.id, idx);
                                          }}
                                          className="px-3.5 py-1.5 rounded-full border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[12px] font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-1.5 shadow-sm"
                                        >
                                          Plan B <Trash2 size={12} />
                                        </button>
                                      )}

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFlippedItems((prev) => ({
                                            ...prev,
                                            [cardKey]: false,
                                          }));
                                        }}
                                        className="px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[12px] font-bold transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-1.5 shadow-sm"
                                      >
                                        <Undo2 size={12} /> Plan A
                                      </button>'''
content = button_block_pattern.sub(unified_buttons, content)

# 3. Add Travel Time Input for Plan B
# Insert it after the mapQuery input area
map_query_pattern = re.compile(r'(<input\s+type="text"\s+value=\{currentPlan\.mapQuery.*?/>\s*</div>)', re.DOTALL)
tt_input = r'''\1
                                  {isEditMode && isFlipped && (
                                    <div className="mt-3 px-4 py-2.5 rounded-2xl bg-amber-100/50 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-700/50 flex items-center gap-3 group/tt focus-within:border-amber-500/50 transition-all shadow-sm mb-4">
                                      <Car size={15} className="text-amber-500 shrink-0" />
                                      <input
                                        type="text"
                                        value={schedule.alt?.nextTravelTime || ""}
                                        onChange={(e) => updateScheduleItem(day.id, idx, "nextTravelTime", e.target.value, true)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-amber-700 dark:text-amber-200 p-0 placeholder:text-amber-400"
                                        placeholder="다음 장소까지 이동시간 (Plan B용)"
                                      />
                                    </div>
                                  )}'''
content = map_query_pattern.sub(tt_input, content)

# 4. Smart Travel Time Bubble Logic
bubble_pattern = re.compile(r'let displayTravelTime = schedule\.travelTime;.*?\n\s+if \(!displayTravelTime\) return <div className="h-10" />;', re.DOTALL)
smart_bubble = '''let displayTravelTime = schedule.travelTime;

                        // 현재 카드가 뒤집혔을 때 (본인의 nextTravelTime 적용)
                        if (flippedItems[cardKey] && schedule.alt?.nextTravelTime) {
                          displayTravelTime = schedule.alt.nextTravelTime;
                        }

                        if (!displayTravelTime) return <div className="h-10" />;'''
content = bubble_pattern.sub(smart_bubble, content)

# 5. Global Cleanup of container classes and time input widths
content = re.sub(r'className={`space-y-4 mt-4 \$\{.*? \? "cursor-pointer" : "" \}\}`\}', 'className="space-y-4 mt-4"', content)
content = re.sub(r'className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full text-\[12px\] font-medium w-20 focus:ring-1 focus:ring-blue-500 text-center"',
                 'className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-[14px] font-bold w-[105px] focus:ring-1 focus:ring-blue-500 text-center shadow-sm"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Successfully applied final fixes and Plan B travel time features.")
