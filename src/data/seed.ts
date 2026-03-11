import type { Membre, Paiement, StatutP, Tontine } from "../types";

const mkP = (ids: number[], statuts: StatutP[]): Paiement[] =>
  ids.map((id, i) => ({
    membreId: id,
    statut: statuts[i] ?? "en attente",
    ...(statuts[i] === "payé"
      ? { date: "2026-03-01", methode: "wave" as const }
      : {}),
  }));

export const SEED_MEMBRES: Membre[] = [
  { id:1, nom:"Aminata Diallo",  telephone:"+221 77 123 45 67", avatar:"AD", couleur:"#059669", aDejaRecu:false, retards:0, actif:true },
  { id:2, nom:"Moussa Traoré",   telephone:"+221 76 234 56 78", avatar:"MT", couleur:"#d97706", aDejaRecu:false, retards:0, actif:true },
  { id:3, nom:"Fatoumata Bah",   telephone:"+221 78 345 67 89", avatar:"FB", couleur:"#db2777", aDejaRecu:false, retards:0, actif:true },
  { id:4, nom:"Ibrahim Konaté",  telephone:"+221 70 456 78 90", avatar:"IK", couleur:"#7c3aed", aDejaRecu:false, retards:3, actif:true },
  { id:5, nom:"Mariama Sow",     telephone:"+221 77 567 89 01", avatar:"MS", couleur:"#0284c7", aDejaRecu:false, retards:0, actif:true },
  { id:6, nom:"Ousmane Ndiaye",  telephone:"+221 76 678 90 12", avatar:"ON", couleur:"#ea580c", aDejaRecu:false, retards:1, actif:true },
  { id:7, nom:"Kadiatou Barry",  telephone:"+221 78 789 01 23", avatar:"KB", couleur:"#9333ea", aDejaRecu:false, retards:2, actif:true },
  { id:8, nom:"Seydou Camara",   telephone:"+221 77 890 12 34", avatar:"SC", couleur:"#0891b2", aDejaRecu:false, retards:0, actif:true },
];

export const SEED_TONTINES: Tontine[] = [
  {
    id: 1,
    nom: "Tontine Famille",
    montant: 50_000,
    frequence: { valeur: 1, unite: "mois" },
    cycleActuel: 5,
    totalCycles: 8,
    dateProchain: "2026-04-01",
    couleur: "#059669",
    iconKey: "users",
    membres: SEED_MEMBRES.slice(0, 6).map(m => ({
      ...m,
      aDejaRecu: m.id === 1 || m.id === 5,
    })),
    paiements: mkP(
      [1, 2, 3, 4, 5, 6],
      ["payé", "payé", "en attente", "retard", "payé", "en attente"]
    ),
    historique: [
      { cycle:4, beneficiaire:"Aminata Diallo",  montant:300_000, date:"2026-02-05", methode:"wave",   avatar:"AD", couleur:"#059669" },
      { cycle:3, beneficiaire:"Mariama Sow",      montant:300_000, date:"2026-01-07", methode:"orange", avatar:"MS", couleur:"#0284c7" },
      { cycle:2, beneficiaire:"Moussa Traoré",    montant:300_000, date:"2025-12-03", methode:"wave",   avatar:"MT", couleur:"#d97706" },
      { cycle:1, beneficiaire:"Fatoumata Bah",    montant:300_000, date:"2025-11-05", methode:"cash",   avatar:"FB", couleur:"#db2777" },
    ],
  },
  {
    id: 2,
    nom: "Groupe Amies",
    montant: 25_000,
    frequence: { valeur: 1, unite: "semaine" },
    cycleActuel: 12,
    totalCycles: 20,
    dateProchain: "2026-03-16",
    couleur: "#db2777",
    iconKey: "star",
    membres: [SEED_MEMBRES[0], SEED_MEMBRES[2], SEED_MEMBRES[4], SEED_MEMBRES[6]].map(m => ({
      ...m,
      aDejaRecu: m.id === 3,
    })),
    paiements: mkP([1, 3, 5, 7], ["payé", "payé", "en attente", "retard"]),
    historique: [
      { cycle:11, beneficiaire:"Fatoumata Bah",  montant:100_000, date:"2026-03-01", methode:"wave",   avatar:"FB", couleur:"#db2777" },
      { cycle:10, beneficiaire:"Aminata Diallo", montant:100_000, date:"2026-02-22", methode:"orange", avatar:"AD", couleur:"#059669" },
    ],
  },
  {
    id: 3,
    nom: "Réseau Pro",
    montant: 100_000,
    frequence: { valeur: 1, unite: "mois" },
    cycleActuel: 2,
    totalCycles: 10,
    dateProchain: "2026-04-01",
    couleur: "#d97706",
    iconKey: "briefcase",
    membres: [SEED_MEMBRES[1], SEED_MEMBRES[3], SEED_MEMBRES[5], SEED_MEMBRES[7]].map(m => ({
      ...m,
      aDejaRecu: false,
    })),
    paiements: mkP([2, 4, 6, 8], ["en attente", "en attente", "en attente", "en attente"]),
    historique: [
      { cycle:1, beneficiaire:"Ousmane Ndiaye", montant:400_000, date:"2026-02-05", methode:"wave", avatar:"ON", couleur:"#ea580c" },
    ],
  },
];
