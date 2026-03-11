import React, { useState } from "react";
import {
  CheckCircle2, Clock, AlertCircle,
  Zap, Radio, Banknote, Lightbulb,
  Calendar, Pencil, X,
} from "lucide-react";
import type { LucideIcon, StatutP, PayM, Freq, FreqUnit } from "../../types";
import { freqLabel } from "../../utils";

/* ── Avatar ── */
export const Av = ({ i, c, s = 44 }: { i: string; c: string; s?: number }) => (
  <div className="rounded-full flex items-center justify-center font-black shrink-0"
    style={{ width: s, height: s, background: `${c}18`, border: `2px solid ${c}50`, color: c, fontSize: s * 0.33 }}>
    {i}
  </div>
);

/* ── Button ── */
export type BtnVariant = "vert" | "orange" | "bleu" | "gris" | "rouge" | "contour";
const BTN_STYLES: Record<BtnVariant, { bg: string; c: string; b?: string }> = {
  vert:    { bg: "linear-gradient(135deg,#059669,#047857)", c: "white" },
  orange:  { bg: "linear-gradient(135deg,#ea580c,#c2410c)", c: "white" },
  bleu:    { bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", c: "white" },
  gris:    { bg: "#f1f5f9", c: "#374151" },
  rouge:   { bg: "linear-gradient(135deg,#dc2626,#b91c1c)", c: "white" },
  contour: { bg: "white", c: "#059669", b: "2.5px solid #059669" },
};
export const Btn = ({ label, Icon, onClick, v = "vert", disabled = false, small = false }: {
  label: string; Icon?: LucideIcon;
  onClick?: () => void; v?: BtnVariant; disabled?: boolean; small?: boolean;
}) => {
  const s = BTN_STYLES[v];
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full flex items-center justify-center gap-2 font-black transition-all active:scale-95 disabled:opacity-40 rounded-2xl"
      style={{ background: s.bg, color: s.c, border: s.b || "none",
        padding: small ? "10px 16px" : "15px 20px", fontSize: small ? 13 : 15,
        boxShadow: v === "gris" || v === "contour" ? "0 2px 8px #0000000a" : "0 4px 18px #0000001a" }}>
      {Icon && <Icon size={small ? 16 : 20} strokeWidth={2.5} />}
      <span>{label}</span>
    </button>
  );
};

/* ── Card ── */
export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-3xl shadow-sm overflow-hidden ${className}`} style={{ border: "1.5px solid #f0f0f0" }}>
    {children}
  </div>
);

/* ── Card Header ── */
export const CHead = ({ Icon, titre, sub, iconColor = "#6b7280" }: {
  Icon: LucideIcon; titre: string; sub?: string; iconColor?: string;
}) => (
  <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1.5px solid #f5f5f5" }}>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${iconColor}15` }}>
      <Icon size={18} strokeWidth={2.5} color={iconColor} />
    </div>
    <div>
      <p className="font-black text-gray-900">{titre}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ── Section title ── */
export const STitre = ({ c }: { c: string }) => (
  <p className="text-xs font-black uppercase tracking-widest px-1 mb-2" style={{ color: "#9ca3af" }}>{c}</p>
);

/* ── Tip ── */
export const Tip = ({ texte, couleur = "#0284c7" }: { texte: string; couleur?: string }) => (
  <div className="flex gap-3 p-4 rounded-2xl items-start" style={{ background: `${couleur}10`, border: `1.5px solid ${couleur}30` }}>
    <Lightbulb size={18} strokeWidth={2.5} color={couleur} className="shrink-0 mt-0.5" />
    <p className="text-sm font-semibold leading-relaxed" style={{ color: couleur }}>{texte}</p>
  </div>
);

/* ── Toggle ── */
export const Toggle = ({ label, desc, val, onChange, c = "#059669" }: {
  label: string; desc: string; val: boolean; onChange: (v: boolean) => void; c?: string;
}) => (
  <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white" style={{ border: "1.5px solid #f0f0f0" }}>
    <div className="flex-1">
      <p className="text-sm font-black text-gray-800">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
    </div>
    <button onClick={() => onChange(!val)}
      className="relative shrink-0 rounded-full transition-all duration-300"
      style={{ width: 52, height: 28, background: val ? c : "#d1d5db" }}>
      <div className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300" style={{ left: val ? "28px" : "4px" }} />
    </button>
  </div>
);

