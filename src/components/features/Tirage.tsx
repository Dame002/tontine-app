import { useState, useRef, useEffect } from "react";
import {
  Shuffle, Wallet, RefreshCw, Trophy, Banknote,
  CheckCircle2, AlertTriangle, ArrowLeft, Check, X,
  Smartphone, Zap, Radio, Copy, Users,
} from "lucide-react";
import type { LucideIcon, Tontine, Membre, PayM, HistEntry, Toast } from "../../types";
import { fmt, today } from "../../utils";
import {
  Av, Btn, Card, CHead, Toggle, Tip,
  Modal, MethodePicker,
} from "../ui";

/* ── Instructions per payment method ── */
const INSTRUCTIONS: Record<PayM, { titre: string; etapes: string[]; couleur: string; Icon: LucideIcon }> = {
  wave: {
    titre: "Envoyer via Wave",
    couleur: "#1d4ed8",
    Icon: Zap,
    etapes: [
      "Ouvrez l'app Wave sur votre téléphone",
      "Appuyez sur « Envoyer de l'argent »",
      "Entrez le numéro du bénéficiaire",
      "Saisissez le montant exact",
      "Vérifiez le nom et confirmez",
      "Revenez ici et appuyez sur « J'ai envoyé »",
    ],
  },
  orange: {
    titre: "Envoyer via Orange Money",
    couleur: "#ea580c",
    Icon: Radio,
    etapes: [
      "Composez *144# sur votre téléphone",
      "Choisissez « Transfert d'argent »",
      "Entrez le numéro du bénéficiaire",
      "Saisissez le montant exact",
      "Confirmez avec votre code secret",
      "Revenez ici et appuyez sur « J'ai envoyé »",
    ],
  },
  cash: {
    titre: "Remise en espèces",
    couleur: "#6b7280",
    Icon: Banknote,
    etapes: [
      "Préparez l'enveloppe avec le montant exact",
      "Remettez l'argent en main propre au bénéficiaire",
      "Faites-lui signer ou prendre une photo comme preuve",
      "Revenez ici et appuyez sur « J'ai remis l'argent »",
    ],
  },
};

