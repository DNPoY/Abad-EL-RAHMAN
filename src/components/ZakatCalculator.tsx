import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calculator, Coins, Landmark, Banknote, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ZakatCalculator() {
  const { language } = useLanguage();

  const [goldGrams, setGoldGrams] = useState<number | "">("");
  const [goldPrice, setGoldPrice] = useState<number | "">("");
  
  const [silverGrams, setSilverGrams] = useState<number | "">("");
  const [silverPrice, setSilverPrice] = useState<number | "">("");

  const [cash, setCash] = useState<number | "">("");
  const [debts, setDebts] = useState<number | "">("");

  const calculateTotalWealth = () => {
    const goldValue = (Number(goldGrams) || 0) * (Number(goldPrice) || 0);
    const silverValue = (Number(silverGrams) || 0) * (Number(silverPrice) || 0);
    const cashValue = Number(cash) || 0;
    const debtValue = Number(debts) || 0;

    return Math.max(0, goldValue + silverValue + cashValue - debtValue);
  };

  const calculateNisab = () => {
    // Nisab is usually 85g of gold or 595g of silver
    const goldNisab = 85 * (Number(goldPrice) || 0);
    const silverNisab = 595 * (Number(silverPrice) || 0);
    
    // Choose the lowest non-zero Nisab to be safe
    if (goldNisab > 0 && silverNisab > 0) return Math.min(goldNisab, silverNisab);
    if (goldNisab > 0) return goldNisab;
    if (silverNisab > 0) return silverNisab;
    
    // Default fallback if prices not entered
    return 0; 
  };

  const totalWealth = calculateTotalWealth();
  const nisab = calculateNisab();
  const isEligible = nisab > 0 ? totalWealth >= nisab : totalWealth > 0;
  const zakatAmount = isEligible ? totalWealth * 0.025 : 0;

  return (
    <div className="space-y-6 pb-24" dir={language === "ar" ? "rtl" : "ltr"} role="region" aria-label={language === "ar" ? "حاسبة الزكاة" : "Zakat Calculator"}>
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-emerald-deep/5 pt-8">
        <h2 className="text-2xl font-bold text-emerald-deep text-center font-amiri mb-2 flex flex-col items-center gap-2" tabIndex={0}>
          <Calculator className="w-8 h-8 text-gold-matte" aria-hidden="true" />
          {language === "ar" ? "حاسبة الزكاة" : "Zakat Calculator"}
        </h2>
        <p className="text-center text-emerald-deep/70 text-sm mb-6 max-w-md mx-auto">
          {language === "ar"
            ? "احسب زكاة مالك بدقة. النصاب هو ما يعادل 85 جراماً من الذهب أو 595 جراماً من الفضة."
            : "Calculate your Zakat accurately. Nisab is equivalent to 85g of gold or 595g of silver."}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(9,66,49,0.05)] border border-emerald-deep/5 space-y-6">
        {/* Cash Section */}
        <div className="space-y-4" role="group" aria-labelledby="cash-heading">
          <h3 id="cash-heading" className="text-lg font-bold text-emerald-deep flex items-center gap-2" tabIndex={0}>
            <Banknote className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            {language === "ar" ? "السيولة النقدية" : "Cash & Savings"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cash-input" className="block text-sm font-medium text-emerald-900/80 mb-1">
                {language === "ar" ? "المدخرات النقدية" : "Total Cash/Savings"}
              </label>
              <input
                id="cash-input"
                type="number"
                min="0"
                value={cash}
                onChange={(e) => setCash(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="debts-input" className="block text-sm font-medium text-emerald-900/80 mb-1">
                {language === "ar" ? "الديون التي عليك (تخصم)" : "Debts/Liabilities (Subtracted)"}
              </label>
              <input
                id="debts-input"
                type="number"
                min="0"
                value={debts}
                onChange={(e) => setDebts(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none text-red-900"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-emerald-deep/10"></div>

        {/* Gold Section */}
        <div className="space-y-4" role="group" aria-labelledby="gold-heading">
          <h3 id="gold-heading" className="text-lg font-bold text-emerald-deep flex items-center gap-2" tabIndex={0}>
            <Coins className="w-5 h-5 text-yellow-500" aria-hidden="true" />
            {language === "ar" ? "الذهب (عيار 24)" : "Gold (24k)"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gold-grams" className="block text-sm font-medium text-emerald-900/80 mb-1">
                {language === "ar" ? "الوزن (بالجرام)" : "Weight (Grams)"}
              </label>
              <input
                id="gold-grams"
                type="number"
                min="0"
                value={goldGrams}
                onChange={(e) => setGoldGrams(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="gold-price" className="block text-sm font-medium text-emerald-900/80 mb-1">
                {language === "ar" ? "سعر الجرام الحالي" : "Current Price per Gram"}
              </label>
              <input
                id="gold-price"
                type="number"
                min="0"
                value={goldPrice}
                onChange={(e) => setGoldPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-emerald-deep/10"></div>

        {/* Silver Section */}
        <div className="space-y-4" role="group" aria-labelledby="silver-heading">
          <h3 id="silver-heading" className="text-lg font-bold text-emerald-deep flex items-center gap-2" tabIndex={0}>
            <Landmark className="w-5 h-5 text-slate-400" aria-hidden="true" />
            {language === "ar" ? "الفضة" : "Silver"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="silver-grams" className="block text-sm font-medium text-emerald-900/80 mb-1">
                {language === "ar" ? "الوزن (بالجرام)" : "Weight (Grams)"}
              </label>
              <input
                id="silver-grams"
                type="number"
                min="0"
                value={silverGrams}
                onChange={(e) => setSilverGrams(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="silver-price" className="block text-sm font-medium text-emerald-900/80 mb-1">
                {language === "ar" ? "سعر الجرام الحالي" : "Current Price per Gram"}
              </label>
              <input
                id="silver-price"
                type="number"
                min="0"
                value={silverPrice}
                onChange={(e) => setSilverPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-emerald-deep text-white rounded-3xl p-6 shadow-xl relative overflow-hidden" aria-live="polite">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-matte/20 rounded-full blur-xl -ml-10 -mb-10" aria-hidden="true"></div>
        
        <div className="relative z-10 space-y-4 text-center">
          <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2">
            <span className="text-white/80">{language === "ar" ? "إجمالي الثروة" : "Total Wealth"}</span>
            <span className="font-bold text-xl">{totalWealth.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl mb-4 text-sm">
             <div className="flex items-center gap-1">
               <span className="text-white/70">{language === "ar" ? "قيمة النصاب" : "Nisab Value"}</span>
               <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-white/50" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{language === "ar" ? "أقل مبلغ تجب فيه الزكاة (يعتمد على سعر الذهب أو الفضة المكتوب أعلى)" : "Minimum amount eligible for Zakat (based on Gold/Silver price provided)"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
             </div>
            <span className="font-medium">{nisab > 0 ? nisab.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "-"}</span>
          </div>

          <div className="pt-4 border-t border-white/10">
            {nisab === 0 && totalWealth > 0 ? (
              <p className="text-yellow-200/90 text-sm mb-2">
                {language === "ar" ? "يرجى كتابة سعر جرام الذهب أو الفضة لمعرفة النصاب." : "Please enter Gold or Silver price to calculate Nisab."}
              </p>
            ) : !isEligible && totalWealth > 0 ? (
              <p className="text-yellow-200/90 text-sm mb-2">
                {language === "ar" ? "ثروتك لم تبلغ النصاب، لا تجب عليك الزكاة." : "Your wealth is below Nisab. Zakat is not obligatory."}
              </p>
            ) : null}
            
            <h3 className="text-lg text-white/90 mb-1">{language === "ar" ? "الزكاة المستحقة (2.5%)" : "Obligatory Zakat (2.5%)"}</h3>
            <p className="text-4xl font-bold text-gold-matte font-sans">
              {zakatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
