import type { Freq } from "../types";

export const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

export const fmtS = (n: number) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + "M"
    : n >= 1_000
    ? (n / 1_000).toFixed(0) + "k"
    : String(n);

export const freqLabel = (f: Freq): string => {
  if (f.valeur === 1) {
    if (f.unite === "jour")    return "Quotidienne";
    if (f.unite === "semaine") return "Hebdomadaire";
    if (f.unite === "mois")    return "Mensuelle";
  }
  const u = f.valeur === 1 ? f.unite : f.unite + "s";
  return `Tous les ${f.valeur} ${u}`;
};

export const today = () => new Date().toISOString().split("T")[0];

export const COULEURS_PALETTE = [
  "#059669", "#db2777", "#d97706",
  "#7c3aed", "#0284c7", "#ea580c",
  "#9333ea", "#0891b2",
];
