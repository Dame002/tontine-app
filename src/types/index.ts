import type { LucideIcon } from "lucide-react";

export type { LucideIcon };

export type RootTab  = "tontines" | "parametres";
export type InnerTab = "collecte" | "tirage" | "historique" | "membres";
export type FreqUnit = "jour" | "semaine" | "mois";
export type PayM     = "wave" | "orange" | "cash";
export type StatutP  = "payé" | "en attente" | "retard";

export interface Freq {
  valeur: number;
  unite: FreqUnit;
}

export interface Membre {
  id: number;
  nom: string;
  telephone: string;
  avatar: string;
  couleur: string;
  aDejaRecu: boolean;
  retards: number;
  actif: boolean;
}

export interface Paiement {
  membreId: number;
  statut: StatutP;
  date?: string;
  methode?: PayM;
}

export interface HistEntry {
  cycle: number;
  beneficiaire: string;
  montant: number;
  date: string;
  methode: PayM;
  avatar: string;
  couleur: string;
}

export interface Tontine {
  id: number;
  nom: string;
  montant: number;
  frequence: Freq;
  cycleActuel: number;
  totalCycles: number;
  dateProchain: string;
  couleur: string;
  iconKey: string;
  membres: Membre[];
  paiements: Paiement[];
  historique: HistEntry[];
}

export interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info" | "warning";
}