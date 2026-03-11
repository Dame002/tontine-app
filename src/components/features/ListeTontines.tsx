import { useState } from "react";
import {
  Wallet, AlertCircle, AlertTriangle, Clock,
  CheckCircle2, Plus, Check, X,
  FileText, Banknote, Hash, ChevronRight, RefreshCw, Circle,
} from "lucide-react";
import type { Tontine, Toast, Freq } from "../../types";
import { fmt, fmtS, freqLabel, COULEURS_PALETTE } from "../../utils";
import { ICON_MAP, ICON_KEYS } from "../../data/icons";
import { Btn, Champ, FreqPicker, Modal, Tip } from "../ui";

interface Props {
  tontines: Tontine[];
  onSelect: (t: Tontine) => void;
  onCreate: (t: Tontine) => void;
  onToast: (m: string, tp: Toast["type"]) => void;
}

export const ListeTontines = ({ tontines, onSelect, onCreate, onToast }: Props) => {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    nom: "", montant: "",
    frequence: { valeur: 1, unite: "mois" } as Freq,
    cycles: "12", iconKey: "users",
  });

  const totalCagnotte = tontines.reduce((s, t) => s + t.paiements.filter(p => p.statut === "payé").length * t.montant, 0);
  const totalRetards  = tontines.reduce((s, t) => s + t.paiements.filter(p => p.statut === "retard").length, 0);
  const totalMembres  = tontines.reduce((s, t) => s + t.membres.length, 0);

  const creer = () => {
    if (!form.nom || !form.montant) { onToast("Remplissez le nom et le montant.", "error"); return; }
    const idx = tontines.length % COULEURS_PALETTE.length;
    const newT: Tontine = {
      id: Date.now(), nom: form.nom, montant: Number(form.montant),
      frequence: form.frequence, cycleActuel: 1, totalCycles: Number(form.cycles) || 12,
      dateProchain: new Date(Date.now() + 30 * 86_400_000).toISOString().split("T")[0],
      couleur: COULEURS_PALETTE[idx], iconKey: form.iconKey,
      membres: [], paiements: [], historique: [],
    };
    onCreate(newT);
    onToast(`"${form.nom}" créée avec succès !`, "success");
    setShowNew(false);
    setForm({ nom: "", montant: "", frequence: { valeur: 1, unite: "mois" }, cycles: "12", iconKey: "users" });
  };

  return (
    <div className="space-y-6">
      {/* Stats banner — responsive grid */}
      <div className="rounded-3xl p-5 md:p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#059669 0%,#047857 100%)" }}>
        <div className="absolute -right-6 -top-6 w-40 h-40 rounded-full opacity-10 bg-white" />
        <div className="absolute -left-4 -bottom-8 w-32 h-32 rounded-full opacity-5 bg-white" />
        <p className="text-emerald-200 text-sm font-bold mb-1">Vue globale</p>
        <p className="text-3xl font-black">{tontines.length} tontine{tontines.length > 1 ? "s" : ""}</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl" style={{ background: "#ffffff15" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet size={13} strokeWidth={2.5} color="#6ee7b7" />
              <p className="text-emerald-100 text-xs font-semibold">Collecté ce mois</p>
            </div>
            <p className="font-black text-lg">{fmt(totalCagnotte)}</p>
          </div>
          <div className="p-3 rounded-2xl" style={{ background: totalRetards > 0 ? "rgba(239,68,68,0.2)" : "#ffffff15" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle size={13} strokeWidth={2.5} color={totalRetards > 0 ? "#fca5a5" : "#6ee7b7"} />
              <p className="text-emerald-100 text-xs font-semibold">Retards</p>
            </div>
            <p className={`font-black text-lg ${totalRetards > 0 ? "text-red-300" : "text-white"}`}>
              {totalRetards} membre{totalRetards > 1 ? "s" : ""}
            </p>
          </div>
          <div className="p-3 rounded-2xl hidden md:block" style={{ background: "#ffffff15" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={13} strokeWidth={2.5} color="#6ee7b7" />
              <p className="text-emerald-100 text-xs font-semibold">Total membres</p>
            </div>
            <p className="font-black text-lg text-white">{totalMembres}</p>
          </div>
        </div>
      </div>

      {/* Create button */}
      <div className="md:max-w-xs">
        <Btn label="Créer une nouvelle tontine" Icon={Plus} onClick={() => setShowNew(true)} v="vert" />
      </div>

      {/* Tontine cards — responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tontines.map(t => {
          const payes   = t.paiements.filter(p => p.statut === "payé").length;
          const retards = t.paiements.filter(p => p.statut === "retard").length;
          const attente = t.paiements.filter(p => p.statut === "en attente").length;
          const cagnotte = payes * t.montant;
          const pct = t.membres.length > 0 ? Math.round((payes / t.membres.length) * 100) : 0;
          const TIcon = ICON_MAP[t.iconKey] || <RefreshCw size={20} />;

          return (
            <button key={t.id} onClick={() => onSelect(t)}
              className="bg-white rounded-3xl overflow-hidden text-left active:scale-[0.99] transition-all hover:shadow-lg shadow-sm w-full"
              style={{ border: "1.5px solid #f0f0f0", borderTop: `4px solid ${t.couleur}` }}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${t.couleur}15`, border: `2px solid ${t.couleur}30`, color: t.couleur }}>
                      {TIcon}
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900">{t.nom}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{freqLabel(t.frequence)} · {fmt(t.montant)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">Cycle</p>
                    <p className="font-black text-gray-900">{t.cycleActuel}/{t.totalCycles}</p>
                  </div>
                </div>

                {t.membres.length > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-semibold">{payes}/{t.membres.length} ont payé</span>
                      <span className="font-black" style={{ color: t.couleur }}>{pct}%</span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ background: `${t.couleur}20` }}>
                      <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, background: t.couleur }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${t.couleur}12` }}>
                    <Wallet size={12} strokeWidth={2.5} color={t.couleur} />
                    <span className="text-sm font-black" style={{ color: t.couleur }}>{fmtS(cagnotte)}</span>
                  </div>
                  {retards > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50">
                      <AlertCircle size={11} strokeWidth={2.5} color="#dc2626" />
                      <span className="text-xs font-black text-red-600">{retards} retard{retards > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {attente > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50">
                      <Clock size={11} strokeWidth={2.5} color="#d97706" />
                      <span className="text-xs font-black text-amber-600">{attente} en attente</span>
                    </div>
                  )}
                  {retards === 0 && attente === 0 && t.membres.length > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50">
                      <CheckCircle2 size={11} strokeWidth={2.5} color="#059669" />
                      <span className="text-xs font-black text-emerald-600">Tout payé</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#f9fafb", borderTop: "1.5px solid #f0f0f0" }}>
                <div className="flex -space-x-2">
                  {t.membres.slice(0, 5).map(m => (
                    <div key={m.id} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white"
                      style={{ background: `${m.couleur}25`, color: m.couleur }}>{m.avatar}</div>
                  ))}
                  {t.membres.length > 5 && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black bg-gray-200 text-gray-500 border-2 border-white">+{t.membres.length - 5}</div>
                  )}
                  {t.membres.length === 0 && <p className="text-xs text-gray-400">Aucun membre</p>}
                </div>
                <div className="flex items-center gap-1 font-black text-sm" style={{ color: t.couleur }}>
                  <span>Gérer</span><ChevronRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showNew && (
        <Modal titre="Créer une tontine" Icon={Plus} onClose={() => setShowNew(false)}>
          <Tip texte="Choisissez le nom, le montant que chaque membre paie et la fréquence des cotisations." couleur="#059669" />
          <div>
            <p className="text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
              <Circle size={14} strokeWidth={2.5} color="#6b7280" />Icône de la tontine
            </p>
            <div className="flex gap-2 flex-wrap">
              {ICON_KEYS.map(k => (
                <button key={k} onClick={() => setForm(f => ({ ...f, iconKey: k }))}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                  style={{ background: form.iconKey === k ? "#d1fae5" : "#f3f4f6", border: form.iconKey === k ? "2px solid #059669" : "2px solid transparent", color: form.iconKey === k ? "#059669" : "#6b7280" }}>
                  {ICON_MAP[k]}
                </button>
              ))}
            </div>
          </div>
          <Champ label="Nom de la tontine" Icon={FileText} placeholder="Ex: Tontine Famille 2026"
            val={form.nom} onChange={v => setForm(f => ({ ...f, nom: v }))} aide="Un nom facile à reconnaître." />
          <Champ label="Montant par personne (FCFA)" Icon={Banknote} placeholder="50000" type="number"
            val={form.montant} onChange={v => setForm(f => ({ ...f, montant: v }))} aide="Combien chaque membre cotise à chaque tour." />
          <FreqPicker val={form.frequence} onChange={f => setForm(ff => ({ ...ff, frequence: f }))} />
          <Champ label="Nombre de tours" Icon={Hash} placeholder="12" type="number"
            val={form.cycles} onChange={v => setForm(f => ({ ...f, cycles: v }))} aide="En général = nombre de membres." />
          <Btn label="Créer la tontine" Icon={Check} onClick={creer} v="vert" />
          <Btn label="Annuler" Icon={X} onClick={() => setShowNew(false)} v="gris" />
        </Modal>
      )}
    </div>
  );
};
