import sys
import os
import re

path = r'c:\Users\limes\Desktop\01_개인\00. 프로그래밍\Smart_Trip\app\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace everything from start up to 'const OkinawaTrip'
header_replacement = '''"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  DolphinIcon,
  PineappleIcon,
  TravelIcon,
  TRAVEL_ICON_NAMES,
} from "@/components/TravelIcons";
import { BudgetEditor } from "@/components/BudgetEditor";
import { mockCosts, mockItinerary } from "@/data/mockTrip";

import { supabase } from "@/lib/supabase";

import {
  ScheduleAlt,
  ScheduleItem,
  DayItinerary,
  CostItem,
} from "@/types/itinerary";
import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  Save,
  Lock,
  Unlock,
  Menu as MenuIcon,
  Trash2,
  Route,
  Undo2,
} from "lucide-react";

const OkinawaTrip = () => {'''

content = re.sub(r'^.*?const OkinawaTrip = \(\) => \{', header_replacement, content, flags=re.DOTALL)

# 2. Remove all activeAnimations state and logic
content = re.sub(r'const \[activeAnimations, setActiveAnimations\].*?\[\]>\(\[\]\);', '', content, flags=re.DOTALL)
content = re.sub(r'const triggerAnimation = \(cardKey: string, title: string\) => {.*?};', '', content, flags=re.DOTALL)
content = re.sub(r'\{activeAnimations\.map\(.*?\)\}', '', content, flags=re.DOTALL)

# 3. Clean up any onClick={...triggerAnimation...}
content = re.sub(r'onClick=\{\(\) =>\s+triggerAnimation\(.*?\)\s*\}', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Successfully cleaned up header and removed animation logic.")