/* ── EnvoiStep ── */
const EnvoiStep = ({
  gagnant, cagnotte, methode, onMethodeChange, onConfirmer, onRetour, couleur,
}: {
  gagnant: Membre; cagnotte: number; methode: PayM;
  onMethodeChange: (m: PayM) => void;
  onConfirmer: () => void;
  onRetour: () => void;
  couleur: string;
}) => {
  const [etape, setEtape] = useState<"instructions" | "confirmer">("instructions");
  const [copie, setCopie] = useState(false);
  const instr = INSTRUCTIONS[methode];

  const copierTel = () => {
    navigator.clipboard?.writeText(gagnant.telephone).catch(() => { });
    setCopie(true); setTimeout(() => setCopie(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Bénéficiaire */}
      <div className="rounded-3xl overflow-hidden shadow-sm" style={{ border: `2px solid ${gagnant.couleur}40` }}>
        <div className="p-4" style={{ background: `${gagnant.couleur}08` }}>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: gagnant.couleur }}>
            Bénéficiaire désigné
          </p>
          <div className="flex items-center gap-4">
            <Av i={gagnant.avatar} c={gagnant.couleur} s={60} />
            <div className="flex-1">
              <p className="text-xl font-black text-gray-900">{gagnant.nom}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-base font-bold text-gray-600">{gagnant.telephone}</p>
                <button onClick={copierTel}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-xl text-xs font-black transition-all active:scale-95"
                  style={{ background: copie ? "#d1fae5" : "#f3f4f6", color: copie ? "#059669" : "#6b7280" }}>
                  {copie
                    ? <><CheckCircle2 size={11} strokeWidth={3} />Copié</>
                    : <><Copy size={11} strokeWidth={2.5} />Copier</>}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ background: "white", borderTop: `1.5px solid ${gagnant.couleur}20` }}>
          <div className="flex items-center gap-2">
            <Wallet size={16} strokeWidth={2.5} color="#059669" />
            <span className="text-sm font-semibold text-gray-500">Montant à envoyer</span>
          </div>
          <span className="text-2xl font-black text-emerald-700">{fmt(cagnotte)}</span>
        </div>
      </div>

      {/* Méthode */}
      <Card>
        <CHead Icon={Smartphone} titre="Comment envoyer ?" iconColor="#6b7280" />
        <div className="p-4 space-y-2">
          <MethodePicker val={methode} onChange={onMethodeChange} />
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <div className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1.5px solid #f5f5f5", background: `${instr.couleur}08` }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: instr.couleur }}>
            <instr.Icon size={18} strokeWidth={2.5} color="white" />
          </div>
          <div>
            <p className="font-black text-gray-900">{instr.titre}</p>
            <p className="text-xs text-gray-400">Suivez ces étapes sur votre téléphone</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {instr.etapes.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 text-white"
                style={{ background: i === instr.etapes.length - 1 ? couleur : instr.couleur }}>
                {i === instr.etapes.length - 1 ? <CheckCircle2 size={14} strokeWidth={3} /> : i + 1}
              </div>
              <p className={`text-sm leading-snug ${i === instr.etapes.length - 1 ? "font-black text-gray-900" : "font-semibold text-gray-600"}`}>{e}</p>
            </div>
          ))}
        </div>

        {etape === "instructions" ? (
          <div className="px-4 pb-5 space-y-2">
            <div className="p-3 rounded-2xl flex items-center gap-2 mb-3" style={{ background: "#fef3c7", border: "1.5px solid #fde68a" }}>
              <ArrowLeft size={14} strokeWidth={2.5} color="#d97706" />
              <p className="text-xs font-black text-amber-700">
                Envoyez l'argent maintenant, puis revenez ici pour confirmer.
              </p>
            </div>
            <Btn label="J'ai envoyé l'argent — Confirmer" Icon={CheckCircle2} onClick={() => setEtape("confirmer")} v="vert" />
            <Btn label="Retour" Icon={ArrowLeft} onClick={onRetour} v="gris" />
          </div>
        ) : (
          <div className="px-4 pb-5 space-y-3">
            <div className="p-4 rounded-2xl space-y-3" style={{ background: "#d1fae5", border: "2px solid #6ee7b7" }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} strokeWidth={2.5} color="#059669" />
                <p className="font-black text-emerald-800">Confirmation finale</p>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed">
                Vous confirmez avoir envoyé <span className="font-black">{fmt(cagnotte)}</span> à{" "}
                <span className="font-black">{gagnant.nom}</span> via{" "}
                {methode === "wave" ? "Wave" : methode === "orange" ? "Orange Money" : "espèces"} ?
              </p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white">
                <Av i={gagnant.avatar} c={gagnant.couleur} s={36} />
                <div>
                  <p className="font-black text-gray-900 text-sm">{gagnant.nom}</p>
                  <p className="text-xs text-gray-500">{gagnant.telephone}</p>
                </div>
              </div>
            </div>
            <Btn label="Oui, confirmer l'envoi" Icon={Check} onClick={onConfirmer} v="vert" />
            <Btn label="Non, annuler" Icon={X} onClick={() => setEtape("instructions")} v="gris" />
          </div>
        )}
      </Card>
    </div>
  );
};

/* ── Tirage ── */
interface TirageProps {
  t: Tontine;
  onToast: (m: string, tp: Toast["type"]) => void;
  onConfirmerEnvoi: (h: HistEntry & { gagnantId: number }) => void;
}

