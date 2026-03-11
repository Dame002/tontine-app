import { useState } from "react";
import {
  RefreshCw, Settings, ChevronLeft,
  Wallet, MoreVertical, AlertCircle,
  User, Check, X, Trash2, Pencil,
  ClipboardList, Shuffle, History, Users,
  Circle, AlertTriangle,
} from "lucide-react";
import type { LucideIcon, RootTab, InnerTab, Freq } from "./types";
import { freqLabel, fmtS, fmt } from "./utils";
import { ICON_MAP, ICON_KEYS } from "./data/icons";
import { useToasts } from "./hooks/useToasts";
import { useTontines } from "./hooks/useTontines";
import { Toasts, Modal, Btn, Champ, FreqPicker, Av } from "./components/ui";
import { ListeTontines }  from "./components/features/ListeTontines";
import { Collecte }       from "./components/features/Collecte";
import { Tirage }         from "./components/features/Tirage";
import { Historique }     from "./components/features/Historique";
import { Membres }        from "./components/features/Membres";
import { Parametres }     from "./components/features/Parametres";

/* ─────────────────────────────────────────────
   SIDEBAR (desktop only, md+)
───────────────────────────────────────────── */
function Sidebar({
  rootTab, setRootTab,
  tontine, setSelected, setInnerTab,
  innerTab,
  totalRetards, totalAttente,
  adminPhoto, setShowRetards,
  onEditTontine,
}: {
  rootTab: RootTab; setRootTab: (t: RootTab) => void;
  tontine: ReturnType<typeof useTontines>["tontine"];
  setSelected: ReturnType<typeof useTontines>["setSelected"];
  setInnerTab: (t: InnerTab) => void;
  innerTab: InnerTab;
  totalRetards: number; totalAttente: number;
  adminPhoto: string | null;
  setShowRetards: (v: boolean) => void;
  onEditTontine: () => void;
}) {
  const innerTabs: { id: InnerTab; label: string; Icon: LucideIcon; badge?: number }[] =
    tontine ? [
      { id: "collecte",   label: "Collecte",   Icon: ClipboardList, badge: tontine.paiements.filter(p => p.statut !== "payé").length || undefined },
      { id: "tirage",     label: "Tirage",      Icon: Shuffle },
      { id: "historique", label: "Historique",  Icon: History },
      { id: "membres",    label: "Membres",     Icon: Users },
    ] : [];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r-2 border-gray-100 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-5 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>T</div>
          <div>
            <p className="font-black text-gray-900">tontine.app</p>
            <p className="text-[11px] text-gray-400 font-semibold">Gestionnaire de tontines</p>
          </div>
        </div>
      </div>

      {/* Nav content */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {tontine ? (
          /* ── Inside a tontine ── */
          <>
            {/* Back button */}
            <button onClick={() => setSelected(null)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-gray-500 hover:bg-gray-50 transition-colors mb-3 text-sm font-black">
              <ChevronLeft size={18} strokeWidth={2.5} />Retour
            </button>

            {/* Tontine info card */}
            <div className="mx-1 mb-4 p-4 rounded-2xl" style={{ background: `${tontine.couleur}10`, border: `1.5px solid ${tontine.couleur}25` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${tontine.couleur}20`, color: tontine.couleur }}>
                  {ICON_MAP[tontine.iconKey] || <RefreshCw size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 truncate text-sm">{tontine.nom}</p>
                  <p className="text-[11px] text-gray-400">Cycle {tontine.cycleActuel}/{tontine.totalCycles}</p>
                </div>
                <button onClick={onEditTontine} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
                  <MoreVertical size={15} strokeWidth={2.5} color="#6b7280" />
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white">
                <Wallet size={14} strokeWidth={2.5} color="#059669" />
                <span className="text-sm font-black text-emerald-700">
                  {fmt(tontine.paiements.filter(p => p.statut === "payé").length * tontine.montant)}
                </span>
              </div>
            </div>

            {/* Inner tabs as sidebar items */}
            {innerTabs.map(t => {
              const active = innerTab === t.id;
              return (
                <button key={t.id} onClick={() => setInnerTab(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all relative text-left"
                  style={{ background: active ? `${tontine.couleur}12` : "transparent" }}>
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full" style={{ background: tontine.couleur }} />}
                  <div className="relative ml-1">
                    <t.Icon size={19} strokeWidth={2} color={active ? tontine.couleur : "#9ca3af"} />
                    {t.badge && t.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center text-[9px] font-black text-white">{t.badge}</span>
                    )}
                  </div>
                  <span className="text-sm font-black" style={{ color: active ? tontine.couleur : "#6b7280" }}>{t.label}</span>
                </button>
              );
            })}
          </>
        ) : (
          /* ── Home nav ── */
          <>
            {([
              { id: "tontines"   as RootTab, label: "Mes tontines", Icon: RefreshCw as LucideIcon, badge: totalRetards + totalAttente },
              { id: "parametres" as RootTab, label: "Paramètres",   Icon: Settings  as LucideIcon, badge: 0 },
            ]).map(t => {
              const active = rootTab === t.id;
              return (
                <button key={t.id} onClick={() => setRootTab(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all relative"
                  style={{ background: active ? "#05966915" : "transparent" }}>
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-emerald-500" />}
                  <div className="relative ml-1">
                    <t.Icon size={19} strokeWidth={2} color={active ? "#059669" : "#9ca3af"} />
                    {t.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center text-[9px] font-black text-white">{t.badge}</span>
                    )}
                  </div>
                  <span className="text-sm font-black" style={{ color: active ? "#059669" : "#6b7280" }}>{t.label}</span>
                </button>
              );
            })}

            {totalRetards > 0 && (
              <button onClick={() => setShowRetards(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors mt-2">
                <AlertCircle size={19} strokeWidth={2} color="#dc2626" className="ml-1" />
                <span className="text-sm font-black text-red-600">{totalRetards} retard{totalRetards > 1 ? "s" : ""}</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Profile at bottom */}
      <div className="px-4 py-4 border-t-2 border-gray-100">
        <button onClick={() => setRootTab("parametres")}
          className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0" style={{ border: "2px solid #059669" }}>
            {adminPhoto
              ? <img src={adminPhoto} alt="profil" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
                <User size={16} strokeWidth={2} color="white" />
              </div>
            }
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-black text-gray-900 truncate">Assane Seck</p>
            <p className="text-[11px] text-gray-400">Administrateur</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  const [rootTab, setRootTab]   = useState<RootTab>("tontines");
  const [innerTab, setInnerTab] = useState<InnerTab>("collecte");
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);

  const [showRetards, setShowRetards]             = useState(false);
  const [showEditTontine, setShowEditTontine]     = useState(false);
  const [showDeleteTontine, setShowDeleteTontine] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: "", montant: "", frequence: { valeur: 1, unite: "mois" } as Freq, iconKey: "users",
  });

  const { toasts, addToast } = useToasts();
  const {
    tontines, tontine, setSelected,
    marquerPaye, ajouterMembre, retirerMembre,
    confirmerEnvoi, ajouterTontine, modifierTontine, supprimerTontine,
  } = useTontines();

  const totalRetards = tontines.reduce((s, t) => s + t.paiements.filter(p => p.statut === "retard").length, 0);
  const totalAttente = tontines.reduce((s, t) => s + t.paiements.filter(p => p.statut === "en attente").length, 0);

  /* Inner tabs — also used in mobile header */
  const innerTabs: { id: InnerTab; label: string; Icon: LucideIcon; badge?: number }[] =
    tontine ? [
      { id: "collecte",   label: "Collecte",   Icon: ClipboardList, badge: tontine.paiements.filter(p => p.statut !== "payé").length || undefined },
      { id: "tirage",     label: "Tirage",      Icon: Shuffle },
      { id: "historique", label: "Historique",  Icon: History },
      { id: "membres",    label: "Membres",     Icon: Users },
    ] : [];

  const openEditTontine = () => {
    if (!tontine) return;
    setEditForm({ nom: tontine.nom, montant: String(tontine.montant), frequence: tontine.frequence, iconKey: tontine.iconKey });
    setShowEditTontine(true);
  };

  const handleModifierTontine = () => {
    if (!tontine || !editForm.nom || !editForm.montant) return;
    modifierTontine({ nom: editForm.nom, montant: Number(editForm.montant), frequence: editForm.frequence, iconKey: editForm.iconKey });
    addToast("Tontine mise à jour !", "success");
    setShowEditTontine(false);
  };

  const handleSupprimerTontine = () => {
    supprimerTontine();
    addToast("Tontine supprimée.", "info");
    setShowDeleteTontine(false);
  };

  return (
    <div style={{ fontFamily: "'Nunito','DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{display:none}
        @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
        .page{animation:slideUp .2s ease-out}
        .slide{animation:slideIn .22s ease-out}
      `}</style>

      <Toasts ts={toasts} />

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT  (md+)
          Sidebar left | Content right
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex min-h-screen bg-gray-50">
        <Sidebar
          rootTab={rootTab} setRootTab={setRootTab}
          tontine={tontine} setSelected={setSelected} setInnerTab={setInnerTab}
          innerTab={innerTab}
          totalRetards={totalRetards} totalAttente={totalAttente}
          adminPhoto={adminPhoto}
          setShowRetards={setShowRetards}
          onEditTontine={openEditTontine}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Desktop top bar */}
          <header className="sticky top-0 z-10 bg-white border-b-2 border-gray-100 px-8 py-4 flex items-center justify-between">
            {tontine ? (
              <>
                <div>
                  <p className="font-black text-gray-900 text-xl">{tontine.nom}</p>
                  <p className="text-sm text-gray-400">{freqLabel(tontine.frequence)} · {fmt(tontine.montant)} / personne</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ background: "#d1fae5" }}>
                    <Wallet size={15} strokeWidth={2.5} color="#059669" />
                    <span className="font-black text-emerald-700">
                      {fmt(tontine.paiements.filter(p => p.statut === "payé").length * tontine.montant)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="font-black text-gray-900 text-xl">
                    {rootTab === "tontines" ? "Mes tontines" : "Paramètres"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {rootTab === "tontines"
                      ? `${tontines.length} tontine${tontines.length > 1 ? "s" : ""} · ${tontines.reduce((s, t) => s + t.membres.length, 0)} membres`
                      : "Gérez votre compte et vos préférences"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {totalRetards > 0 && (
                    <button onClick={() => setShowRetards(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors"
                      style={{ border: "1.5px solid #fecaca" }}>
                      <AlertCircle size={16} strokeWidth={2.5} color="#dc2626" />
                      <span className="text-sm font-black text-red-600">{totalRetards} retard{totalRetards > 1 ? "s" : ""}</span>
                    </button>
                  )}
                  <button onClick={() => setRootTab("parametres")}
                    className="w-10 h-10 rounded-xl overflow-hidden" style={{ border: "2px solid #059669" }}>
                    {adminPhoto
                      ? <img src={adminPhoto} alt="profil" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
                        <User size={18} strokeWidth={2} color="white" />
                      </div>
                    }
                  </button>
                </div>
              </>
            )}
          </header>

          {/* Desktop content area */}
          <main className="flex-1 overflow-y-auto p-8">
            {tontine ? (
              <div className="slide max-w-4xl mx-auto" key={`${tontine.id}-${innerTab}`}>
                {innerTab === "collecte"   && <Collecte   t={tontine} onPaye={marquerPaye} onToast={addToast} />}
                {innerTab === "tirage"     && <Tirage     t={tontine} onToast={addToast} onConfirmerEnvoi={confirmerEnvoi} />}
                {innerTab === "historique" && <Historique t={tontine} />}
                {innerTab === "membres"    && <Membres    t={tontine} onAjouterMembre={ajouterMembre} onRetirerMembre={retirerMembre} onToast={addToast} />}
              </div>
            ) : (
              <div className="page max-w-5xl mx-auto" key={rootTab}>
                {rootTab === "tontines"   && <ListeTontines tontines={tontines} onSelect={t => { setSelected(t); setInnerTab("collecte"); }} onCreate={ajouterTontine} onToast={addToast} />}
                {rootTab === "parametres" && <Parametres onToast={addToast} photo={adminPhoto} onPhotoChange={setAdminPhoto} />}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE LAYOUT  (<md)
          Top header | Content | Bottom nav
      ══════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 bg-white shadow-sm" style={{ borderBottom: "2px solid #f0f0f0" }}>
          {tontine ? (
            <div>
              <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-100 text-gray-600 active:scale-95 transition-all shrink-0">
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${tontine.couleur}15`, border: `2px solid ${tontine.couleur}30`, color: tontine.couleur }}>
                  {ICON_MAP[tontine.iconKey] || <RefreshCw size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 truncate">{tontine.nom}</p>
                  <p className="text-xs text-gray-400">Cycle {tontine.cycleActuel}/{tontine.totalCycles} · {freqLabel(tontine.frequence)}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shrink-0" style={{ background: "#d1fae5" }}>
                  <Wallet size={13} strokeWidth={2.5} color="#059669" />
                  <span className="text-sm font-black text-emerald-700">
                    {fmtS(tontine.paiements.filter(p => p.statut === "payé").length * tontine.montant)}
                  </span>
                </div>
                <button onClick={openEditTontine}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-100 active:scale-95 transition-all shrink-0">
                  <MoreVertical size={18} strokeWidth={2.5} color="#6b7280" />
                </button>
              </div>
              {/* Inner tabs — mobile horizontal scroll */}
              <div className="flex px-3 pb-2 gap-1">
                {innerTabs.map(t => {
                  const active = innerTab === t.id;
                  return (
                    <button key={t.id} onClick={() => setInnerTab(t.id)}
                      className="flex-1 flex flex-col items-center py-2 rounded-2xl transition-all relative"
                      style={{ background: active ? `${tontine.couleur}12` : "transparent" }}>
                      {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: tontine.couleur }} />}
                      <div className="relative">
                        <t.Icon size={20} strokeWidth={2} color={active ? tontine.couleur : "#9ca3af"} />
                        {t.badge && t.badge > 0 && (
                          <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center text-[9px] font-black text-white">{t.badge}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-black mt-0.5" style={{ color: active ? tontine.couleur : "#9ca3af" }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-xs text-gray-400 font-bold">tontine.app</p>
                <p className="font-black text-gray-900 text-lg">{rootTab === "tontines" ? "Mes tontines" : "Paramètres"}</p>
              </div>
              <div className="flex items-center gap-2">
                {totalRetards > 0 && (
                  <button onClick={() => setShowRetards(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-red-50 active:scale-95 transition-all"
                    style={{ border: "1.5px solid #fecaca" }}>
                    <AlertCircle size={14} strokeWidth={2.5} color="#dc2626" />
                    <span className="text-sm font-black text-red-600">{totalRetards}</span>
                  </button>
                )}
                <button onClick={() => setRootTab("parametres")}
                  className="w-10 h-10 rounded-2xl overflow-hidden shadow shrink-0 active:scale-90 transition-all"
                  style={{ border: "2px solid #059669" }}>
                  {adminPhoto
                    ? <img src={adminPhoto} alt="profil" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
                      <User size={18} strokeWidth={2} color="white" />
                    </div>
                  }
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Mobile content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-32">
          {tontine ? (
            <div className="slide" key={`${tontine.id}-${innerTab}`}>
              {innerTab === "collecte"   && <Collecte   t={tontine} onPaye={marquerPaye} onToast={addToast} />}
              {innerTab === "tirage"     && <Tirage     t={tontine} onToast={addToast} onConfirmerEnvoi={confirmerEnvoi} />}
              {innerTab === "historique" && <Historique t={tontine} />}
              {innerTab === "membres"    && <Membres    t={tontine} onAjouterMembre={ajouterMembre} onRetirerMembre={retirerMembre} onToast={addToast} />}
            </div>
          ) : (
            <div className="page" key={rootTab}>
              {rootTab === "tontines"   && <ListeTontines tontines={tontines} onSelect={t => { setSelected(t); setInnerTab("collecte"); }} onCreate={ajouterTontine} onToast={addToast} />}
              {rootTab === "parametres" && <Parametres onToast={addToast} photo={adminPhoto} onPhotoChange={setAdminPhoto} />}
            </div>
          )}
        </main>

        {/* Mobile bottom nav */}
        {!tontine && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 z-20 shadow-[0_-4px_24px_#00000010]">
            <div className="grid grid-cols-2 px-4 py-2">
              {([
                { id: "tontines"   as RootTab, label: "Mes tontines", Icon: RefreshCw as LucideIcon, badge: totalRetards + totalAttente },
                { id: "parametres" as RootTab, label: "Paramètres",   Icon: Settings  as LucideIcon, badge: 0 },
              ]).map(t => {
                const active = rootTab === t.id;
                return (
                  <button key={t.id} onClick={() => setRootTab(t.id)}
                    className="flex flex-col items-center gap-1 py-3 rounded-2xl transition-all relative"
                    style={{ background: active ? "#05966912" : "transparent" }}>
                    {active && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-emerald-500" />}
                    <div className="relative">
                      <t.Icon size={22} strokeWidth={2} color={active ? "#059669" : "#9ca3af"} />
                      {t.badge > 0 && (
                        <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center text-[9px] font-black text-white">{t.badge}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-black" style={{ color: active ? "#059669" : "#9ca3af" }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MODALS (partagés mobile + desktop)
      ══════════════════════════════════════════ */}

      {showEditTontine && tontine && (
        <Modal titre="Modifier la tontine" Icon={Pencil} onClose={() => setShowEditTontine(false)}>
          <div>
            <p className="text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
              <Circle size={14} strokeWidth={2.5} color="#6b7280" />Icône
            </p>
            <div className="flex gap-2 flex-wrap">
              {ICON_KEYS.map(k => (
                <button key={k} onClick={() => setEditForm(f => ({ ...f, iconKey: k }))}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                  style={{ background: editForm.iconKey === k ? "#d1fae5" : "#f3f4f6", border: editForm.iconKey === k ? "2px solid #059669" : "2px solid transparent", color: editForm.iconKey === k ? "#059669" : "#6b7280" }}>
                  {ICON_MAP[k]}
                </button>
              ))}
            </div>
          </div>
          {/* ✅ Icon prop retiré — il est optionnel, pas besoin de passer () => null */}
          <Champ label="Nom" placeholder="Nom de la tontine" val={editForm.nom} onChange={v => setEditForm(f => ({ ...f, nom: v }))} />
          <Champ label="Montant par personne (FCFA)" placeholder="50000" type="number" val={editForm.montant} onChange={v => setEditForm(f => ({ ...f, montant: v }))} />
          <FreqPicker val={editForm.frequence} onChange={f => setEditForm(ff => ({ ...ff, frequence: f }))} />
          <Btn label="Enregistrer les modifications" Icon={Check} onClick={handleModifierTontine} v="vert" />
          <div style={{ borderTop: "1.5px solid #fee2e2", paddingTop: 12 }}>
            <Btn label="Supprimer cette tontine" Icon={Trash2} onClick={() => { setShowEditTontine(false); setShowDeleteTontine(true); }} v="rouge" />
          </div>
        </Modal>
      )}

      {showDeleteTontine && tontine && (
        <Modal titre="Supprimer la tontine" Icon={Trash2} onClose={() => setShowDeleteTontine(false)}>
          <div className="p-4 rounded-2xl" style={{ background: "#fee2e2", border: "2px solid #fca5a5" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} strokeWidth={2.5} color="#dc2626" />
              <p className="font-black text-red-700">Action irréversible</p>
            </div>
            <p className="text-sm text-red-600 leading-relaxed">
              Supprimer <span className="font-black">"{tontine.nom}"</span> effacera définitivement tous les membres, paiements et l'historique.
            </p>
          </div>
          <Btn label="Oui, supprimer définitivement" Icon={Trash2} onClick={handleSupprimerTontine} v="rouge" />
          <Btn label="Non, annuler" Icon={X} onClick={() => setShowDeleteTontine(false)} v="gris" />
        </Modal>
      )}

      {showRetards && (
        <Modal titre="Membres en retard" Icon={AlertCircle} onClose={() => setShowRetards(false)}>
          <div className="p-3 rounded-2xl flex items-center gap-3" style={{ background: "#fee2e2", border: "1.5px solid #fca5a5" }}>
            <AlertTriangle size={18} strokeWidth={2.5} color="#dc2626" className="shrink-0" />
            <p className="text-sm font-black text-red-700">
              {totalRetards} membre{totalRetards > 1 ? "s" : ""} n'ont pas encore payé leurs cotisations en retard.
            </p>
          </div>
          <div className="space-y-3">
            {tontines.map(t => {
              const retardeurs = t.paiements.filter(p => p.statut === "retard").map(p => t.membres.find(m => m.id === p.membreId)!).filter(Boolean);
              if (retardeurs.length === 0) return null;
              return (
                <div key={t.id}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: t.couleur }}>
                      <span style={{ color: "white", display: "flex", transform: "scale(0.55)" }}>{ICON_MAP[t.iconKey]}</span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: t.couleur }}>{t.nom}</p>
                  </div>
                  {retardeurs.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-4 bg-white rounded-2xl mb-2"
                      style={{ border: "1.5px solid #fca5a540", borderLeft: "4px solid #dc2626" }}>
                      <Av i={m.avatar} c={m.couleur} s={46} />
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900">{m.nom}</p>
                        <p className="text-sm text-gray-400 mt-0.5">{m.telephone}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 shrink-0">
                        <AlertTriangle size={11} strokeWidth={3} />{m.retards} retard{m.retards > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <Btn label="Fermer" Icon={X} onClick={() => setShowRetards(false)} v="gris" />
        </Modal>
      )}
    </div>
  );
}