import subprocess
import re

# Get the HEAD version of the file
result = subprocess.run(['git', 'show', 'HEAD:app/page.tsx'], capture_output=True, text=True, encoding='utf-8')
content = result.stdout

# 1. Update imports
content = content.replace(
'''import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  ShoppingBag,
  Utensils,
  UtensilsCrossed,
  Hotel,
  Camera,
  Plane,
  MapPin,
  Moon,
  Sun,
  Navigation,
  PersonStanding,
  Sailboat,
  ShoppingCart,
  BedDouble,
  Fish,
  Cloud,
  WavesLadder,
  PlaneLanding,
  BaggageClaim,
  PlaneTakeoff,
  Bus,
  Wallet,
  X,
  ClipboardCheck,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  FerrisWheel,
} from "lucide-react";''',
'''import {
  TravelIcon,
  TRAVEL_ICON_NAMES,
} from "@/components/TravelIcons";
import { BudgetEditor } from "@/components/BudgetEditor";
import { mockCosts, mockItinerary } from "@/data/mockTrip";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, ShoppingBag, Utensils, UtensilsCrossed, Hotel, Camera, Plane,
  MapPin, Moon, Sun, Navigation, PersonStanding, Sailboat, ShoppingCart,
  BedDouble, Fish, Cloud, WavesLadder, PlaneLanding, BaggageClaim,
  PlaneTakeoff, Bus, Wallet, X, ClipboardCheck, ExternalLink, ShieldCheck,
  Sparkles, FerrisWheel, Plus, Save, Lock, Unlock, Menu as MenuIcon,
  Trash2, Route, Undo2
} from "lucide-react";''')

# Remove the giant hardcoded SVGs
content = re.sub(r'// Custom Dolphin SVG Path.*?const PineappleIcon = .*?</svg>\n\);\n', '', content, flags=re.DOTALL)

