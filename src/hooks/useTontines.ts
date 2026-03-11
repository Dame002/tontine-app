import { useState } from "react";
import type { Tontine, Membre, HistEntry, StatutP, PayM } from "../types";
import { SEED_TONTINES } from "../data/seed";
import { today } from "../utils";

export function useTontines() {
  const [tontines, setTontines] = useState<Tontine[]>(SEED_TONTINES);
  const [selected, setSelected] = useState<Tontine | null>(null);

  // Always pull the latest version of selected from the list
  const tontine = selected
    ? tontines.find(t => t.id === selected.id) ?? null
    : null;

  const updTontine = (fn: (t: Tontine) => Tontine) => {
    if (!tontine) return;
    const updated = fn(tontine);
    setTontines(ts => ts.map(t => (t.id === updated.id ? updated : t)));
    setSelected(updated);
  };

  const marquerPaye = (membreId: number, methode: PayM) => {
    updTontine(t => ({
      ...t,
      paiements: t.paiements.map(p =>
        p.membreId === membreId
          ? { ...p, statut: "payé" as StatutP, date: today(), methode }
          : p
      ),
    }));
  };

  const ajouterMembre = (m: Membre) => {
    updTontine(t => ({
      ...t,
      membres: [...t.membres, m],
      paiements: [...t.paiements, { membreId: m.id, statut: "en attente" as StatutP }],
    }));
  };

  const retirerMembre = (membreId: number) => {
    updTontine(t => ({
      ...t,
      membres: t.membres.filter(m => m.id !== membreId),
      paiements: t.paiements.filter(p => p.membreId !== membreId),
    }));
  };

  const confirmerEnvoi = (h: HistEntry & { gagnantId: number }) => {
    updTontine(t => {
      const nextCycle = t.cycleActuel + 1;
      return {
        ...t,
        historique: [
          { cycle: h.cycle, beneficiaire: h.beneficiaire, montant: h.montant, date: h.date, methode: h.methode, avatar: h.avatar, couleur: h.couleur },
          ...t.historique,
        ],
        membres: t.membres.map(m =>
          m.id === h.gagnantId ? { ...m, aDejaRecu: true } : m
        ),
        cycleActuel: Math.min(nextCycle, t.totalCycles),
        paiements:
          nextCycle <= t.totalCycles
            ? t.membres.map(m => ({ membreId: m.id, statut: "en attente" as StatutP }))
            : t.paiements,
      };
    });
  };

  const ajouterTontine = (t: Tontine) => {
    setTontines(ts => [...ts, t]);
  };

  const modifierTontine = (patch: Partial<Tontine>) => {
    updTontine(t => ({ ...t, ...patch }));
  };

  const supprimerTontine = () => {
    if (!tontine) return;
    setTontines(ts => ts.filter(t => t.id !== tontine.id));
    setSelected(null);
  };

  return {
    tontines,
    tontine,
    setSelected,
    marquerPaye,
    ajouterMembre,
    retirerMembre,
    confirmerEnvoi,
    ajouterTontine,
    modifierTontine,
    supprimerTontine,
  };
}
