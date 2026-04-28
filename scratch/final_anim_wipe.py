import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove all hardcoded motion animations (Fish, Dolphin, Pineapple, etc.)
# We search for <motion.div blocks that contain these icons
icons_to_remove = ['Fish', 'DolphinIcon', 'PineappleIcon', 'Plane', 'Car', 'Utensils']
for icon in icons_to_remove:
    # This pattern matches <motion.div ...> ... <Icon ... /> ... </motion.div>
    pattern = re.compile(r'<motion\.div.*?>.*?<' + icon + r'.*?/>.*?</motion\.div>', re.DOTALL)
    content = pattern.sub('', content)

# 2. Specifically remove any React.Fragment or logic wrappers around these
content = re.sub(r'\{activeAnimations.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'<AnimatePresence>\s*</AnimatePresence>', '', content, flags=re.DOTALL)

# 3. Final polish on buttons and inputs
# Re-apply unified button styles just in case
back_buttons_pattern = re.compile(r'\{isEditMode && \(.*?Delete Plan B.*?</button>.*?Back to Plan A.*?</button>', re.DOTALL)
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
content = back_buttons_pattern.sub(unified_buttons, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Thoroughly removed all hardcoded animations and finalized UI.")
