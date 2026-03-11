import { useState } from "react";
import {
  Users, Search, X, Plus,
  Wallet, CheckCircle2, Clock, AlertCircle, AlertTriangle, Banknote, Check,
} from "lucide-react";
import type { Tontine, PayM, Toast } from "../../types";
import { fmt } from "../../utils";
import { Av, Btn, Modal, MethodeBadge, MethodePicker, StatutBadge } from "../ui";

interface Props {
  t: Tontine;
  onPaye: (id: number, m: PayM) => void;
  onToast: (m: string, tp: Toast["type"]) => void;
}

export const Collecte = ({ t, onPaye, onToast }: Props) => {
  const [filtre, setFiltre] = useState<"tous" | "payé" | "en attente" | "retard">("tous");
  const [recherche, setRecherche] = useState("");
  const [modalId, setModalId] = useState<number | null>(null);
  const [methode, setMethode] = useState<PayM>("wave");

  const gP = (id: number) => t.paiements.find(p => p.membreId === id);
  const gM = (id: number) => t.membres.find(m => m.id === id)!;
  const mModal = modalId ? gM(modalId) : null;
  const payes = t.paiements.filter(p => p.statut === "payé").length;

  if (t.membres.length === 0) return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Users size={28} strokeWidth={1.5} color="#d1d5db" />
      </div>
      <p className="font-black text-gray-700 text-lg">Aucun membre</p>
      <p className="text-sm text-gray-400 mt-2 leading-relaxed">Ajoutez des membres depuis l'onglet Membres.</p>
    </div>
  );

  const filtres = [
    { v: "tous" as const,       l: "Tous",       n: t.membres.length,                                          Icon: Users },
    { v: "payé" as const,       l: "Payés",      n: payes,                                                     Icon: CheckCircle2 },
    { v: "en attente" as const, l: "En attente", n: t.paiements.filter(p => p.statut === "en attente").length, Icon: Clock },
    { v: "retard" as const,     l: "Retards",    n: t.paiements.filter(p => p.statut === "retard").length,     Icon: AlertCircle },
  ];

  const liste = t.membres
    .filter(m => filtre === "tous" || gP(m.id)?.statut === filtre)
    .filter(m => !recherche || m.nom.toLowerCase().includes(recherche.toLowerCase()) || m.telephone.includes(recherche));

  const totalColl    = payes * t.montant;
  const totalAttendu = t.membres.length * t.montant;

  return (
    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-[300px_1fr] md:gap-6 lg:grid-cols-[320px_1fr]">

      {/* ── Left panel: stats + filters (sticky on desktop) ── */}
      <div className="space-y-4 md:space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
          {[
            { l: "Collecté",  v: fmt(totalColl),                 c: "#059669", bg: "#d1fae5", Icon: Wallet },
            { l: "Payé",      v: `${payes}/${t.membres.length}`, c: "#1d4ed8", bg: "#dbeafe", Icon: CheckCircle2 },
            { l: "Manquant",  v: fmt(totalAttendu - totalColl),  c: "#d97706", bg: "#fef3c7", Icon: Clock },
          ].map(s => (
            <div key={s.l} className="rounded-3xl p-3 md:p-4 md:flex md:items-center md:gap-3" style={{ background: s.bg }}>
              <s.Icon size={14} strokeWidth={2.5} color={s.c} className="md:w-5 md:h-5 md:shrink-0" />
              <div>
                <p className="text-sm md:text-base font-black leading-tight mt-1 md:mt-0" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[10px] md:text-xs font-bold text-gray-500 mt-0.5">{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl" style={{ border: "1.5px solid #e5e7eb" }}>
          <Search size={16} strokeWidth={2.5} color="#9ca3af" />
          <input placeholder="Rechercher un membre…" value={recherche} onChange={e => setRecherche(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent font-semibold" />
          {recherche && <button onClick={() => setRecherche("")}><X size={14} strokeWidth={2.5} color="#9ca3af" /></button>}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {filtres.map(f => (
            <button key={f.v} onClick={() => setFiltre(f.v)}
              className="flex items-center gap-1.5 px-3 py-2 md:py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all md:w-full"
              style={{ background: filtre === f.v ? t.couleur : "white", color: filtre === f.v ? "white" : "#6b7280", border: filtre === f.v ? "none" : "1.5px solid #e5e7eb" }}>
              <f.Icon size={11} strokeWidth={2.5} />
              <span className="flex-1 md:text-left">{f.l}</span>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                style={{ background: filtre === f.v ? "rgba(255,255,255,0.25)" : "#f3f4f6" }}>{f.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right panel: member list ── */}
      <div className="space-y-2">
        {liste.length === 0 ? (
          <div className="text-center py-12 px-6">
            <p className="text-gray-400 font-semibold">Aucun membre pour ce filtre</p>
          </div>
        ) : liste.map(m => {
          const p = gP(m.id);
          const st = p?.statut ?? "en attente";
          const bl = st === "payé" ? "#059669" : st === "retard" ? "#dc2626" : "#f59e0b";
          return (
            <div key={m.id} className="bg-white rounded-3xl overflow-hidden"
              style={{ border: `1.5px solid ${bl}25`, borderLeft: `4px solid ${bl}` }}>
              <div className="flex items-center gap-4 px-4 py-4">
                <Av i={m.avatar} c={m.couleur} s={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-gray-900">{m.nom}</p>
                    {m.retards > 0 && st !== "payé" && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-black bg-red-100 text-red-600">
                        <AlertTriangle size={9} strokeWidth={3} />{m.retards} retard{m.retards > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{m.telephone}</p>
                  {st === "payé" && p?.methode && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MethodeBadge m={p.methode} />
                      <span className="text-[10px] text-gray-400">{p.date}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-black text-gray-800">{fmt(t.montant)}</span>
                  {st === "payé"
                    ? <StatutBadge statut="payé" />
                    : (
                      <button onClick={() => { setModalId(m.id); setMethode("wave"); }}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-2xl font-black text-white active:scale-95 transition-all"
                        style={{ background: `linear-gradient(135deg,${t.couleur},${t.couleur}cc)` }}>
                        <Plus size={12} strokeWidth={3} />Encaisser
                      </button>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {mModal && (
        <Modal titre={`Encaisser — ${mModal.nom.split(" ")[0]}`} Icon={Banknote} onClose={() => setModalId(null)}>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
            <Av i={mModal.avatar} c={mModal.couleur} s={52} />
            <div>
              <p className="font-black text-gray-900 text-base">{mModal.nom}</p>
              <p className="text-gray-500 text-sm">{mModal.telephone}</p>
              {mModal.retards > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-black text-red-500 mt-1">
                  <AlertTriangle size={11} strokeWidth={3} />{mModal.retards} retard{mModal.retards > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
          <div className="p-4 rounded-2xl text-center" style={{ background: "#d1fae5", border: "2px solid #6ee7b7" }}>
            <p className="text-sm text-gray-500">Montant à encaisser</p>
            <p className="text-3xl font-black text-emerald-700 mt-1">{fmt(t.montant)}</p>
          </div>
          <MethodePicker val={methode} onChange={setMethode} />
          <Btn label="Confirmer l'encaissement" Icon={Check} onClick={() => {
            onPaye(mModal.id, methode);
            onToast(`${mModal.nom.split(" ")[0]} — paiement encaissé !`, "success");
            setModalId(null);
          }} v="vert" />
          <Btn label="Annuler" Icon={X} onClick={() => setModalId(null)} v="gris" />
        </Modal>
      )}
    </div>
  );
};
