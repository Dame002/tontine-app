import { TrendingUp, Trophy, BarChart2, ScrollText, Zap, Radio, Banknote } from "lucide-react";
import type { Tontine } from "../../types";
import { fmt } from "../../utils";
import { Av, Card, CHead } from "../ui";

export const Historique = ({ t }: { t: Tontine }) => {
  const totalDist = t.historique.reduce((s, h) => s + h.montant, 0);
  const totalColl = t.membres.length * t.montant * t.cycleActuel;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-3xl p-4" style={{ background: "#d1fae5" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} strokeWidth={2.5} color="#059669" />
            <p className="text-xs font-bold text-gray-500">Total collecté</p>
          </div>
          <p className="text-lg font-black text-emerald-700 leading-tight">{fmt(totalColl)}</p>
        </div>
        <div className="rounded-3xl p-4" style={{ background: "#ede9fe" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy size={14} strokeWidth={2.5} color="#7c3aed" />
            <p className="text-xs font-bold text-gray-500">Total distribué</p>
          </div>
          <p className="text-lg font-black text-purple-700 leading-tight">{fmt(totalDist)}</p>
        </div>
        <div className="rounded-3xl p-4 hidden md:block" style={{ background: "#dbeafe" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart2 size={14} strokeWidth={2.5} color="#1d4ed8" />
            <p className="text-xs font-bold text-gray-500">Cycles terminés</p>
          </div>
          <p className="text-lg font-black text-blue-700 leading-tight">{t.historique.length}</p>
        </div>
        <div className="rounded-3xl p-4 hidden md:block" style={{ background: "#fef3c7" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} strokeWidth={2.5} color="#d97706" />
            <p className="text-xs font-bold text-gray-500">Restants</p>
          </div>
          <p className="text-lg font-black text-amber-700 leading-tight">{t.totalCycles - t.historique.length}</p>
        </div>
      </div>

      {/* 2-col on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-5 md:space-y-0">
        {/* Progress card */}
        <Card>
          <CHead Icon={BarChart2} titre={t.nom} sub={`Cycle ${t.cycleActuel}/${t.totalCycles}`} iconColor={t.couleur} />
          <div className="p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 font-semibold">Avancement</span>
              <span className="font-black" style={{ color: t.couleur }}>{Math.round((t.cycleActuel / t.totalCycles) * 100)}%</span>
            </div>
            <div className="w-full rounded-full h-3 mb-4" style={{ background: "#e5e7eb" }}>
              <div className="h-3 rounded-full" style={{ width: `${(t.cycleActuel / t.totalCycles) * 100}%`, background: t.couleur }} />
            </div>
            <div className="space-y-2">
              {Array.from({ length: t.totalCycles }).map((_, i) => {
                const num = i + 1;
                const h = t.historique.find(x => x.cycle === num);
                const actuel = num === t.cycleActuel;
                const passe = num < t.cycleActuel;
                return (
                  <div key={num} className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: actuel ? `${t.couleur}12` : passe ? "#f8fafc" : "#fafafa", border: `1.5px solid ${actuel ? t.couleur + "40" : "#f0f0f0"}`, opacity: !passe && !actuel ? 0.4 : 1 }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                      style={{ background: actuel ? t.couleur : passe ? "#e5e7eb" : "#f3f4f6", color: actuel ? "white" : "#6b7280" }}>{num}</div>
                    {h ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Av i={h.avatar} c={h.couleur} s={28} />
                        <div className="flex-1">
                          <p className="text-xs font-black text-gray-900">{h.beneficiaire}</p>
                          <p className="text-[10px] text-gray-400">{h.date}</p>
                        </div>
                        <span className="text-xs font-black text-emerald-600">{fmt(h.montant)}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 font-semibold flex-1">{actuel ? "Cycle actuel" : "À venir"}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* History log */}
        {t.historique.length > 0 && (
          <Card>
            <CHead Icon={ScrollText} titre="Bénéficiaires précédents" iconColor="#6b7280" />
            {t.historique.map((h, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderTop: "1.5px solid #f9f9f9" }}>
                <div className="relative">
                  <Av i={h.avatar} c={h.couleur} s={46} />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                    style={{ background: h.methode === "wave" ? "#1d4ed8" : h.methode === "orange" ? "#ea580c" : "#6b7280" }}>
                    {h.methode === "wave" ? <Zap size={9} strokeWidth={3} color="white" /> : h.methode === "orange" ? <Radio size={9} strokeWidth={3} color="white" /> : <Banknote size={9} strokeWidth={3} color="white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900">{h.beneficiaire}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Cycle {h.cycle} · {h.date}</p>
                </div>
                <p className="font-black text-emerald-600">{fmt(h.montant)}</p>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};