/* ── Statut Badge ── */
export const StatutBadge = ({ statut }: { statut: StatutP }) => {
  if (statut === "payé") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: "#d1fae5", color: "#065f46" }}><CheckCircle2 size={12} strokeWidth={3} />Payé</span>;
  if (statut === "retard") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700"><AlertCircle size={12} strokeWidth={3} />Retard</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: "#fef3c7", color: "#92400e" }}><Clock size={12} strokeWidth={3} />En attente</span>;
};

/* ── Méthode Badge ── */
export const MethodeBadge = ({ m }: { m: PayM }) => {
  if (m === "wave") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: "#1d4ed8" }}><Zap size={9} strokeWidth={3} />Wave</span>;
  if (m === "orange") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: "#ea580c" }}><Radio size={9} strokeWidth={3} />Orange</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white bg-gray-500"><Banknote size={9} strokeWidth={3} />Cash</span>;
};

/* ── Champ (input) ── */
export const Champ = ({ label, aide, placeholder, type = "text", val, onChange, Icon }: {
  label: string; aide?: string; placeholder: string; type?: string; val: string;
  onChange: (v: string) => void; Icon?: LucideIcon;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-black text-gray-700 flex items-center gap-2">
      {Icon && <Icon size={14} strokeWidth={2.5} color="#6b7280" />}{label}
    </label>
    {aide && <p className="text-xs text-gray-400 leading-relaxed">{aide}</p>}
    <input type={type} placeholder={placeholder} value={val} onChange={e => onChange(e.target.value)}
      className="w-full rounded-2xl text-base text-gray-800 placeholder-gray-300 outline-none"
      style={{ padding: "13px 16px", border: "2px solid #e2e8f0", background: "#f8fafc" }}
      onFocus={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.background = "white"; }}
      onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }} />
  </div>
);

