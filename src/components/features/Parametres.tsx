import { useState, useRef } from "react";
import {
  Bell, KeyRound, Upload, BookOpen, MessageCircle,
  LogOut, AlertTriangle, User, Smartphone, Globe, Camera,
  Trash2, ChevronRight, RefreshCw, ClipboardList, Shuffle,
  ScrollText, Users, Settings, Check, X, Lock,
} from "lucide-react";
import type { LucideIcon, Toast } from "../../types";
import { Btn, Champ, Modal, STitre, Toggle } from "../ui";

interface Props {
  onToast: (m: string, tp: Toast["type"]) => void;
  photo: string | null;
  onPhotoChange: (p: string | null) => void;
}

export const Parametres = ({ onToast, photo, onPhotoChange }: Props) => {
  type Section = null | "profil" | "notifs" | "securite" | "aide" | "confirm-logout";
  const [section, setSection] = useState<Section>(null);
  const [profil, setProfil] = useState({ nom: "Assane Seck", telephone: "+221 77 000 00 00", email: "admin@tontine.app" });
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifRetard, setNotifRetard] = useState(true);
  const [mdp, setMdp] = useState({ actuel: "", nouveau: "", confirmer: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { onToast("Image trop grande (max 5 Mo).", "error"); return; }
    const reader = new FileReader();
    reader.onload = ev => onPhotoChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const item = (Icon: LucideIcon, label: string, desc: string, onClick: () => void, badge?: number) => (
    <button onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
      style={{ borderBottom: "1.5px solid #f5f5f5" }}>
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
        <Icon size={20} strokeWidth={2} color="#6b7280" />
      </div>
      <div className="flex-1">
        <p className="font-black text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
      {badge && badge > 0 && <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0">{badge}</span>}
      <ChevronRight size={18} strokeWidth={2} color="#d1d5db" />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile card */}
      <button onClick={() => setSection("profil")}
        className="w-full rounded-3xl p-5 md:p-6 text-white text-left active:scale-[0.99] shadow-md hover:shadow-lg transition-shadow"
        style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0"
            style={{ background: "rgba(255,255,255,0.2)", border: "2.5px solid rgba(255,255,255,0.35)" }}>
            {photo
              ? <img src={photo} alt="profil" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><User size={30} strokeWidth={1.5} color="white" /></div>
            }
          </div>
          <div className="flex-1">
            <p className="text-xl md:text-2xl font-black">{profil.nom}</p>
            <p className="text-emerald-200 text-sm mt-0.5">{profil.telephone}</p>
            <p className="text-emerald-200 text-sm">{profil.email}</p>
          </div>
          <ChevronRight size={20} strokeWidth={2} color="rgba(255,255,255,0.5)" />
        </div>
        <div className="mt-3 px-3 py-2 rounded-2xl bg-white/10 text-center md:hidden">
          <p className="text-emerald-100 text-xs font-bold">Appuyez pour modifier votre profil</p>
        </div>
      </button>

      {/* 2-col layout on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-5 md:space-y-0">
        <div className="space-y-5">
          <div>
            <STitre c="Notifications" />
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: "1.5px solid #f0f0f0" }}>
              {item(Bell, "Rappels & alertes", "Configurer vos notifications.", () => setSection("notifs"))}
            </div>
          </div>
          <div>
            <STitre c="Compte" />
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: "1.5px solid #f0f0f0" }}>
              {item(KeyRound, "Changer le mot de passe", "Mettez à jour votre mot de passe.", () => setSection("securite"))}
              {item(Upload, "Exporter les données", "Télécharger tout en PDF ou Excel.", () => onToast("Export en cours…", "info"))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <STitre c="Aide" />
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ border: "1.5px solid #f0f0f0" }}>
              {item(BookOpen, "Guide d'utilisation", "Comment utiliser l'application.", () => setSection("aide"))}
              {item(MessageCircle, "Nous contacter", "Besoin d'aide ? Écrivez-nous.", () => onToast("WhatsApp: +221 77 000 00 00", "info"))}
            </div>
          </div>
          <div className="rounded-3xl p-4" style={{ background: "#fff1f2", border: "2px solid #fecdd3" }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} strokeWidth={2.5} color="#dc2626" />
              <p className="text-sm text-red-600 font-black">Zone sensible</p>
            </div>
            <Btn label="Se déconnecter" Icon={LogOut} onClick={() => setSection("confirm-logout")} v="gris" />
          </div>
        </div>
      </div>

      {/* <div className="text-center pb-2">
        <p className="text-xs font-black text-gray-300">tontine.app · v1.0 · React TypeScript + Vite</p>
        <p className="text-xs text-gray-300 mt-1">Fait avec soin pour l'Afrique</p>
      </div> */}

      {/* ── Modals ── */}
      {section === "profil" && (
        <Modal titre="Mon profil" Icon={User} onClose={() => setSection(null)}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md" style={{ border: "3px solid #e2e8f0" }}>
                {photo
                  ? <img src={photo} alt="profil" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><User size={36} strokeWidth={1.5} color="#d1d5db" /></div>
                }
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
                <Camera size={16} strokeWidth={2.5} color="white" />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-black transition-all active:scale-95"
                style={{ background: "#d1fae5", color: "#059669" }}>
                <Upload size={14} strokeWidth={2.5} />{photo ? "Changer" : "Choisir une photo"}
              </button>
              {photo && (
                <button onClick={() => onPhotoChange(null)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-black active:scale-95"
                  style={{ background: "#fee2e2", color: "#dc2626" }}>
                  <Trash2 size={14} strokeWidth={2.5} />Supprimer
                </button>
              )}
            </div>
          </div>
          <div style={{ borderTop: "1.5px solid #f0f0f0", paddingTop: 16 }} className="space-y-4">
            <Champ label="Votre nom" Icon={User} placeholder="Nom complet" val={profil.nom} onChange={v => setProfil(p => ({ ...p, nom: v }))} />
            <Champ label="Téléphone" Icon={Smartphone} placeholder="+221 77 000 00 00" val={profil.telephone} onChange={v => setProfil(p => ({ ...p, telephone: v }))} aide="Votre numéro Wave ou Orange Money." />
            <Champ label="Email" Icon={Globe} placeholder="email@exemple.com" type="email" val={profil.email} onChange={v => setProfil(p => ({ ...p, email: v }))} />
          </div>
          <Btn label="Enregistrer" Icon={Check} onClick={() => { onToast("Profil mis à jour !", "success"); setSection(null); }} v="vert" />
          <Btn label="Annuler" Icon={X} onClick={() => setSection(null)} v="gris" />
        </Modal>
      )}
      {section === "notifs" && (
        <Modal titre="Notifications" Icon={Bell} onClose={() => setSection(null)}>
          <Toggle label="Alertes sur mon téléphone" desc="Être notifiée quand un membre paie ou est en retard." val={notifPush} onChange={setNotifPush} />
          <Toggle label="Rappels SMS aux membres" desc="Envoyer des SMS aux membres qui n'ont pas payé." val={notifSms} onChange={setNotifSms} c="#d97706" />
          <Toggle label="Alerte retards" desc="Me prévenir dès qu'un membre dépasse la date limite." val={notifRetard} onChange={setNotifRetard} c="#dc2626" />
          <Btn label="Enregistrer" Icon={Check} onClick={() => { onToast("Notifications mises à jour !", "success"); setSection(null); }} v="vert" />
        </Modal>
      )}
      {section === "securite" && (
        <Modal titre="Mot de passe" Icon={KeyRound} onClose={() => setSection(null)}>
          <Champ label="Mot de passe actuel" Icon={Lock} placeholder="Mot de passe actuel" type="password" val={mdp.actuel} onChange={v => setMdp(p => ({ ...p, actuel: v }))} />
          <Champ label="Nouveau mot de passe" Icon={KeyRound} placeholder="Nouveau mot de passe" type="password" val={mdp.nouveau} onChange={v => setMdp(p => ({ ...p, nouveau: v }))} />
          <Champ label="Confirmer" Icon={Check} placeholder="Répéter le nouveau" type="password" val={mdp.confirmer} onChange={v => setMdp(p => ({ ...p, confirmer: v }))} />
          <Btn label="Modifier" Icon={Check} onClick={() => {
            if (!mdp.actuel || !mdp.nouveau) { onToast("Remplissez tous les champs.", "error"); return; }
            if (mdp.nouveau !== mdp.confirmer) { onToast("Les mots de passe ne correspondent pas.", "error"); return; }
            onToast("Mot de passe modifié !", "success"); setSection(null);
          }} v="vert" />
          <Btn label="Annuler" Icon={X} onClick={() => setSection(null)} v="gris" />
        </Modal>
      )}
      {section === "aide" && (
        <Modal titre="Guide d'utilisation" Icon={BookOpen} onClose={() => setSection(null)}>
          {([
            { Icon: RefreshCw,     t: "Mes tontines", d: "La liste de toutes vos tontines. Cliquez sur une carte pour la gérer." },
            { Icon: ClipboardList, t: "Collecte",     d: "Pointez qui a payé. Cliquez sur 'Encaisser' pour marquer un paiement reçu." },
            { Icon: Shuffle,       t: "Tirage",       d: "Désignez le bénéficiaire par tirage au sort puis envoyez la cagnotte." },
            { Icon: ScrollText,    t: "Historique",   d: "Consultez les cycles passés et les bénéficiaires précédents." },
            { Icon: Users,         t: "Membres",      d: "Gérez les membres de chaque tontine séparément." },
            { Icon: Settings,      t: "Paramètres",   d: "Modifiez votre profil, notifications et sécurité." },
          ] as { Icon: LucideIcon; t: string; d: string }[]).map(s => (
            <div key={s.t} className="flex gap-3 p-4 rounded-2xl bg-gray-50">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <s.Icon size={16} strokeWidth={2} color="#6b7280" />
              </div>
              <div>
                <p className="font-black text-gray-900">{s.t}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
          <Btn label="Fermer" Icon={X} onClick={() => setSection(null)} v="gris" />
        </Modal>
      )}
      {section === "confirm-logout" && (
        <Modal titre="Se déconnecter" Icon={LogOut} onClose={() => setSection(null)}>
          <div className="p-4 rounded-2xl" style={{ background: "#fef3c7", border: "1.5px solid #fde68a" }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} strokeWidth={2.5} color="#d97706" />
              <p className="font-black text-amber-700">Confirmation requise</p>
            </div>
            <p className="text-sm text-amber-700 leading-relaxed">Vous allez être déconnecté(e). Toutes les données non sauvegardées seront perdues.</p>
          </div>
          <Btn label="Oui, me déconnecter" Icon={LogOut} onClick={() => { onToast("Déconnecté.", "info"); setSection(null); }} v="rouge" />
          <Btn label="Annuler" Icon={X} onClick={() => setSection(null)} v="gris" />
        </Modal>
      )}
    </div>
  );
};