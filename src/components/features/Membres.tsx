import { useState } from "react";
import {
  Users, UserPlus, CheckCircle2, AlertCircle,
  AlertTriangle, Trash2, Check, X, User, Smartphone, Globe,
} from "lucide-react";
import type { Tontine, Membre, Toast } from "../../types";
import { COULEURS_PALETTE } from "../../utils";
import { Av, Btn, Champ, Modal, StatutBadge, Tip } from "../ui";

interface Props {
  t: Tontine;
  onAjouterMembre: (m: Membre) => void;
  onRetirerMembre: (id: number) => void;
  onToast: (msg: string, tp: Toast["type"]) => void;
}

export const Membres = ({ t, onAjouterMembre, onRetirerMembre, onToast }: Props) => {
  const [showNew, setShowNew] = useState(false);
  const [confirmRetirer, setConfirmRetirer] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: "", tel: "", email: "" });

  const ajouter = () => {
    if (!form.nom || !form.tel) { onToast("Remplissez le nom et le téléphone.", "error"); return; }
    const idx = t.membres.length % COULEURS_PALETTE.length;
    const initiales = form.nom.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const nv: Membre = {
      id: Date.now(), nom: form.nom, telephone: form.tel,
      avatar: initiales, couleur: COULEURS_PALETTE[idx],
      aDejaRecu: false, retards: 0, actif: true,
    };
    onAjouterMembre(nv);
    onToast(`${form.nom} ajouté(e) !`, "success");
    setShowNew(false);
    setForm({ nom: "", tel: "", email: "" });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Total",   v: t.membres.length,                        c: "#059669", bg: "#d1fae5", Icon: Users },
          { l: "Actifs",  v: t.membres.filter(m => m.actif).length,    c: "#1d4ed8", bg: "#dbeafe", Icon: CheckCircle2 },
          { l: "Retards", v: t.membres.filter(m => m.retards > 0).length, c: "#dc2626", bg: "#fee2e2", Icon: AlertCircle },
        ].map(s => (
          <div key={s.l} className="rounded-3xl p-3 md:p-4 text-center" style={{ background: s.bg }}>
            <s.Icon size={16} strokeWidth={2.5} color={s.c} className="mx-auto" />
            <p className="text-2xl font-black mt-1" style={{ color: s.c }}>{s.v}</p>
            <p className="text-[10px] font-bold text-gray-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="md:max-w-xs">
        <Btn label="Ajouter un membre" Icon={UserPlus} onClick={() => setShowNew(true)} v="vert" />
      </div>

      {t.membres.length === 0 ? (
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Users size={28} strokeWidth={1.5} color="#d1d5db" />
          </div>
          <p className="font-black text-gray-700 text-lg">Aucun membre</p>
          <p className="text-sm text-gray-400 mt-2">Ajoutez les membres de cette tontine.</p>
        </div>
      ) : (
        /* Responsive grid: 1 col mobile, 2 col md, 3 col xl */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {t.membres.map(m => {
            const p = t.paiements.find(x => x.membreId === m.id);
            return (
              <div key={m.id} className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: "1.5px solid #f0f0f0" }}>
                <div className="flex items-center gap-4 px-4 py-4">
                  <Av i={m.avatar} c={m.couleur} s={52} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-gray-900 truncate">{m.nom}</p>
                      {m.aDejaRecu && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-black">
                          <CheckCircle2 size={9} strokeWidth={3} />Déjà reçu
                        </span>
                      )}
                      {m.retards > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-black">
                          <AlertTriangle size={9} strokeWidth={3} />{m.retards} retard{m.retards > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5 truncate">{m.telephone}</p>
                    {p && <div className="mt-1.5"><StatutBadge statut={p.statut} /></div>}
                  </div>
                  <button onClick={() => setConfirmRetirer(m.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-100 active:scale-95 transition-all shrink-0">
                    <Trash2 size={14} strokeWidth={2.5} color="#dc2626" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmRetirer !== null && (() => {
        const m = t.membres.find(x => x.id === confirmRetirer)!;
        return (
          <Modal titre="Retirer ce membre" Icon={Trash2} onClose={() => setConfirmRetirer(null)}>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
              <Av i={m.avatar} c={m.couleur} s={52} />
              <div>
                <p className="font-black text-gray-900">{m.nom}</p>
                <p className="text-sm text-gray-400">{m.telephone}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "#fee2e2", border: "1.5px solid #fca5a5" }}>
              <p className="text-sm text-red-700 font-semibold leading-relaxed">
                Retirer <span className="font-black">{m.nom}</span> de cette tontine supprimera également son historique de paiements.
              </p>
            </div>
            <Btn label="Oui, retirer ce membre" Icon={Trash2}
              onClick={() => { onRetirerMembre(confirmRetirer!); setConfirmRetirer(null); }} v="rouge" />
            <Btn label="Annuler" Icon={X} onClick={() => setConfirmRetirer(null)} v="gris" />
          </Modal>
        );
      })()}

      {showNew && (
        <Modal titre="Ajouter un membre" Icon={UserPlus} onClose={() => setShowNew(false)}>
          <Tip texte="Le numéro de téléphone sera utilisé pour les paiements Wave et Orange Money." couleur="#059669" />
          <Champ label="Nom complet" Icon={User} placeholder="Ex: Aminata Diallo" val={form.nom} onChange={v => setForm(f => ({ ...f, nom: v }))} />
          <Champ label="Téléphone" Icon={Smartphone} placeholder="+221 77 000 00 00" val={form.tel} onChange={v => setForm(f => ({ ...f, tel: v }))} aide="Numéro Wave ou Orange Money." />
          <Champ label="Email (facultatif)" Icon={Globe} placeholder="email@exemple.com" type="email" val={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
          <Btn label="Ajouter ce membre" Icon={Check} onClick={ajouter} v="vert" />
          <Btn label="Annuler" Icon={X} onClick={() => setShowNew(false)} v="gris" />
        </Modal>
      )}
    </div>
  );
};