/* ── MethodePicker ── */
export const MethodePicker = ({ val, onChange }: { val: PayM; onChange: (v: PayM) => void }) => {
  const options: { v: PayM; l: string; Icon: LucideIcon; bg: string; d: string }[] = [
    { v: "wave",   l: "Wave Sénégal", Icon: Zap,     bg: "#1d4ed8", d: "Transfert Wave" },
    { v: "orange", l: "Orange Money", Icon: Radio,   bg: "#ea580c", d: "Transfert Orange" },
    { v: "cash",   l: "Espèces",      Icon: Banknote, bg: "#6b7280", d: "En main propre" },
  ];
  return (
    <div className="space-y-2">
      <p className="text-sm font-black text-gray-700">Moyen de paiement</p>
      {options.map(m => (
        <button key={m.v} onClick={() => onChange(m.v)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
          style={{ border: `2px solid ${val === m.v ? m.bg : "#e5e7eb"}`, background: val === m.v ? `${m.bg}10` : "white" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: m.bg }}>
            <m.Icon size={18} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="font-black text-gray-900">{m.l}</p>
            <p className="text-xs text-gray-500">{m.d}</p>
          </div>
          {val === m.v && <CheckCircle2 size={20} strokeWidth={2.5} color={m.bg} />}
        </button>
      ))}
    </div>
  );
};

/* ── FreqPicker ── */
const PRESETS: { label: string; f: Freq }[] = [
  { label: "Tous les jours",    f: { valeur: 1, unite: "jour" } },
  { label: "Chaque semaine",    f: { valeur: 1, unite: "semaine" } },
  { label: "Toutes les 2 sem.", f: { valeur: 2, unite: "semaine" } },
  { label: "Chaque mois",       f: { valeur: 1, unite: "mois" } },
  { label: "Tous les 2 mois",   f: { valeur: 2, unite: "mois" } },
  { label: "Tous les 3 mois",   f: { valeur: 3, unite: "mois" } },
];
const freqEq = (a: Freq, b: Freq) => a.valeur === b.valeur && a.unite === b.unite;

export const FreqPicker = ({ val, onChange }: { val: Freq; onChange: (f: Freq) => void }) => {
  const [showCustom, setShowCustom] = useState(!PRESETS.some(p => freqEq(p.f, val)));
  return (
    <div className="space-y-2">
      <p className="text-sm font-black text-gray-700 flex items-center gap-2">
        <Calendar size={14} strokeWidth={2.5} color="#6b7280" />Fréquence des cotisations
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map(p => {
          const active = !showCustom && freqEq(val, p.f);
          return (
            <button key={p.label} onClick={() => { onChange(p.f); setShowCustom(false); }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-left transition-all active:scale-95"
              style={{ border: `2px solid ${active ? "#059669" : "#e5e7eb"}`, background: active ? "#d1fae5" : "white" }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: active ? "#059669" : "#d1d5db" }} />
              <span className="text-sm font-black" style={{ color: active ? "#059669" : "#374151" }}>{p.label}</span>
            </button>
          );
        })}
      </div>
      <button onClick={() => setShowCustom(s => !s)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
        style={{ border: `2px solid ${showCustom ? "#7c3aed" : "#e5e7eb"}`, background: showCustom ? "#ede9fe" : "white" }}>
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: showCustom ? "#7c3aed" : "#d1d5db" }} />
        <div className="flex-1 text-left">
          <p className="text-sm font-black" style={{ color: showCustom ? "#7c3aed" : "#374151" }}>Personnalisée</p>
          {showCustom && <p className="text-xs text-purple-500 font-semibold">Définissez votre propre intervalle</p>}
        </div>
        <Pencil size={14} strokeWidth={2.5} color={showCustom ? "#7c3aed" : "#9ca3af"} />
      </button>
      {showCustom && (
        <div className="p-4 rounded-2xl space-y-3" style={{ background: "#ede9fe", border: "1.5px solid #c4b5fd" }}>
          <p className="text-xs font-black text-purple-700">Tous les combien de temps ?</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white rounded-2xl overflow-hidden" style={{ border: "2px solid #c4b5fd" }}>
              <button onClick={() => onChange({ ...val, valeur: Math.max(1, val.valeur - 1) })} className="w-10 h-10 flex items-center justify-center font-black text-purple-700">−</button>
              <span className="w-10 text-center font-black text-purple-900 text-lg">{val.valeur}</span>
              <button onClick={() => onChange({ ...val, valeur: Math.min(99, val.valeur + 1) })} className="w-10 h-10 flex items-center justify-center font-black text-purple-700">+</button>
            </div>
            <div className="flex gap-2 flex-1">
              {(["jour", "semaine", "mois"] as FreqUnit[]).map(u => (
                <button key={u} onClick={() => onChange({ ...val, unite: u })}
                  className="flex-1 py-2.5 rounded-2xl text-xs font-black capitalize transition-all"
                  style={{ background: val.unite === u ? "#7c3aed" : "white", color: val.unite === u ? "white" : "#6b7280", border: `2px solid ${val.unite === u ? "#7c3aed" : "#e5e7eb"}` }}>
                  {val.valeur > 1 ? u + "s" : u}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white">
            <CheckCircle2 size={14} strokeWidth={2.5} color="#7c3aed" />
            <p className="text-sm font-black text-purple-700">{freqLabel(val)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Modal — bottom sheet mobile / centered dialog desktop ── */
export const Modal = ({ titre, Icon, onClose, children }: {
  titre: string; Icon?: LucideIcon;
  onClose: () => void; children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-40 flex items-end md:items-center md:justify-center px-0 md:px-4"
    style={{ background: "#00000065" }} onClick={onClose}>
    <div
      className="w-full md:max-w-lg md:rounded-3xl rounded-t-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: "1.5px solid #f0f0f0" }}>
        <div className="flex items-center gap-3">
          {Icon && <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"><Icon size={18} strokeWidth={2.5} color="#374151" /></div>}
          <h3 className="text-lg font-black text-gray-900">{titre}</h3>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="px-6 pb-10 pt-5 space-y-4">{children}</div>
    </div>
  </div>
);

/* ── Toasts — top-right on desktop ── */
export const Toasts = ({ ts }: { ts: import("../../types").Toast[] }) => (
  <div className="fixed top-4 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none md:left-auto md:right-6 md:w-80 md:top-6">
    {ts.map(t => {
      const bg = t.type === "success" ? "#059669" : t.type === "error" ? "#dc2626" : t.type === "warning" ? "#d97706" : "#1d4ed8";
      return (
        <div key={t.id} className="px-5 py-4 rounded-2xl text-sm font-bold shadow-xl text-white flex items-center gap-3 pointer-events-auto" style={{ background: bg }}>
          <span className="leading-snug">{t.msg}</span>
        </div>
      );
    })}
  </div>
);