export const Tirage = ({ t, onToast, onConfirmerEnvoi }: TirageProps) => {
  const [etape, setEtape] = useState<"tirage" | "envoi" | "done">("tirage");
  const [gagnant, setGagnant] = useState<Membre | null>(null);
  const [display, setDisplay] = useState<Membre | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [exclRetards, setExclRetards] = useState(true);
  const [angle, setAngle] = useState(0);
  const [methodeEnvoi, setMethodeEnvoi] = useState<PayM>("wave");
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cagnotte  = t.paiements.filter(p => p.statut === "payé").length * t.montant;
  const eligibles = t.membres.filter(m => m.actif && !m.aDejaRecu && !(exclRetards && m.retards > 0));
  const dejaBenef = t.membres.filter(m => m.aDejaRecu);
  const excRet    = exclRetards ? t.membres.filter(m => m.actif && !m.aDejaRecu && m.retards > 0) : [];

  const lancer = () => {
    if (eligibles.length === 0) { onToast("Aucun membre éligible !", "error"); return; }
    setSpinning(true); setGagnant(null);
    let i = 0, sp = 50;
    const spin = () => {
      setDisplay(eligibles[i % eligibles.length]); setAngle(a => a + 28); i++;
      sp = Math.min(sp + 4, 300);
      if (sp < 300) { ref.current = setTimeout(spin, sp); }
      else {
        const p = eligibles[Math.floor(Math.random() * eligibles.length)];
        setDisplay(p); setGagnant(p); setSpinning(false);
        onToast(`${p.nom} est désigné(e) bénéficiaire !`, "success");
      }
    }; spin();
  };

  const confirmer = () => {
    if (!gagnant) return;
    onConfirmerEnvoi({
      cycle: t.cycleActuel, beneficiaire: gagnant.nom, montant: cagnotte,
      date: today(), methode: methodeEnvoi, avatar: gagnant.avatar, couleur: gagnant.couleur,
      gagnantId: gagnant.id,
    });
    onToast(`${fmt(cagnotte)} envoyé à ${gagnant.nom.split(" ")[0]} !`, "success");
    setEtape("done");
  };

  useEffect(() => () => { if (ref.current) clearTimeout(ref.current); }, []);

  if (t.membres.length === 0) return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Shuffle size={28} strokeWidth={1.5} color="#d1d5db" />
      </div>
      <p className="font-black text-gray-700 text-lg">Aucun membre</p>
      <p className="text-sm text-gray-400 mt-2">Ajoutez des membres avant de faire le tirage.</p>
    </div>
  );

  if (etape === "done" && gagnant) return (
    <div className="space-y-5">
      <div className="rounded-3xl p-8 text-center text-white"
        style={{ background: `linear-gradient(135deg,${t.couleur},${t.couleur}cc)` }}>
        <Trophy size={48} strokeWidth={1.5} color="white" className="mx-auto mb-4 opacity-90" />
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-4"
          style={{ background: "rgba(255,255,255,0.2)", border: "4px solid rgba(255,255,255,0.5)" }}>{gagnant.avatar}</div>
        <p className="text-2xl font-black">{gagnant.nom}</p>
        <p className="text-white/70 mt-2">Bénéficiaire du cycle {t.cycleActuel}</p>
        <p className="text-3xl font-black mt-3">{fmt(cagnotte)}</p>
      </div>
      <Tip texte="Pensez à collecter les cotisations pour le prochain cycle !" couleur="#059669" />
      <Btn label="Nouveau tirage" Icon={Shuffle}
        onClick={() => { setEtape("tirage"); setGagnant(null); setDisplay(null); }} v="contour" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Cagnotte */}
      <div className="rounded-3xl p-5 text-center text-white"
        style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Wallet size={16} strokeWidth={2.5} color="#c4b5fd" />
          <p className="text-purple-200 font-semibold">Cagnotte disponible</p>
        </div>
        <p className="text-4xl font-black">{fmt(cagnotte)}</p>
        <p className="text-purple-200 text-sm mt-1">{t.paiements.filter(p => p.statut === "payé").length}/{t.membres.length} membres ont payé</p>
      </div>

      {/* Règles */}
      <Card>
        <CHead Icon={Users} titre="Qui peut gagner ?" sub="Définissez les règles" iconColor="#7c3aed" />
        <div className="p-4 space-y-3">
          <Toggle label="Exclure les membres avec retards"
            desc="Ceux qui ont des cotisations impayées ne participent pas."
            val={exclRetards} onChange={v => { setExclRetards(v); setGagnant(null); setDisplay(null); }} c="#d97706" />

          {dejaBenef.length > 0 && (
            <div className="p-3 rounded-2xl" style={{ background: "#ede9fe" }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={13} strokeWidth={2.5} color="#7c3aed" />
                <p className="text-xs font-black text-purple-700">Ont déjà reçu — exclus automatiquement</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {dejaBenef.map(m => (
                  <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full">
                    <Av i={m.avatar} c={m.couleur} s={20} />
                    <span className="text-[11px] font-black text-gray-400 line-through">{m.nom.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {excRet.length > 0 && (
            <div className="p-3 rounded-2xl" style={{ background: "#fee2e2" }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={13} strokeWidth={2.5} color="#dc2626" />
                <p className="text-xs font-black text-red-700">En retard — exclus du tirage</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {excRet.map(m => (
                  <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full">
                    <Av i={m.avatar} c={m.couleur} s={20} />
                    <span className="text-[11px] font-black text-gray-700">{m.nom.split(" ")[0]}</span>
                    <span className="text-[10px] text-red-400 font-bold">{m.retards}↓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-3 rounded-2xl" style={{ background: "#d1fae5" }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={13} strokeWidth={2.5} color="#059669" />
              <p className="text-xs font-black text-emerald-700">Participent au tirage — {eligibles.length} membres</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {eligibles.map(m => (
                <div key={m.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-150"
                  style={{
                    background: display?.id === m.id && (spinning || !!gagnant) ? m.couleur : "white",
                    border: `2px solid ${m.couleur}40`,
                    transform: display?.id === m.id && spinning ? "scale(1.12)" : "scale(1)",
                  }}>
                  <Av i={m.avatar} c={display?.id === m.id && (spinning || !!gagnant) ? "white" : m.couleur} s={22} />
                  <span className="text-xs font-black"
                    style={{ color: display?.id === m.id && (spinning || !!gagnant) ? "white" : "#374151" }}>
                    {m.nom.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tirage */}
      <Card>
        <CHead Icon={Shuffle} titre="Lancer le tirage" sub="Appuyez sur le bouton" iconColor="#7c3aed" />
        <div className="p-5 text-center space-y-5">
          <div className="min-h-[120px] flex items-center justify-center">
            {gagnant ? (
              <div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-3 shadow-xl"
                  style={{ background: `linear-gradient(135deg,${gagnant.couleur},${gagnant.couleur}bb)` }}>{gagnant.avatar}</div>
                <p className="text-2xl font-black text-gray-900">{gagnant.nom}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Trophy size={16} strokeWidth={2.5} color={t.couleur} />
                  <p className="font-bold" style={{ color: t.couleur }}>Bénéficiaire désigné !</p>
                </div>
              </div>
            ) : spinning && display ? (
              <div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-3"
                  style={{ background: `linear-gradient(${angle}deg,${display.couleur},${display.couleur}88)` }}>{display.avatar}</div>
                <p className="text-xl font-black text-gray-700">{display.nom.split(" ")[0]}</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <RefreshCw size={13} strokeWidth={2.5} color="#9ca3af" className="animate-spin" />
                  <p className="text-sm text-gray-400">Tirage en cours…</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Shuffle size={28} strokeWidth={1.5} color="#d1d5db" />
                </div>
                <p className="text-gray-400 font-semibold">Prêt à tirer au sort</p>
              </div>
            )}
          </div>
          {eligibles.length === 0
            ? <Tip texte="Aucun éligible. Désactivez l'exclusion des retards ou attendez les régularisations." couleur="#dc2626" />
            : <Btn
              label={spinning ? "Tirage en cours…" : gagnant ? "Refaire le tirage" : "Lancer le tirage"}
              Icon={spinning ? RefreshCw : Shuffle}
              onClick={lancer}
              disabled={spinning}
              v={spinning ? "gris" : "vert"}
            />
          }
          {gagnant && etape === "tirage" && (
            <Btn label={`Envoyer ${fmt(cagnotte)} à ${gagnant.nom.split(" ")[0]}`}
              Icon={Banknote} onClick={() => setEtape("envoi")} v="contour" />
          )}
        </div>
      </Card>

      {etape === "envoi" && gagnant && (
        <EnvoiStep
          gagnant={gagnant}
          cagnotte={cagnotte}
          methode={methodeEnvoi}
          onMethodeChange={setMethodeEnvoi}
          onConfirmer={confirmer}
          onRetour={() => setEtape("tirage")}
          couleur={t.couleur}
        />
      )}
    </div>
  );
};