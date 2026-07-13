"use client";

import React, { useState, useEffect, useRef } from "react";
import { TravelIcon, TRAVEL_ICON_NAMES } from "@/components/TravelIcons";
import { BudgetEditor } from "@/components/BudgetEditor";
import { mockCosts, mockItinerary } from "@/data/mockTrip";
import { mockCostsJa, mockItineraryJa } from "@/data/mockTripJa";

import { supabase } from "@/lib/supabase";

import {
  ScheduleAlt,
  ScheduleItem,
  DayItinerary,
  CostItem,
} from "@/types/itinerary";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Car,
  Utensils,
  Plane,
  MapPin,
  Moon,
  Sun,
  PersonStanding,
  Wallet,
  X,
  ClipboardCheck,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Plus,
  Save,
  Lock,
  Unlock,
  Menu as MenuIcon,
  Trash2,
  Route,
  ArrowLeft,
} from "lucide-react";

const High1GolfEvent = () => {
  const { scrollY } = useScroll();
  const dateTextColorLight = useTransform(
    scrollY,
    [0, 200],
    ["#1a1a1a", "#ffffff"],
  );
  const dayTitleTextColorLight = useTransform(
    scrollY,
    [0, 200],
    ["#475569", "#cbd5e1"],
  );
  const eventDescTextColorLight = useTransform(
    scrollY,
    [0, 200],
    ["#64748b", "#cbd5e1"],
  );

  const [itinerary, setItinerary] = useState<DayItinerary[]>(mockItinerary);
  const [costs, setCosts] = useState<CostItem[]>(mockCosts);
  const [personCount, setPersonCount] = useState(4); // 기본 4인 설정 (정선호, 김지복, 정인수, 장대진)
  const [budgetNote, setBudgetNote] = useState(
    `* 감사골프 행사 예상 경비입니다.\n* 그린피, 카트비, 식비 등이 포함된 대략적인 내역입니다.`,
  );
  const [language, setLanguage] = useState<"ko" | "ja">("ko");

  useEffect(() => {
    if (language === "ko") {
      setItinerary(mockItinerary);
      setCosts(mockCosts);
      setBudgetNote(
        `* 감사골프 행사 예상 경비입니다.\n* 그린피, 카트비, 식비 등이 포함된 대략적인 내역입니다.`,
      );
    } else {
      setItinerary(mockItineraryJa);
      setCosts(mockCostsJa);
      setBudgetNote(
        `* 感謝ゴルフイベントの予想経費です。\n* グリーンフィ、カート代、食費などが含まれた大まかな内訳です。`,
      );
    }
  }, [language]);

  const [activeSection, setActiveSection] = useState("day1");
  const [isDark, setIsDark] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isFoodDetailOpen, setIsFoodDetailOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [weatherEmoji, setWeatherEmoji] = useState("☀️");
  const [flippedItems, setFlippedItems] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [dayToDelete, setDayToDelete] = useState<string | null>(null);
  const [activeIconPicker, setActiveIconPicker] = useState<string | null>(null);

  const navWrapperRef = useRef<HTMLDivElement>(null);

  const addDay = () => {
    const nextDayNum = itinerary.length + 1;
    const nextDayId = `day${nextDayNum}`;
    const newDay: DayItinerary = {
      id: nextDayId,
      title: `${nextDayNum}일차`,
      date: "날짜 미정",
      schedules: [],
    };
    setItinerary([...itinerary, newDay]);
  };

  const removeDay = (dayId: string) => {
    if (itinerary.length <= 1) return; // 최소 1일은 유지
    setItinerary((prev) => prev.filter((d) => d.id !== dayId));
    if (activeSection === dayId) {
      setActiveSection(itinerary[0].id);
    }
  };

  const saveAllData = () => {
    // Supabase 저장 로직이 들어갈 자리
    console.log("Saving all data...", { itinerary, costs, personCount });
    setIsEditMode(false);
  };

  const addItem = (dayId: string) => {
    setItinerary((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            schedules: [
              ...day.schedules,
              {
                time: "00:00",
                title:
                  language === "ko"
                    ? "새 일정을 입력하세요"
                    : "新しい予定を入力してください",
                desc:
                  language === "ko"
                    ? "상세 설명을 입력하세요"
                    : "詳細な説明を入力してください",
                iconName: "MapPin",
                mapQuery: "",
              },
            ],
          };
        }
        return day;
      }),
    );
  };

  const updateTravelTime = (
    dayId: string,
    idx: number,
    value: string,
    isAlt: boolean = false,
  ) => {
    setItinerary((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            schedules: day.schedules.map((item, i) => {
              if (i === idx) {
                if (isAlt && item.alt) {
                  return {
                    ...item,
                    alt: { ...item.alt, nextTravelTime: value },
                  };
                }
                return { ...item, travelTime: value };
              }
              return item;
            }),
          };
        }
        return day;
      }),
    );
  };

  const togglePlanB = (dayId: string, idx: number) => {
    setItinerary((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            schedules: day.schedules.map((item, i) => {
              if (i === idx) {
                if (item.alt) {
                  const { alt, ...rest } = item;
                  setFlippedItems((prevFlipped) => {
                    const next = { ...prevFlipped };
                    delete next[`${dayId}-${idx}`];
                    return next;
                  });
                  return rest;
                }
                return {
                  ...item,
                  alt: {
                    time: item.time,
                    title: "대안 일정",
                    desc: "대안 일정을 입력하세요...",
                    iconName: item.iconName,
                    mapQuery: "",
                  },
                };
              }
              return item;
            }),
          };
        }
        return day;
      }),
    );
  };

  const updateScheduleItem = (
    dayId: string,
    idx: number,
    field: string,
    value: string,
    isAlt: boolean = false,
  ) => {
    setItinerary((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            schedules: day.schedules.map((item, i) => {
              if (i === idx) {
                if (isAlt && item.alt) {
                  return {
                    ...item,
                    alt: { ...item.alt, [field]: value },
                  };
                }
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return day;
      }),
    );
  };

  useEffect(() => {
    // 강원도 정선군 사북/고한 (하이원CC 부근) 날씨 정보 가져오기
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=37.2064&longitude=128.8351&current_weather=true",
        );
        const data = await res.json();
        const code = data.current_weather.weathercode;

        // WMO Code mapping
        if (code === 0) setWeatherEmoji("☀️");
        else if ([1, 2, 3].includes(code)) setWeatherEmoji("☁️");
        else if ([45, 48].includes(code)) setWeatherEmoji("🌫️");
        else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
          setWeatherEmoji("🌧️");
        else if ([71, 73, 75, 77, 85, 86].includes(code)) setWeatherEmoji("❄️");
        else if ([95, 96, 99].includes(code)) setWeatherEmoji("⛈️");
      } catch (e) {
        console.error("Weather fetch error", e);
      }
    };
    fetchWeather();

    // 최초 접속 시 테마 확인 (저장된 값이 없으면 기본 '라이트 모드')
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  // itinerary constant was removed and replaced by state

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (navWrapperRef.current) {
        const wrapperTop = navWrapperRef.current.getBoundingClientRect().top;
        // isSticky logic removed as it was unused
      }

      const scrollPosition = window.scrollY + 250;
      for (const day of itinerary) {
        const element = document.getElementById(`${day.id}-anchor`);
        if (element) {
          const top = element.offsetTop;
          if (
            scrollPosition >= top &&
            scrollPosition < top + element.offsetHeight
          ) {
            setActiveSection(day.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [itinerary]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`${id}-anchor`);
    if (element) {
      const offset = 160;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      window.scrollTo({
        top: elementRect - bodyRect - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="min-h-screen text-[#1a1a1a] dark:text-slate-200 pb-32 antialiased selection:bg-emerald-500/30 dark:selection:bg-emerald-500/20 relative transition-colors duration-500"
      style={{ fontFamily: '"Pretendard", system-ui, sans-serif' }}
    >
      {/* 베이스 배경색 레이어 (이미지보다 뒤에 위치) */}
      <div className="fixed inset-0 bg-[#f3f6f6] dark:bg-[#0a0c10] -z-20 transition-colors duration-500" />

      {/* 헤더 배경 이미지 영역 (글래스모피즘 적용) */}
      <div className="fixed top-0 left-0 w-full h-[500px] md:h-[700px] -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: 'url("/images/hero_bg.png")',
          }}
        />
        <div className="absolute inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-[8px]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#f3f6f6] dark:to-[#0a0c10]" />
      </div>

      <header className="max-w-6xl mx-auto px-6 pt-32 pb-8 relative z-10">
        <div className="flex items-center gap-2 text-slate-200 dark:text-slate-400 text-[11px] tracking-[0.2em] uppercase mb-6">
          <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-400 rounded-full"></span>
          <span>Kona Media Golf Event</span>
        </div>
        <p className="text-sm md:text-lg font-medium text-slate-200 dark:text-slate-300 mb-3 tracking-tight"></p>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 break-words relative filter-[drop-shadow(0_2px_12px_rgba(0,60,120,0.15))] flex flex-wrap items-center gap-x-4">
          <span className="bg-clip-text text-transparent bg-linear-to-b from-[#a3e635] to-[#10b981]">
            {language === "ko" ? "코나미디어" : "(株)コナメディア"}
          </span>{" "}
          <div className="flex items-center gap-[5px]">
            <span className="relative z-10 inline-block text-[#ffffff] dark:text-white">
              {language === "ko" ? "감사골프 행사" : "感謝ゴルフ行事"}
              <span className="absolute left-0 -bottom-[3px] md:-bottom-[6px] w-full h-[12px] md:h-[24px] bg-[#a3e635]/80 dark:bg-emerald-600/60 -z-10 rounded-sm transition-all"></span>
            </span>
            <a
              href="https://search.naver.com/search.naver?query=정선+고한읍+날씨"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:scale-110 transition-transform cursor-pointer text-4xl md:text-6xl"
              title="현재 정선 고한읍 날씨 확인 (네이버 검색)"
            >
              <span className="animate-pulse-subtle">{weatherEmoji}</span>
            </a>
          </div>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 dark:text-slate-300 max-w-2xl leading-relaxed font-light break-words">
          {language === "ko"
            ? "2026. 07. 15 - 07. 16 (1박 2일)"
            : "2026. 07. 15 - 07. 16 (1泊2日)"}
        </p>
      </header>

      {/* 스티키 네비게이션 (글래스모피즘 투명도 및 블러 강화) */}
      <div
        ref={navWrapperRef}
        className="sticky top-8 z-100 w-full flex justify-center px-2 md:px-6 mb-16 pointer-events-none"
      >
        <nav
          className="pointer-events-auto flex items-center gap-2 md:gap-6 px-3 md:px-8 py-2.5 md:py-4 rounded-full border border-white/40 dark:border-slate-700/40 backdrop-blur-[20px] shadow-[0_4px_34px_rgba(0,0,0,0.15)] dark:shadow-none transition-all max-w-[95vw] md:max-w-full overflow-visible relative"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.3) 30%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3) 30%)",
          }}
        >
          {/* 일차 탭: 내부 스크롤 허용 */}
          <div className="flex items-center gap-1 md:gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-2 py-1">
            {itinerary.map((day) => (
              <button
                key={day.id}
                onClick={() => scrollToSection(day.id)}
                onContextMenu={(e) => {
                  if (isEditMode && itinerary.length > 1) {
                    e.preventDefault();
                    setDayToDelete(day.id);
                  }
                }}
                className={`text-[12px] md:text-[14px] font-medium relative transition-colors px-1.5 md:px-2 py-1 whitespace-nowrap shrink-0 ${
                  activeSection === day.id
                    ? "text-black dark:text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1">{day.title}</div>
                {activeSection === day.id && (
                  <motion.span
                    layoutId="active-nav-indicator"
                    className="absolute bottom-0 left-0 w-full h-[3px] md:h-1 bg-emerald-500 dark:bg-emerald-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </button>
            ))}

            {isEditMode && (
              <>
                <div className="w-px h-3 md:h-4 bg-slate-400 dark:bg-slate-700/80 mx-1 shrink-0"></div>
                <div className="flex items-center gap-1 md:gap-2 ml-1 pr-1 pl-1">
                  <button
                    onClick={addDay}
                    className="p-1.5 md:p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-all"
                    title={language === "ko" ? "일차 추가" : "日次を追加"}
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={saveAllData}
                    className="p-1.5 md:p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-all"
                    title={language === "ko" ? "변경사항 저장" : "変更を保存"}
                  >
                    <Save size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 메뉴 구분선 및 메뉴 드롭다운 */}
          <div className="w-px h-3 md:h-4 bg-slate-400 dark:bg-slate-700/80 mx-1 shrink-0"></div>

          <div className="relative">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className={`p-1 md:p-1.5 shrink-0 rounded-full transition-all ${
                isNavOpen
                  ? "bg-slate-200 dark:bg-slate-800 text-black dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
              }`}
              title={language === "ko" ? "메뉴" : "メニュー"}
            >
              <MenuIcon size={18} />
            </button>

            <AnimatePresence>
              {isNavOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsNavOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-20 origin-top"
                  >
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setIsChecklistModalOpen(true);
                          setIsNavOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <ClipboardCheck size={20} className="text-green-500" />
                        {language === "ko" ? "준비물 체크" : "持ち物チェック"}
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                      <button
                        onClick={() => {
                          setIsEditMode(!isEditMode);
                          setIsNavOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                          isEditMode
                            ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {isEditMode ? (
                          <Unlock size={20} className="text-emerald-500" />
                        ) : (
                          <Lock size={20} />
                        )}
                        {isEditMode
                          ? language === "ko"
                            ? "편집 모드 종료"
                            : "編集モード終了"
                          : language === "ko"
                            ? "편집 모드 시작"
                            : "編集モード開始"}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1 md:p-1.5 shrink-0 rounded-full transition-all text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 md:w-4 md:h-4" />
            ) : (
              <Moon className="w-4 h-4 md:w-4 md:h-4" />
            )}
          </button>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-6 space-y-24 relative z-0">
        {itinerary.map((day) => (
          <section key={day.id} id={`${day.id}-anchor`} className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* 좌측: 일자 타이틀 (스크롤 시 고정되도록 sticky 적용) */}
              <div className="lg:col-span-4">
                <div className="sticky top-32">
                  <motion.div
                    style={{
                      color: isDark ? "#cbd5e1" : dayTitleTextColorLight,
                    }}
                    className="flex items-center gap-3 border-b border-white/20 dark:border-slate-800 pb-3 mb-4 transition-colors"
                  >
                    <MapPin size={18} color="currentColor" />
                    <h2 className="text-[15px] font-semibold">{day.title}</h2>
                  </motion.div>
                  <motion.h3
                    style={{ color: isDark ? "#ffffff" : dateTextColorLight }}
                    className="text-3xl font-semibold tracking-tight"
                  >
                    {day.date.split(" — ")[0]}
                    {day.date.includes(" — ") && (
                      <motion.span
                        style={{
                          color: isDark ? "#94a3b8" : eventDescTextColorLight,
                        }}
                        className="block text-xl font-semibold mt-1 tracking-normal"
                      >
                        {day.date.split(" — ")[1]}
                      </motion.span>
                    )}
                  </motion.h3>
                </div>
              </div>

              {/* 우측: 타임라인 카드 */}
              <div className="lg:col-span-8">
                {day.schedules.map((schedule, idx) => {
                  const cardKey = `${day.id}-${idx}`;
                  const isFlipped = flippedItems[cardKey];
                  const currentPlan =
                    isFlipped && schedule.alt ? schedule.alt : schedule;

                  return (
                    <div key={idx} className="relative mb-0">
                      <div
                        className="relative w-full transition-all duration-500 min-h-[140px] md:min-h-[160px]"
                        style={{
                          perspective: "1000px",
                        }}
                      >
                        <motion.div
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{
                            duration: 0.6,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                          style={{
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          {/* Front Side */}
                          <div
                            style={{ backfaceVisibility: "hidden" }}
                            className={`w-full h-full rounded-[50px] p-6 md:p-8 backdrop-blur-[20px] transition-all group relative overflow-visible border border-white/40 dark:border-slate-800/50 shadow-[0_4px_34px_rgba(0,0,0,0.08)] ${
                              isDark ? "bg-slate-900/45" : "bg-white/45"
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start">
                                {isEditMode ? (
                                  <div className="flex items-center gap-1.5 relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveIconPicker(
                                          activeIconPicker === cardKey
                                            ? null
                                            : cardKey,
                                        );
                                      }}
                                      className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all flex items-center justify-center"
                                      title="아이콘 변경"
                                    >
                                      <TravelIcon
                                        name={currentPlan.iconName}
                                        size={20}
                                      />
                                    </button>

                                    <AnimatePresence>
                                      {activeIconPicker === cardKey && (
                                        <motion.div
                                          initial={{
                                            opacity: 0,
                                            scale: 0.95,
                                            y: 5,
                                          }}
                                          animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                          }}
                                          exit={{
                                            opacity: 0,
                                            scale: 0.95,
                                            y: 5,
                                          }}
                                          className="absolute left-0 top-12 z-100 p-4 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[280px] pointer-events-auto"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <div className="grid grid-cols-5 gap-3">
                                            {TRAVEL_ICON_NAMES.map(
                                              (iconName) => (
                                                <button
                                                  key={iconName}
                                                  onClick={() => {
                                                    updateScheduleItem(
                                                      day.id,
                                                      idx,
                                                      "iconName",
                                                      iconName,
                                                      isFlipped,
                                                    );
                                                    setActiveIconPicker(null);
                                                  }}
                                                  className={`p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center ${
                                                    currentPlan.iconName ===
                                                    iconName
                                                      ? "bg-blue-100 dark:bg-blue-900/50"
                                                      : ""
                                                  }`}
                                                  title={iconName}
                                                >
                                                  <TravelIcon
                                                    name={iconName}
                                                    size={26}
                                                  />
                                                </button>
                                              ),
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                    <input
                                      type="text"
                                      value={currentPlan.time}
                                      onChange={(e) =>
                                        updateScheduleItem(
                                          day.id,
                                          idx,
                                          "time",
                                          e.target.value,
                                          isFlipped,
                                        )
                                      }
                                      className="bg-white/60 dark:bg-slate-800/60 border border-emerald-200/50 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl text-[14px] font-bold w-[105px] shadow-sm focus:ring-1 focus:ring-emerald-500 text-center focus:outline-none"
                                    />
                                  </div>
                                ) : (
                                  <span className="border border-slate-200/60 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm font-medium text-slate-600 dark:text-slate-400 text-[13.5px]">
                                    <TravelIcon
                                      name={currentPlan.iconName}
                                      size={14}
                                    />{" "}
                                    {currentPlan.time}
                                  </span>
                                )}

                                {/* Plan B 토글 버튼 (Front) - 클릭성 보장을 위해 별도 영역 */}
                                <div className="flex items-center gap-2 relative z-50">
                                  {isEditMode && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePlanB(day.id, idx);
                                      }}
                                      className={`px-3 py-1.5 rounded-full border transition-all text-[11px] font-bold flex items-center gap-1.5 pointer-events-auto ${
                                        schedule.alt
                                          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400"
                                      }`}
                                    >
                                      {schedule.alt
                                        ? "Plan B On"
                                        : "Add Plan B"}
                                      <Sparkles size={11} />
                                    </button>
                                  )}

                                  {schedule.alt && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFlippedItems((prev) => ({
                                          ...prev,
                                          [cardKey]: true,
                                        }));
                                      }}
                                      className="px-4 py-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[12px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center gap-1.5 shadow-sm pointer-events-auto"
                                    >
                                      Plan B <Sparkles size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4 mt-4">
                                <div className="flex items-center gap-3 relative mt-4">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={currentPlan.title}
                                      onChange={(e) =>
                                        updateScheduleItem(
                                          day.id,
                                          idx,
                                          "title",
                                          e.target.value,
                                          isFlipped,
                                        )
                                      }
                                      className="flex-1 bg-transparent border-b border-emerald-500/30 focus:border-emerald-500 text-xl md:text-2xl font-bold text-black dark:text-white px-0 py-1"
                                      placeholder="일정 제목"
                                    />
                                  ) : (
                                    <h4 className="text-xl md:text-2xl font-semibold text-black dark:text-white tracking-tight transition-colors">
                                      {currentPlan.title}
                                    </h4>
                                  )}

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {schedule.mapQuery && (
                                      <a
                                        href={
                                          schedule.mapUrl ||
                                          `https://m.map.naver.com/route.nhn?menu=route&ename=${encodeURIComponent(
                                            schedule.mapQuery,
                                          )}&pathType=0`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all flex items-center justify-center shrink-0 group/route gap-1"
                                        title={
                                          language === "ko"
                                            ? `${schedule.title} 길찾기 (현재 위치에서)`
                                            : `${schedule.title} 道案内 (現在地から)`
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Route
                                          size={13}
                                          className="group-hover/route:rotate-12 transition-transform"
                                        />
                                        <span className="text-[12px] font-semibold tracking-tight">
                                          {language === "ko"
                                            ? "길찾기"
                                            : "道案内"}
                                        </span>
                                      </a>
                                    )}
                                  </div>

                                  {(schedule as any).websiteUrl && (
                                    <a
                                      href={(schedule as any).websiteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all flex items-center justify-center shrink-0 gap-1"
                                      title={
                                        language === "ko"
                                          ? "공식 홈페이지 확인"
                                          : "公式ホームページ"
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className="text-[12px] font-semibold tracking-tight">
                                        운행여부 체크
                                      </span>
                                    </a>
                                  )}
                                </div>

                                {isEditMode && (
                                  <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3 group/dest focus-within:border-emerald-500/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-sm mb-4">
                                    <MapPin
                                      size={15}
                                      className="text-slate-400 group-focus-within/dest:text-emerald-500 transition-colors shrink-0"
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
                                      placeholder={
                                        language === "ko"
                                          ? "목적지 (구글 지도 검색어)"
                                          : "目的地 (Googleマップ検索語)"
                                      }
                                    />
                                  </div>
                                )}

                                {isEditMode ? (
                                  <textarea
                                    value={currentPlan.desc}
                                    onChange={(e) =>
                                      updateScheduleItem(
                                        day.id,
                                        idx,
                                        "desc",
                                        e.target.value,
                                        isFlipped,
                                      )
                                    }
                                    className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 p-3 mt-2 min-h-[80px]"
                                    placeholder="상세 내용을 입력하세요..."
                                  />
                                ) : (
                                  <p className="text-[15px] md:text-[16px] text-slate-800 dark:text-slate-200 leading-relaxed break-words transition-colors whitespace-pre-line font-medium">
                                    {currentPlan.desc}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Back Side (Plan B) */}
                          {schedule.alt && (
                            <div
                              style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                position: "absolute",
                                top: 0,
                                left: 0,
                              }}
                              className={`w-full h-full rounded-[50px] p-6 md:p-8 backdrop-blur-[20px] transition-all group relative overflow-visible border border-white/40 dark:border-slate-800/50 shadow-[0_4px_34px_rgba(0,0,0,0.08)] ${
                                isDark ? "bg-slate-900/45" : "bg-white/45"
                              }`}
                            >
                              <div>
                                <div className="space-y-4 relative z-10">
                                  <div className="flex justify-between items-start">
                                    {isEditMode ? (
                                      <div className="flex items-center gap-1.5 relative">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveIconPicker(
                                              activeIconPicker === cardKey
                                                ? null
                                                : cardKey,
                                            );
                                          }}
                                          className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all flex items-center justify-center"
                                          title="아이콘 변경"
                                        >
                                          <TravelIcon
                                            name={currentPlan.iconName}
                                            size={20}
                                          />
                                        </button>

                                        <AnimatePresence>
                                          {activeIconPicker === cardKey && (
                                            <motion.div
                                              initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                                y: 5,
                                              }}
                                              animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                              }}
                                              exit={{
                                                opacity: 0,
                                                scale: 0.95,
                                                y: 5,
                                              }}
                                              className="absolute left-0 top-12 z-100 p-4 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 w-[280px] pointer-events-auto"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              <div className="grid grid-cols-5 gap-3">
                                                {TRAVEL_ICON_NAMES.map(
                                                  (iconName) => (
                                                    <button
                                                      key={iconName}
                                                      onClick={() => {
                                                        updateScheduleItem(
                                                          day.id,
                                                          idx,
                                                          "iconName",
                                                          iconName,
                                                          isFlipped,
                                                        );
                                                        setActiveIconPicker(
                                                          null,
                                                        );
                                                      }}
                                                      className={`p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors flex items-center justify-center ${currentPlan.iconName === iconName ? "bg-emerald-100 dark:bg-emerald-900/50" : ""}`}
                                                      title={iconName}
                                                    >
                                                      <TravelIcon
                                                        name={iconName}
                                                        size={26}
                                                      />
                                                    </button>
                                                  ),
                                                )}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                        <input
                                          type="text"
                                          value={currentPlan.time}
                                          onChange={(e) =>
                                            updateScheduleItem(
                                              day.id,
                                              idx,
                                              "time",
                                              e.target.value,
                                              isFlipped,
                                            )
                                          }
                                          className="bg-white/60 dark:bg-slate-800/60 border border-emerald-200/50 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl text-[14px] font-bold w-[105px] shadow-sm focus:ring-1 focus:ring-emerald-500 text-center focus:outline-none"
                                        />
                                      </div>
                                    ) : (
                                      <span className="border border-slate-200/60 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm font-medium text-slate-600 dark:text-slate-400 text-[13.5px]">
                                        <TravelIcon
                                          name={schedule.alt.iconName}
                                          size={14}
                                        />{" "}
                                        {schedule.alt.time || schedule.time}
                                      </span>
                                    )}

                                    {/* Plan B 토글 버튼 (Back -> A) */}
                                    <div className="flex items-center gap-2">
                                      {isEditMode && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePlanB(day.id, idx);
                                          }}
                                          className="px-3 py-1.5 rounded-full border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[11px] font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-1"
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
                                        className="px-4 py-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[12px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center gap-1.5 shadow-sm"
                                      >
                                        <ArrowLeft size={12} /> Plan A
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 relative mt-4">
                                    {isEditMode ? (
                                      <input
                                        type="text"
                                        value={currentPlan.title}
                                        onChange={(e) =>
                                          updateScheduleItem(
                                            day.id,
                                            idx,
                                            "title",
                                            e.target.value,
                                            isFlipped,
                                          )
                                        }
                                        className="flex-1 bg-transparent border-b border-emerald-500/30 focus:border-emerald-500 text-xl md:text-2xl font-bold text-black dark:text-white px-0 py-1"
                                        placeholder="일정 제목"
                                      />
                                    ) : (
                                      <h4 className="text-xl md:text-2xl font-semibold text-black dark:text-white tracking-tight transition-colors">
                                        {currentPlan.title}
                                      </h4>
                                    )}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {schedule.alt.mapQuery && (
                                        <a
                                          href={
                                            schedule.alt.mapUrl ||
                                            `https://m.map.naver.com/route.nhn?menu=route&ename=${encodeURIComponent(
                                              schedule.alt.mapQuery,
                                            )}&pathType=0`
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all flex items-center justify-center shrink-0 group/route gap-1"
                                          title={
                                            language === "ko"
                                              ? `${schedule.alt.title} 길찾기 (현재 위치에서)`
                                              : `${schedule.alt.title} 道案内 (現在地から)`
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Route
                                            size={13}
                                            className="group-hover/route:rotate-12 transition-transform"
                                          />
                                          <span className="text-[12px] font-semibold tracking-tight">
                                            {language === "ko"
                                              ? "길찾기"
                                              : "道案内"}
                                          </span>
                                        </a>
                                      )}
                                    </div>
                                  </div>

                                  {isEditMode && (
                                    <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3 group/dest focus-within:border-emerald-500/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-sm mb-4">
                                      <MapPin
                                        size={15}
                                        className="text-slate-400 group-focus-within/dest:text-emerald-500 transition-colors shrink-0"
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

                                  {isEditMode ? (
                                    <textarea
                                      value={currentPlan.desc}
                                      onChange={(e) =>
                                        updateScheduleItem(
                                          day.id,
                                          idx,
                                          "desc",
                                          e.target.value,
                                          isFlipped,
                                        )
                                      }
                                      className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 p-3 mt-2 min-h-[80px]"
                                      placeholder="상세 내용을 입력하세요..."
                                    />
                                  ) : (
                                    <p className="text-[15px] md:text-[16px] text-slate-800 dark:text-slate-200 leading-relaxed break-words transition-colors whitespace-pre-line font-medium">
                                      {schedule.alt.desc}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* 하단 이동시간 (travelTime) */}
                      {(() => {
                        const dayData = itinerary.find((d) => d.id === day.id);
                        const nextSchedule = dayData?.schedules[idx + 1];
                        const nextCardKey = `${day.id}-${idx + 1}`;

                        let displayTravelTime = schedule.travelTime;

                        // 1. 현재 카드가 뒤집혔을 때 (본인의 nextTravelTime 적용)
                        if (
                          flippedItems[cardKey] &&
                          schedule.alt?.nextTravelTime
                        ) {
                          displayTravelTime = schedule.alt.nextTravelTime;
                        }
                        // 2. 다음 카드가 뒤집혔을 때 (다음 카드의 prevTravelTime 적용)
                        else if (
                          nextSchedule?.alt?.prevTravelTime &&
                          flippedItems[nextCardKey]
                        ) {
                          displayTravelTime = nextSchedule.alt.prevTravelTime;
                        }

                        const isLastItem =
                          idx === (dayData?.schedules.length || 0) - 1;
                        if (!displayTravelTime && !isEditMode)
                          return <div className="h-10" />;
                        if (isLastItem && !isEditMode) return null;
                        if (isLastItem && isEditMode)
                          return <div className="h-4" />;

                        return (
                          <div className="flex items-center justify-center gap-2 py-4 md:py-6 px-0 md:px-4 text-[12px] md:text-[13px] text-slate-500 dark:text-slate-400">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 whitespace-nowrap backdrop-blur-sm text-center min-w-[120px]">
                              {isEditMode ? (
                                <input
                                  type="text"
                                  value={displayTravelTime || ""}
                                  onChange={(e) =>
                                    updateTravelTime(
                                      day.id,
                                      idx,
                                      e.target.value,
                                      flippedItems[cardKey],
                                    )
                                  }
                                  className={`w-full bg-transparent border-none focus:ring-0 text-center text-slate-600 dark:text-slate-400 font-medium p-0 ${
                                    !displayTravelTime
                                      ? "opacity-40 italic"
                                      : ""
                                  }`}
                                  placeholder="이동 시간 입력..."
                                />
                              ) : (
                                <>
                                  {displayTravelTime?.includes("도보") ? (
                                    <PersonStanding
                                      size={12}
                                      className="opacity-70 shrink-0"
                                    />
                                  ) : displayTravelTime?.includes("비행") ? (
                                    <Plane
                                      size={12}
                                      className="opacity-70 shrink-0"
                                    />
                                  ) : (
                                    <Car
                                      size={12}
                                      className="opacity-70 shrink-0"
                                    />
                                  )}
                                  <span className="font-medium">
                                    {displayTravelTime}
                                  </span>
                                </>
                              )}
                              {!isEditMode &&
                                nextSchedule &&
                                (schedule.mapQuery || schedule.mapUrl) &&
                                (nextSchedule.mapQuery ||
                                  nextSchedule.mapUrl) && (
                                  <a
                                    href={
                                      (flippedItems[cardKey] &&
                                      schedule.alt?.routeUrl
                                        ? schedule.alt.routeUrl
                                        : schedule.routeUrl) ||
                                      `https://m.map.naver.com/route.nhn?menu=route&sname=${encodeURIComponent(
                                        (flippedItems[cardKey] &&
                                        schedule.alt?.mapQuery
                                          ? schedule.alt.mapQuery
                                          : schedule.mapQuery) || "",
                                      )}&ename=${encodeURIComponent(
                                        (flippedItems[nextCardKey] &&
                                        nextSchedule.alt?.mapQuery
                                          ? nextSchedule.alt.mapQuery
                                          : nextSchedule.mapQuery) || "",
                                      )}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center group/route-btn"
                                    title="경로 보기 (네이버 지도)"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Route
                                      size={14}
                                      className="text-emerald-500 group-hover/route-btn:scale-110 transition-transform"
                                    />
                                  </a>
                                )}
                            </span>

                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}

                {/* 일정 추가 버튼 (편집 모드에서만 노출) */}
                {isEditMode && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addItem(day.id)}
                    className="w-full py-6 md:py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] text-slate-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all flex flex-col items-center justify-center gap-3 mt-4 mb-16 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      <Plus size={20} />
                    </div>
                    <span className="font-semibold text-[15px]">
                      {language === "ko"
                        ? "일정 추가하기"
                        : "スケジュールを追加"}
                    </span>
                  </motion.button>
                )}
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* 비용 모달 */}
      <AnimatePresence>
        {isCostModalOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCostModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800"
            >
              <div className="p-6 md:p-10 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between mb-8 md:mb-10 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold text-black dark:text-white tracking-tight">
                        여행 경비 내역
                      </h2>
                      <p className="text-[12px] md:text-sm text-slate-500 font-medium mt-0.5">
                        성인 {personCount}인 기준 예상 비용
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCostModalOpen(false)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <BudgetEditor
                    initialCosts={costs}
                    personCount={personCount}
                    setPersonCount={setPersonCount}
                    budgetNote={budgetNote}
                    setBudgetNote={setBudgetNote}
                    language={language}
                    onSave={(newCosts, newNote) => {
                      setCosts(newCosts);
                      if (newNote !== undefined) setBudgetNote(newNote);
                      // Supabase update logic here
                    }}
                    onOpenFoodDetail={() => setIsFoodDetailOpen(true)}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 일차 삭제 확인 모달 */}
      <AnimatePresence>
        {dayToDelete && (
          <div className="fixed inset-0 z-300 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDayToDelete(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xs bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                일정 삭제
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                선택하신 일차의 모든 일정이 삭제됩니다. 정말 삭제하시겠습니까?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    removeDay(dayToDelete);
                    setDayToDelete(null);
                  }}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
                >
                  삭제하기
                </button>
                <button
                  onClick={() => setDayToDelete(null)}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 식비 상세 모달 */}

      <AnimatePresence>
        {isFoodDetailOpen && (
          <div className="fixed inset-0 z-300 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFoodDetailOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Utensils size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-black dark:text-white tracking-tight">
                      식비 상세 예산
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsFoodDetailOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700/50">
                        <th className="px-4 py-3.5 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">
                          날짜
                        </th>
                        <th className="px-4 py-3.5 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">
                          구분
                        </th>
                        <th className="px-4 py-3.5 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">
                          장소 및 메뉴
                        </th>
                        <th className="px-4 py-3.5 text-[13px] font-semibold text-slate-400 uppercase tracking-wider text-right">
                          예상 비용 (엔)
                        </th>
                        <th className="px-4 py-3.5 text-[13px] font-semibold text-slate-400 uppercase tracking-wider text-right">
                          한화 환산 (약)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {[
                        {
                          day: "1일차",
                          type: "기내식",
                          place: "티웨이항공 사전주문",
                          yen: "-",
                          krw: "84,0000",
                        },
                        {
                          day: "1일차",
                          type: "저녁/야식",
                          place: "마트(파르코) & 편의점(로손)",
                          yen: "약 15,000",
                          krw: "약 141,750",
                        },
                        {
                          day: "2일차",
                          type: "점심",
                          place: "킨치치소바 (소바)",
                          yen: "약 10,000",
                          krw: "약 94,500",
                        },
                        {
                          day: "2일차",
                          type: "저녁",
                          place: "카이센 밧텐 (해산물)",
                          yen: "약 23,000",
                          krw: "약 217,350",
                        },
                        {
                          day: "3일차",
                          type: "점심",
                          place: "하마스시 (회전초밥)",
                          yen: "약 17,000",
                          krw: "약 160,650",
                        },
                        {
                          day: "3일차",
                          type: "저녁",
                          place: "야키니쿠 킹 (무한리필)",
                          yen: "약 32,000",
                          krw: "약 302,400",
                        },
                        {
                          day: "4일차",
                          type: "기타",
                          place: "간식 및 공항 잔돈 지출",
                          yen: "약 5,000",
                          krw: "약 47,250",
                        },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className="even:bg-slate-50/50 dark:even:bg-white/2 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                            {row.day}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-slate-600 dark:text-slate-300 font-semibold">
                            {row.type}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-slate-700 dark:text-slate-200 font-medium">
                            {row.place}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-right tabular-nums text-slate-900 dark:text-white font-semibold">
                            {row.yen}엔
                          </td>
                          <td className="px-4 py-3 text-[13px] text-right tabular-nums text-blue-600 dark:text-blue-400 font-semibold">
                            {row.krw}원
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-orange-500/5 dark:bg-orange-500/10">
                        <td
                          colSpan={3}
                          className="px-4 py-4 text-[15px] font-semibold text-orange-600 dark:text-orange-400"
                        >
                          식비 합계
                        </td>
                        <td className="px-4 py-4 text-[15px] text-right tabular-nums font-semibold text-orange-600 dark:text-orange-400">
                          -
                        </td>
                        <td className="px-4 py-4 text-[15px] text-right tabular-nums font-black text-orange-600 dark:text-orange-400 underline decoration-2 underline-offset-4">
                          약 380,000원
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 text-[13px] text-slate-800 leading-relaxed whitespace-pre-line">
                  {`* 위 금액은 8인 가족 기준의 대략적인 예상치이며, 실제 주문 메뉴와 환율에 따라 차이가 발생할 수 있습니다.\n(적용 환율: 100엔 = 929원 기준 계산)`}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 기타 체크리스트 모달 */}
      <AnimatePresence>
        {isChecklistModalOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChecklistModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-green-50/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[40px] shadow-2xl overflow-hidden border border-green-100/50 dark:border-slate-800"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                      <ClipboardCheck size={20} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-black dark:text-white tracking-tight">
                        여행 준비물 & 정보
                      </h2>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">
                        현지에서 확인이 필요한 중요 항목
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChecklistModalOpen(false)}
                    className="p-2.5 hover:bg-green-100/50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "개인 선케어 및 보호장구",
                      value: "자외선 차단 선크림, 골프 모자, 선글라스, 팔토시 등",
                      icon: <Sun size={20} />,
                    },
                    {
                      label: "골프 소모품 준비",
                      value: "넉넉한 골프공, 골프장갑, 티(Tee), 볼마커 등",
                      icon: <Sparkles size={20} />,
                    },
                    {
                      label: "골프 클럽 및 거리측정기",
                      value: "개인 골프클럽 백, 레인지 파인더(거리측정기) 등",
                      icon: <Route size={20} />,
                    },
                  ].map(
                    (
                      item: {
                        label: string;
                        value: string;
                        icon: React.ReactNode;
                        link?: string;
                      },
                      i,
                    ) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800/50 rounded-3xl border border-green-100/50 dark:border-slate-800 shadow-sm"
                      >
                        <div className="mt-1 text-green-500">{item.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-[13px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                            {item.label}
                          </h4>
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[15px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              {item.value} <ExternalLink size={12} />
                            </a>
                          ) : (
                            <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-8 p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 space-y-2">
                  <p className="text-[15px] text-blue-700/80 dark:text-blue-400/80 leading-relaxed font-medium">
                    * 하이원CC 프런트: 033-590-7300
                  </p>
                  <p className="text-[15px] text-blue-700/80 dark:text-blue-400/80 leading-relaxed font-medium">
                    * 하이원리조트 대표번호: 1588-7789
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-4xl mx-auto px-6 py-20 mt-24 border-t border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-[6px] bg-black dark:bg-white text-white dark:text-black text-[13px] font-black tracking-tighter">
                KONAMEDIA
              </span>
              <span className="text-xs font-semibold text-slate-400 tracking-tight">
                2026 Kona Media Golf Event
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              &copy; 하이원CC 감사골프 행사 가이드@2026
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {["React", "Next.js", "Tailwind", "Framer Motion", "Lucide"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 transition-colors hover:border-slate-400"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default High1GolfEvent;