# Remove activeAnimations
content = re.sub(r'\s*const \[activeAnimations, setActiveAnimations\] = useState<.*?\]>\(\[\]\);', '', content)
content = re.sub(r'\s*const triggerAnimation = \(cardKey: string, title: string\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)
content = re.sub(r'onClick=\{\(\) =>\s*triggerAnimation\(cardKey, schedule\.title\)\s*\}', '', content)

# Unify Back side buttons
back_btns = re.compile(r'\{isEditMode && \(\s*<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*togglePlanB\(day\.id, idx\);\s*\}\}\s*className="px-3 py-1.*?Delete Plan B.*?</button>\s*\)\}\s*<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setFlippedItems.*?\s*\}\}\s*className="px-4 py-2.*?Back to Plan A.*?</button>', re.DOTALL)

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
content = back_btns.sub(unified_buttons, content)

# Add mapQuery to front
front_map_query = re.compile(r'(<input\s+type="text"\s+value=\{currentPlan\.title\}.*?/>\s*</div>)', re.DOTALL)
content = front_map_query.sub(r'''\1
                                  {isEditMode && (
                                    <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-3 group/map focus-within:border-blue-500/50 transition-all shadow-sm mb-4">
                                      <Navigation size={15} className="text-slate-400 group-focus-within/map:text-blue-500 transition-colors shrink-0" />
                                      <input
                                        type="text"
                                        value={currentPlan.mapQuery || ""}
                                        onChange={(e) => updateScheduleItem(day.id, idx, "mapQuery", e.target.value)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 dark:text-slate-200 p-0 placeholder:text-slate-400"
                                        placeholder="목적지 검색어 (예: 파르코시티)"
                                      />
                                    </div>
                                  )}''', content, count=1)

# Add mapQuery to back
back_map_query = re.compile(r'(<input\s+type="text"\s+value=\{currentPlan\.title\}.*?/>\s*</div>)', re.DOTALL)
content = back_map_query.sub(r'''\1
                                  {isEditMode && (
                                    <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-3 group/map focus-within:border-blue-500/50 transition-all shadow-sm mb-4">
                                      <Navigation size={15} className="text-slate-400 group-focus-within/map:text-blue-500 transition-colors shrink-0" />
                                      <input
                                        type="text"
                                        value={currentPlan.mapQuery || ""}
                                        onChange={(e) => updateScheduleItem(day.id, idx, "mapQuery", e.target.value, true)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 dark:text-slate-200 p-0 placeholder:text-slate-400"
                                        placeholder="목적지 검색어 (예: 이온몰)"
                                      />
                                    </div>
                                  )}
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
                                  )}''', content) # count wasn't 1 so it matches all... actually I should ensure this only matches the SECOND occurrence or I can just use a more specific regex.

# Better: just use string replacement for back map query, or the regex will match front again if I run it globally.
# Let's write the script to a file and run it.
with open('scratch/head_fix.py', 'w', encoding='utf-8') as f:
    f.write("""import subprocess
import re

# Get the HEAD version of the file
result = subprocess.run(['git', 'show', 'HEAD:app/page.tsx'], capture_output=True, text=True, encoding='utf-8')
content = result.stdout

# 1. Update imports
content = content.replace(
'''import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  ShoppingBag,
  Utensils,
  UtensilsCrossed,
  Hotel,
  Camera,
  Plane,
  MapPin,
  Moon,
  Sun,
  Navigation,
  PersonStanding,
  Sailboat,
  ShoppingCart,
  BedDouble,
  Fish,
  Cloud,
  WavesLadder,
  PlaneLanding,
  BaggageClaim,
  PlaneTakeoff,
  Bus,
  Wallet,
  X,
  ClipboardCheck,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  FerrisWheel,
} from "lucide-react";''',
'''import {
  TravelIcon,
  TRAVEL_ICON_NAMES,
} from "@/components/TravelIcons";
import { BudgetEditor } from "@/components/BudgetEditor";
import { mockCosts, mockItinerary } from "@/data/mockTrip";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, ShoppingBag, Utensils, UtensilsCrossed, Hotel, Camera, Plane,
  MapPin, Moon, Sun, Navigation, PersonStanding, Sailboat, ShoppingCart,
  BedDouble, Fish, Cloud, WavesLadder, PlaneLanding, BaggageClaim,
  PlaneTakeoff, Bus, Wallet, X, ClipboardCheck, ExternalLink, ShieldCheck,
  Sparkles, FerrisWheel, Plus, Save, Lock, Unlock, Menu as MenuIcon,
  Trash2, Route, Undo2
} from "lucide-react";''')

# Remove the giant hardcoded SVGs
content = re.sub(r'// Custom Dolphin SVG Path.*?const PineappleIcon = .*?</svg>\n\);\n', '', content, flags=re.DOTALL)

# Remove activeAnimations
content = re.sub(r'\s*const \[activeAnimations, setActiveAnimations\] = useState<.*?\]>\(\[\]\);', '', content)
content = re.sub(r'\s*const triggerAnimation = \(cardKey: string, title: string\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)
content = re.sub(r'onClick=\{\(\) =>\s*triggerAnimation\(cardKey, schedule\.title\)\s*\}', '', content)

# Remove <AnimatePresence> blocks for animations inside the cards
content = re.sub(r'<AnimatePresence>\s*\{activeAnimations.*?</AnimatePresence>', '', content, flags=re.DOTALL)

# Remove the map blocks inside AnimatePresence that might have been left
content = re.sub(r'\{activeAnimations\.filter.*?\}\s*</React\.Fragment>\s*\)\)\}', '', content, flags=re.DOTALL)


# Unify Back side buttons
back_btns = re.compile(r'\{isEditMode && \(\s*<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*togglePlanB\(day\.id, idx\);\s*\}\}\s*className="px-3 py-1.*?Delete Plan B.*?</button>\s*\)\}\s*<button\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setFlippedItems.*?\s*\}\}\s*className="px-4 py-2.*?Back to Plan A.*?</button>', re.DOTALL)

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
content = back_btns.sub(unified_buttons, content)

# Front input logic
# We add mapQuery input to BOTH front and back
front_pattern = r'(<input\s+type="text"\s+value=\{currentPlan\.title\}\s*onChange=\{\(e\) => updateScheduleItem\(day\.id, idx, "title", e\.target\.value\)\}\s*className="text-xl.*?/>\s*</div>)'
content = re.sub(front_pattern, r'''\\1
                                  {isEditMode && (
                                    <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-3 group/map focus-within:border-blue-500/50 transition-all shadow-sm mb-4">
                                      <Navigation size={15} className="text-slate-400 group-focus-within/map:text-blue-500 transition-colors shrink-0" />
                                      <input
                                        type="text"
                                        value={currentPlan.mapQuery || ""}
                                        onChange={(e) => updateScheduleItem(day.id, idx, "mapQuery", e.target.value)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 dark:text-slate-200 p-0 placeholder:text-slate-400"
                                        placeholder="목적지 검색어 (예: 파르코시티)"
                                      />
                                    </div>
                                  )}''', content)

back_pattern = r'(<input\s+type="text"\s+value=\{currentPlan\.title\}\s*onChange=\{\(e\) => updateScheduleItem\(day\.id, idx, "title", e\.target\.value, true\)\}\s*className="text-xl.*?/>\s*</div>)'
content = re.sub(back_pattern, r'''\\1
                                  {isEditMode && (
                                    <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-3 group/map focus-within:border-blue-500/50 transition-all shadow-sm mb-4">
                                      <Navigation size={15} className="text-slate-400 group-focus-within/map:text-blue-500 transition-colors shrink-0" />
                                      <input
                                        type="text"
                                        value={currentPlan.mapQuery || ""}
                                        onChange={(e) => updateScheduleItem(day.id, idx, "mapQuery", e.target.value, true)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-slate-700 dark:text-slate-200 p-0 placeholder:text-slate-400"
                                        placeholder="목적지 검색어 (예: 이온몰)"
                                      />
                                    </div>
                                  )}
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
                                  )}''', content)

# Smart bubble logic
bubble_pattern = re.compile(r'let displayTravelTime = schedule\.travelTime;.*?\n\s+if \(!displayTravelTime\) return <div className="h-10" />;', re.DOTALL)
smart_bubble = '''let displayTravelTime = schedule.travelTime;

                        // 현재 카드가 뒤집혔을 때 (본인의 nextTravelTime 적용)
                        if (flippedItems[cardKey] && schedule.alt?.nextTravelTime) {
                          displayTravelTime = schedule.alt.nextTravelTime;
                        }

                        if (!displayTravelTime) return <div className="h-10" />;'''
content = bubble_pattern.sub(smart_bubble, content)

# Fix time inputs width
content = content.replace('w-20', 'w-[105px]')

# Write back to file
with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Restored from HEAD and applied changes safely.")
""")
