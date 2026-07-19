/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  FileText,
  FileCheck2,
  Printer,
  Calculator,
  Users,
  BarChart3,
  WalletCards,
  Search
} from "lucide-react";
import { BulletinPaie, Agent, Grade, EchelleSalariale, Prime, Retenue } from "../types";

interface PaieProps {
  bulletins: BulletinPaie[];
  agents: Agent[];
  grades: Grade[];
  echelles: EchelleSalariale[];
  primes: Prime[];
  retenues: Retenue[];
  onAddBulletin: (newBulletin: BulletinPaie) => void;
}

export default function Paie({
  bulletins,
  agents,
  grades,
  echelles,
  primes,
  retenues,
  onAddBulletin
}: PaieProps) {
  const [activeView, setActiveView] = useState<"preparation" | "history">("preparation");
  const [historyQuery, setHistoryQuery] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Default June
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Allowances checks
  const [activePrimeIds, setActivePrimeIds] = useState<number[]>([1, 4]); // Logement & Ancienneté
  const [activeRetenueIds, setActiveRetenueIds] = useState<number[]>([1, 2, 3]); // Cotisation Mutuelle, IPS, IGR

  // Custom prime state to add on the fly
  const [customPrimeLabel, setCustomPrimeLabel] = useState("");
  const [customPrimeAmount, setCustomPrimeAmount] = useState<number>(25000);
  const [customPrimes, setCustomPrimes] = useState<{ label: string; amount: number }[]>([]);

  const selectedAgent = agents.find(a => a.id_agent === selectedAgentId) || agents[0];
  const agentGrade = grades.find(g => g.id_grade === selectedAgent?.id_grade);
  const agentEchelle = echelles.find(e => e.id_grade === selectedAgent?.id_grade);

  // Computations
  const baseSalary = agentEchelle ? agentEchelle.salaire_base : 520000;
  
  const allowancesSum = React.useMemo(() => {
    let sum = 0;
    activePrimeIds.forEach(id => {
      sum += primes.find(p => p.id_prime === id)?.montant || 0;
    });
    customPrimes.forEach(cp => {
      sum += cp.amount;
    });
    return sum;
  }, [activePrimeIds, customPrimes, primes]);

  const deductionsSum = React.useMemo(() => {
    let sum = 0;
    activeRetenueIds.forEach(id => {
      sum += retenues.find(r => r.id_retenue === id)?.montant || 0;
    });
    return sum;
  }, [activeRetenueIds, retenues]);

  const computedNetSalary = baseSalary + allowancesSum - deductionsSum;
  const periodBulletins = bulletins.filter(b => b.mois === selectedMonth && b.annee === selectedYear);
  const periodNetPayroll = periodBulletins.reduce((sum, bulletin) => sum + Number(bulletin.salaire_net || 0), 0);
  const periodBasePayroll = periodBulletins.reduce((sum, bulletin) => sum + Number(bulletin.salaire_base || 0), 0);
  const currency = (amount: number) => `${Number(amount || 0).toLocaleString("fr-MG")} MGA`;

  const handleCreatePayslip = () => {
    if (!selectedAgent) {
      alert("Aucun agent n'est disponible pour établir un bulletin.");
      return;
    }
    // Check if duplicate payslip already exists for this agent/month/year
    const exists = bulletins.some(b => b.id_agent === selectedAgent.id_agent && b.mois === selectedMonth && b.annee === selectedYear);
    if (exists) {
      alert("Un bulletin de paie a déjà été calculé pour cet agent sur cette période.");
      return;
    }

    const newSlip: BulletinPaie = {
      id_bulletin: bulletins.length + 1,
      id_agent: selectedAgent.id_agent,
      mois: selectedMonth,
      annee: selectedYear,
      salaire_base: baseSalary,
      salaire_net: computedNetSalary
    };

    onAddBulletin(newSlip);
    alert(`Bulletin de paie de l'agent ${selectedAgent.nom} (Mois ${selectedMonth}/${selectedYear}) a été calculé et inscrit en base de données.`);
  };

  const handleAddCustomPrime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrimeLabel) return;
    setCustomPrimes(prev => [...prev, { label: customPrimeLabel, amount: Number(customPrimeAmount) }]);
    setCustomPrimeLabel("");
    setCustomPrimeAmount(25000);
  };

  const togglePrimeCheckbox = (id: number) => {
    setActivePrimeIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const toggleRetenueCheckbox = (id: number) => {
    setActiveRetenueIds(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const getMonthName = (m: number) => {
    const list = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return list[m - 1] || "Mois";
  };

  const visibleBulletins = bulletins.filter(bulletin => {
    const agent = agents.find(item => item.id_agent === bulletin.id_agent);
    const haystack = `${agent?.nom || ""} ${agent?.prenom || ""} ${agent?.matricule || ""} ${getMonthName(bulletin.mois)} ${bulletin.annee}`.toLowerCase();
    return haystack.includes(historyQuery.trim().toLowerCase());
  });

  return (
    <div className="space-y-6 fade-in">
      
      {/* Top action header and selector box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm items-center">
        <div className="md:col-span-8 space-y-1">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Gestion de la Paie & Rémunérations d'État</h2>
          <p className="text-xs text-slate-500">
            Établissez et certifiez les calculs de bulletins de solde publics. Intégrez les primes d'ancienneté, de spécialité, et imputez les taxes Mutuelle IPS légale.
          </p>
        </div>

        {/* Period Selector */}
        <div className="md:col-span-4 bg-slate-50 p-3 rounded-lg border border-slate-205 grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase">Période Mois</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full bg-white border rounded p-1 text-[11px] font-medium"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>{m} — {getMonthName(m)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase">Année Solde</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full bg-white border rounded p-1 text-[11px] font-medium"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payroll navigation and analytical overview */}
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
        <div className="inline-flex self-start gap-1 rounded-xl border border-white/10 bg-[#111720] p-1">
          <button
            type="button"
            onClick={() => setActiveView("preparation")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${activeView === "preparation" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
          >
            <Calculator className="h-4 w-4" /> Préparer la paie
          </button>
          <button
            type="button"
            onClick={() => setActiveView("history")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${activeView === "history" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
          >
            <FileText className="h-4 w-4" /> Bulletins émis
          </button>
        </div>
        <p className="text-[11px] text-slate-500">Référentiel centralisé · Montants exprimés en Ariary malgache (MGA)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <PayrollMetric icon={FileCheck2} label="Bulletins de la période" value={String(periodBulletins.length)} color="indigo" />
        <PayrollMetric icon={WalletCards} label="Masse salariale nette" value={currency(periodNetPayroll)} color="emerald" />
        <PayrollMetric icon={Calculator} label="Solde indiciaire cumulé" value={currency(periodBasePayroll)} color="rose" />
        <PayrollMetric icon={BarChart3} label="Agents rémunérés" value={`${new Set(periodBulletins.map(item => item.id_agent)).size} / ${agents.length}`} color="sky" />
      </div>

      {/* Main split: left settings allowances, right printable PDF slide */}
      {activeView === "preparation" && selectedAgent ? (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: configurations checkboxes and adding items */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Agent select */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Users className="w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Sélection du bénéficiaire</h4>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Fonctionnaire visé</label>
              <select
                value={selectedAgentId}
                onChange={(e) => {
                  setSelectedAgentId(Number(e.target.value));
                  setCustomPrimes([]); // Reset custom allowances on agent switch
                }}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-indigo-500"
              >
                {agents.map(a => (
                  <option key={a.id_agent} value={a.id_agent}>
                    {a.nom} {a.prenom} ({a.matricule})
                  </option>
                ))}
              </select>
              <span className="text-[9px] text-slate-400 italic block mt-1">
                Le salaire de base est lié au grade statutaire ({agentGrade?.code || "A"}).
              </span>
            </div>
          </div>

          {/* 2. Primes configuring */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Indemnités & Primes d'État</span>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {primes.map(pr => {
                const checked = activePrimeIds.includes(pr.id_prime);
                return (
                  <button
                    key={pr.id_prime}
                    type="button"
                    onClick={() => togglePrimeCheckbox(pr.id_prime)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex justify-between items-center transition ${
                      checked ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "border-slate-205 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-medium">{pr.libelle}</span>
                    <strong className="font-mono">{currency(pr.montant)}</strong>
                  </button>
                );
              })}
            </div>

            {/* Custom Primes Form */}
            <form onSubmit={handleAddCustomPrime} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-700 uppercase block">Primes Exceptionnelles</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Motif (ex: Heures Sup)..."
                  value={customPrimeLabel}
                  onChange={(e) => setCustomPrimeLabel(e.target.value)}
                  className="bg-white border rounded px-2 py-1 text-xs flex-1"
                />
                <input
                  type="number"
                  placeholder="Montant"
                  value={customPrimeAmount}
                  onChange={(e) => setCustomPrimeAmount(Number(e.target.value))}
                  className="bg-white border rounded px-1.5 py-1 text-xs w-20 text-center font-mono"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white rounded p-1 hover:bg-slate-800 text-xs px-2.5 cursor-pointer font-bold shrink-0"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>

          {/* 3. Retenues configuring */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Retenues & Cotisations Morales</span>
            
            <div className="space-y-2">
              {retenues.map(ret => {
                const checked = activeRetenueIds.includes(ret.id_retenue);
                return (
                  <button
                    key={ret.id_retenue}
                    type="button"
                    onClick={() => toggleRetenueCheckbox(ret.id_retenue)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex justify-between items-center transition ${
                      checked ? "bg-rose-50 border-rose-300 text-rose-950 font-bold" : "border-slate-205 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-medium">{ret.libelle}</span>
                    <strong className="font-mono text-rose-400">-{currency(ret.montant)}</strong>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: PDF style structured Payslip layout card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            
            {/* Header controls select */}
            <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl flex justify-between items-center shadow-sm">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                Aperçu d'Édition du Bulletin national
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={handleCreatePayslip}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm shadow-emerald-750/10"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Enregistrer en comptabilité</span>
                </button>
              </div>
            </div>

            {/* Structured Government Payslip Card */}
            <div className="bg-white border-2 border-slate-400 p-8 rounded-xl shadow-md min-h-[640px] space-y-6 relative overflow-hidden select-text text-xs leading-normal text-slate-800">
              
              {/* República Coat of Arms representation */}
              <div className="flex justify-between items-start border-b-2 border-slate-450 pb-5">
                <div className="text-left space-y-0.5 uppercase tracking-wide">
                  <h4 className="font-bold text-[11px] text-slate-900 leading-tight">RÉPUBLIQUE DE MADAGASCAR</h4>
                  <p className="text-[9px] text-slate-600 font-medium">Fitiavana • Tanindrazana • Fandrosoana</p>
                  <p className="text-[10px] text-slate-700 font-bold">Ministère de la Fonction Publique</p>
                  <p className="text-[9px] text-slate-500">Direction de la Solde d'État</p>
                </div>

                <div className="text-right uppercase space-y-0.5 font-mono text-[11px]">
                  <h3 className="font-bold text-slate-900 border border-slate-900 p-1 px-3 inline-block rounded font-sans text-xs">
                    BULLETIN DE SOLDE NATIONAL
                  </h3>
                  <span className="block mt-1 font-sans text-[10px]" style={{ textTransform: "capitalize" }}>
                    Mois de: <strong className="text-slate-900">{getMonthName(selectedMonth).toUpperCase()} {selectedYear}</strong>
                  </span>
                  <span className="text-[10px] text-slate-500 block">Status: Définitif d'État</span>
                </div>
              </div>

              {/* Personnel detail metrics */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 border rounded-lg">
                <div className="space-y-1 text-slate-700 font-medium">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">MATRICULE AGENT</span>
                    <strong className="text-slate-950 font-mono text-sm uppercase">{selectedAgent.matricule}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">NOM COMPLET</span>
                    <strong className="text-slate-900 text-xs uppercase">{selectedAgent.nom} {selectedAgent.prenom}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">AFFECTATION ACTUELLE</span>
                    <strong>Secteur Sectoriel Central</strong>
                  </div>
                </div>

                <div className="space-y-1 text-slate-700 font-medium border-l border-slate-200 pl-4">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">CORPS D'ATIVITÉ</span>
                    <strong>{agentGrade ? agentGrade.libelle : "Fonction Administrative"}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">GRADE / ÉCHELLE</span>
                    <strong className="text-emerald-700 font-bold uppercase">{agentGrade?.code || "A"} / {agentEchelle?.indice_min ?? 450}pts</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">MODE DE PAIEMENT</span>
                    <strong>Virement Bancaire (Compte RIB)</strong>
                  </div>
                </div>
              </div>

              {/* Earnings table and Deductions table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b border-slate-300 font-bold uppercase text-[9px] tracking-wider">
                      <th className="py-2 px-3">Code Rubrique</th>
                      <th className="py-2 px-3">Désignation</th>
                      <th className="py-2 px-3 text-right">Part Réglementaire (Gains)</th>
                      <th className="py-2 px-3 text-right">Part Retenues (Charges)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-800 font-mono font-medium">
                    {/* Basic salary */}
                    <tr className="font-semibold text-slate-950">
                      <td className="py-2.5 px-3 uppercase">100-SOLDE_BASE</td>
                      <td className="py-2.5 px-3 font-sans">Solde de base mensuel indiciaire</td>
                      <td className="py-2.5 px-3 text-right font-bold">{currency(baseSalary)}</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">—</td>
                    </tr>

                    {/* Allowances/Primes */}
                    {activePrimeIds.map(id => {
                      const item = primes.find(p => p.id_prime === id);
                      if (!item) return null;
                      return (
                        <tr key={item.id_prime}>
                          <td className="py-2.5 px-3 uppercase text-slate-500">110-PRIME_{item.id_prime}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-700">{item.libelle}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-400 font-bold font-mono">+{currency(item.montant)}</td>
                          <td className="py-2.5 px-3 text-right text-slate-400">—</td>
                        </tr>
                      );
                    })}

                    {/* Custom Primes logs */}
                    {customPrimes.map((cp, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 uppercase text-slate-500">120-PRIME_EX_0{idx+1}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-700">{cp.label}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold font-mono">+{currency(cp.amount)}</td>
                        <td className="py-2.5 px-3 text-right text-slate-400">—</td>
                      </tr>
                    ))}

                    {/* Retenues */}
                    {activeRetenueIds.map(id => {
                      const item = retenues.find(r => r.id_retenue === id);
                      if (!item) return null;
                      return (
                        <tr key={item.id_retenue}>
                          <td className="py-2.5 px-3 uppercase text-slate-500">200-TAXE_{item.id_retenue}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-700">{item.libelle}</td>
                          <td className="py-2.5 px-3 text-right text-slate-400">—</td>
                          <td className="py-2.5 px-3 text-right text-rose-400 font-bold font-mono">-{currency(item.montant)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Calculations calculations summary box */}
              <div className="grid grid-cols-2 gap-4 border-t-2 border-slate-350 pt-5 text-xs text-slate-600 leading-relaxed font-sans">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Sommation budgétaire</span>
                  <div className="space-y-1 font-mono text-[11px] font-medium text-slate-800">
                    <div className="flex justify-between">
                      <span>Total Gain Brut :</span>
                      <strong className="text-slate-900">{currency(baseSalary + allowancesSum)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Retenues :</span>
                      <strong className="text-rose-400 font-bold">-{currency(deductionsSum)}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 text-center font-mono relative flex flex-col justify-center">
                  <span className="text-[9px] uppercase text-slate-400 font-semibold block">Net à payer (MGA)</span>
                  <strong className="text-emerald-400 text-2xl font-bold font-mono block tracking-tight mt-1">
                    {currency(computedNetSalary)}
                  </strong>
                  <span className="text-[8px] text-slate-500 block uppercase tracking-wide mt-1">Délivré par le Trésor Public National</span>
                </div>
              </div>

              {/* Stamps and disclaimer */}
              <div className="border-t border-slate-200 pt-5 mt-4 flex justify-between items-center text-[10px] text-slate-400 select-none">
                <div>
                  <span className="font-bold text-slate-500 block uppercase mb-0.5">SGRH Public V1.2.0 Sync Gateway</span>
                  <span>Signature du Directeur de la Solde d'État</span>
                </div>
                
                {/* Government Stamp of approval stamp symbol */}
                <div className="border-2 border-emerald-600/40 text-emerald-600 p-2.5 rounded-full rotate-6 uppercase font-bold text-[9px] tracking-widest text-center select-none bg-emerald-50/20">
                  <span>Trésor Public</span>
                  <br />
                  <span>MADAGASCAR</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
      ) : activeView === "preparation" ? (
        <section className="bg-[#111720] border border-white/10 rounded-xl p-12 text-center shadow-sm">
          <Users className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-white mt-4">Aucun agent disponible</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            La préparation de la paie nécessite au moins un agent enregistré. Ajoutez un agent dans « Agents & Dossiers » ou vérifiez la synchronisation avec le serveur.
          </p>
          <button type="button" onClick={() => setActiveView("history")} className="mt-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white">
            Consulter les bulletins existants
          </button>
        </section>
      ) : (
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Registre central des bulletins</h3>
              <p className="text-xs text-slate-500 mt-1">Historique des rémunérations enregistrées et validées en comptabilité.</p>
            </div>
            <label className="relative block sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input value={historyQuery} onChange={event => setHistoryQuery(event.target.value)} placeholder="Agent, matricule ou période…" className="w-full rounded-lg border border-white/10 bg-[#0f1218] py-2 pl-9 pr-3 text-xs text-white" />
            </label>
          </div>
          {visibleBulletins.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr><th className="px-5 py-3">Référence</th><th className="px-5 py-3">Agent</th><th className="px-5 py-3">Période</th><th className="px-5 py-3 text-right">Solde de base</th><th className="px-5 py-3 text-right">Net à payer</th><th className="px-5 py-3 text-center">Statut</th></tr></thead>
                <tbody>
                  {visibleBulletins.map(bulletin => {
                    const agent = agents.find(item => item.id_agent === bulletin.id_agent);
                    return (
                      <tr key={bulletin.id_bulletin} className="border-t border-white/5 hover:bg-white/[.02]">
                        <td className="px-5 py-4 font-mono text-indigo-400">BUL-{String(bulletin.id_bulletin).padStart(5, "0")}</td>
                        <td className="px-5 py-4"><strong className="block text-slate-100">{agent ? `${agent.nom} ${agent.prenom || ""}` : `Agent #${bulletin.id_agent}`}</strong><span className="text-[10px] text-slate-500">{agent?.matricule || "Matricule indisponible"}</span></td>
                        <td className="px-5 py-4 text-slate-300">{getMonthName(bulletin.mois)} {bulletin.annee}</td>
                        <td className="px-5 py-4 text-right font-mono text-slate-300">{currency(bulletin.salaire_base)}</td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400">{currency(bulletin.salaire_net)}</td>
                        <td className="px-5 py-4 text-center"><span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">VALIDÉ</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center"><FileText className="w-8 h-8 text-slate-600 mx-auto"/><h4 className="text-sm font-semibold text-slate-300 mt-3">Aucun bulletin trouvé</h4><p className="text-xs text-slate-500 mt-1">Préparez un bulletin ou modifiez votre recherche.</p></div>
          )}
        </section>
      )}
    </div>
  );
}

function PayrollMetric({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: "indigo" | "emerald" | "rose" | "sky" }) {
  const colors = { indigo: "text-indigo-400 bg-indigo-500/10", emerald: "text-emerald-400 bg-emerald-500/10", rose: "text-rose-400 bg-rose-500/10", sky: "text-sky-400 bg-sky-500/10" };
  return <div className="bg-[#111720] border border-white/10 rounded-xl p-4"><div className={`w-9 h-9 rounded-lg grid place-items-center ${colors[color]}`}><Icon className="w-4 h-4" /></div><span className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-3">{label}</span><strong className="block text-lg text-white mt-1 truncate">{value}</strong></div>;
}
