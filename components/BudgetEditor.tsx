import React, { useState, useEffect, useCallback } from "react";
import { CostItem } from "@/types/itinerary";
import { Plus, Trash2, Save, Edit2, Check, Users, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BudgetEditorProps {
  initialCosts: CostItem[];
  onSave: (costs: CostItem[], note?: string) => void;
  personCount: number;
  setPersonCount: (count: number) => void;
  budgetNote: string;
  setBudgetNote: (note: string) => void;
  language: "ko" | "ja";
  onOpenFoodDetail?: () => void;
}

interface EditableCostItem extends CostItem {
  tempId: string;
}

export const BudgetEditor: React.FC<BudgetEditorProps> = ({
  initialCosts,
  onSave,
  personCount,
  setPersonCount,
  budgetNote,
  setBudgetNote,
  language,
  onOpenFoodDetail,
}) => {
  const [costs, setCosts] = useState<EditableCostItem[]>(() =>
    initialCosts.map((c, i) => ({ ...c, tempId: `row-${i}-${Date.now()}` })),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [localNote, setLocalNote] = useState(budgetNote);

  const formatNumber = (val: string | number) => {
    if (val === undefined || val === null || val === "") return "";
    let num = String(val).replace(/[^0-9]/g, "");
    if (num.length > 1) {
      num = num.replace(/^0+/, "");
      if (num === "") num = "0";
    }
    if (!num) return "0";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (val: string) => {
    if (!val) return 0;
    return parseInt(val.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const updateCalculations = useCallback(
    (currentCosts: EditableCostItem[], count: number) => {
      let total = 0;
      currentCosts.forEach((row) => {
        if (!row.isTotal && !row.isPerPerson) {
          total += parseNumber(row.price);
        }
      });
      const perPerson = Math.round(total / count);
      return currentCosts.map((row) => {
        if (row.isTotal) return { ...row, price: formatNumber(total) };
        if (row.isPerPerson) return { ...row, price: formatNumber(perPerson) };
        return row;
      });
    },
    [],
  );

  useEffect(() => {
    setCosts((prev) => updateCalculations(prev, personCount));
  }, [personCount, updateCalculations]);

  const handleCellChange = (
    index: number,
    field: keyof CostItem,
    value: string,
  ) => {
    setCosts((prev) => {
      let newCosts = [...prev];
      if (field === "price") {
        newCosts[index] = { ...newCosts[index], [field]: formatNumber(value) };
      } else {
        newCosts[index] = { ...newCosts[index], [field]: value };
      }
      return updateCalculations(newCosts, personCount);
    });
  };

  const handlePersonCountChange = (value: string) => {
    const count = Math.max(1, parseInt(value, 10) || 1);
    setPersonCount(count);
  };

  const addRow = () => {
    setCosts((prev) => {
      const newCosts = [...prev];
      const firstTotalIdx = newCosts.findIndex(
        (c) => c.isTotal || c.isPerPerson,
      );
      const newItem: EditableCostItem = {
        item: "",
        price: "0",
        note: "",
        tempId: `new-${Date.now()}`,
      };
      if (firstTotalIdx !== -1) newCosts.splice(firstTotalIdx, 0, newItem);
      else newCosts.push(newItem);
      return updateCalculations(newCosts, personCount);
    });
  };

  const removeRow = (index: number) => {
    setCosts((prev) => {
      const newCosts = prev.filter((_, i) => i !== index);
      return updateCalculations(newCosts, personCount);
    });
  };

  const saveChanges = () => {
    const finalCosts = costs.map(({ tempId, ...rest }) => rest);
    onSave(finalCosts, localNote);
    setBudgetNote(localNote);
    setIsEditing(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-[15px] md:text-lg font-semibold text-slate-800 dark:text-slate-200">
            {language === "ko" ? "예상 총 비용" : "予想総費用"}
          </h3>
          <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">
            {language === "ko" ? "자동 계산 기능 활성화됨" : "自動計算機能有効"}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Users size={14} className="text-slate-500" />
            <input
              type="number"
              min="1"
              value={personCount}
              onChange={(e) => handlePersonCountChange(e.target.value)}
              disabled={!isEditing}
              className="w-8 bg-transparent border-none focus:ring-0 text-[13px] font-bold text-blue-600 dark:text-blue-400 p-0 text-center disabled:opacity-70"
            />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {language === "ko" ? "명" : "名"}
            </span>
          </div>

          <div className="flex gap-1.5">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs md:text-sm transition-all shadow-lg shadow-blue-500/20"
              >
                <Edit2 size={14} /> {language === "ko" ? "편집" : "編集"}
              </button>
            ) : (
              <>
                <button
                  onClick={addRow}
                  className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all"
                  title="행 추가"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={saveChanges}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs md:text-sm transition-all shadow-lg shadow-green-500/20"
                >
                  <Check size={14} /> {language === "ko" ? "저장" : "保存"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 영역: 모바일 최적화 */}
      <div className="bg-white dark:bg-slate-800/30 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/50 shadow-sm mb-4">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700/50">
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider w-[35%]">
                {language === "ko" ? "항목" : "項目"}
              </th>
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider w-[30%] text-right">
                {language === "ko" ? "금액" : "金額"}
              </th>
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider w-[35%]">
                {language === "ko" ? "비고" : "備考"}
              </th>
              {isEditing && (
                <th className="px-2 py-3 text-[10px] md:text-xs font-semibold text-slate-400 uppercase w-10 text-center"></th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            <AnimatePresence initial={false}>
              {costs.map((row, idx) => (
                <motion.tr
                  key={row.tempId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`${
                    row.isTotal || row.isPerPerson
                      ? "bg-blue-500/5 dark:bg-blue-500/10 font-bold"
                      : "hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  }`}
                >
                  <td className="px-3 md:px-6 py-2 md:py-3 overflow-hidden">
                    {isEditing && !row.isTotal && !row.isPerPerson ? (
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) =>
                          handleCellChange(idx, "item", e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:ring-1 focus:ring-blue-500 text-[11px] md:text-sm"
                        placeholder={language === "ko" ? "항목" : "項目"}
                      />
                    ) : (
                      <span
                        className={`block truncate text-[11px] md:text-[14px] ${row.isTotal || row.isPerPerson ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {row.item}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-3 text-right">
                    {isEditing && !row.isTotal && !row.isPerPerson ? (
                      <input
                        type="text"
                        value={row.price}
                        onChange={(e) =>
                          handleCellChange(idx, "price", e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:ring-1 focus:ring-blue-500 text-[11px] md:text-sm text-right tabular-nums font-semibold"
                        placeholder="0"
                      />
                    ) : (
                      <span
                        className={`text-[11px] md:text-[14px] tabular-nums ${row.isTotal || row.isPerPerson ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white font-medium"}`}
                      >
                        {row.price || "0"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-3 overflow-hidden">
                    {isEditing && !row.isTotal && !row.isPerPerson ? (
                      <input
                        type="text"
                        value={row.note}
                        onChange={(e) =>
                          handleCellChange(idx, "note", e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:ring-1 focus:ring-blue-500 text-[11px] md:text-sm"
                        placeholder={language === "ko" ? "메모" : "メモ"}
                      />
                    ) : (
                      <span className="block truncate text-slate-500 text-[10px] md:text-[13px]">
                        {(row.note === "상세내역" || row.note === "詳細内訳") ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (onOpenFoodDetail) onOpenFoodDetail();
                            }}
                            className="text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors font-medium"
                          >
                            {row.note}
                          </button>
                        ) : (
                          row.note
                        )}
                      </span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="px-2 py-2 md:py-3 text-center">
                      {!row.isTotal && !row.isPerPerson && (
                        <button
                          onClick={() => removeRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 안내 문구 섹션 */}
      <div className="p-3 md:p-5 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl md:rounded-[32px] border border-amber-100/50 dark:border-amber-900/20">
        <div className="flex items-start gap-2 md:gap-3">
          <Info size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="w-full">
            {isEditing ? (
              <textarea
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
                className="w-full bg-white dark:bg-slate-800/50 border-amber-200 dark:border-amber-900/30 rounded-xl text-[11px] md:text-[13px] text-slate-700 dark:text-slate-300 p-2 md:p-3 focus:ring-amber-500 focus:border-amber-500"
                rows={2}
                placeholder={
                  language === "ko" ? "안내 문구 입력..." : "案内文を入力..."
                }
              />
            ) : (
              <p className="text-[11px] md:text-[13px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium whitespace-pre-line">
                {budgetNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
