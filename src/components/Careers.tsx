/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  ShieldAlert,
  GitPullRequest,
  CheckCircle,
  HelpCircle,
  User,
  ArrowRight,
  ShieldX
} from "lucide-react";
import { Agent, Grade, Service, Promotion, Mutation, Sanction, Affectation } from "../types";

interface CareersProps {
  agents: Agent[];
  grades: Grade[];
  services: Service[];
  promotions: Promotion[];
  mutations: Mutation[];
  sanctions: Sanction[];
  onAddPromotion: (promo: Promotion) => void;
  onAddMutation: (mut: Mutation) => void;
  onAddSanction: (sanc: Sanction) => void;
}

export default function Careers({
  agents,
  grades,
  services,
  promotions,
  mutations,
  sanctions,
  onAddPromotion,
  onAddMutation,
  onAddSanction
}: CareersProps) {
  // Navigation: "liste" or "actionner"
  const [activeTab, setActiveTab] = useState<"promotions" | "mutations" | "sanctions">("promotions");

  // Promotion Form States
  const [pAgentId, setPAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [pNouveauGrade, setPNouveauGrade] = useState<number>(grades[1]?.id_grade || 2);
  const [pDate, setPDate] = useState("2026-06-02");

  // Mutation Form States
  const [mAgentId, setMAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [mServiceDest, setMServiceDest] = useState<number>(services[1]?.id_service || 2);
  const [mDate, setMDate] = useState("2026-06-02");

  // Sanction Form States
  const [sAgentId, setSAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [sMotif, setSMotif] = useState("Défaut de probité administrative et assiduité insuffisante (Avertissement)");
  const [sDate, setSDate] = useState("2026-06-02");

  // Helpers
  const getAgentName = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? `${ag.nom} ${ag.prenom}` : `Agent #${id}`;
  };

  const getAgentMatricule = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? ag.matricule : "A-00000";
  };

  const getGradeLib = (id: number) => grades.find(g => g.id_grade === id)?.libelle || "Grade Inconnu";
  const getGradeCode = (id: number) => grades.find(g => g.id_grade === id)?.code || "Grade";
  const getServiceNom = (id: number) => services.find(s => s.id_service === id)?.nom || "Service Inconnu";

  // Handlers
  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ag = agents.find(a => a.id_agent === Number(pAgentId));
    if (!ag) return;

    if (ag.id_grade === Number(pNouveauGrade)) {
      alert("L'agent possède déjà ce grade. Veuillez sélectionner un échelon ou grade supérieur.");
      return;
    }

    const newPromo: Promotion = {
      id_promotion: promotions.length + 1,
      id_agent: Number(pAgentId),
      ancien_grade: ag.id_grade,
      nouveau_grade: Number(pNouveauGrade),
      date_promotion: pDate
    };

    onAddPromotion(newPromo);
    alert(`Promotion enregistrée avec succès! Le grade de l'agent ${ag.nom} a été mis à jour.`);
  };

  const handleMutationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ag = agents.find(a => a.id_agent === Number(mAgentId));
    if (!ag) return;

    if (ag.id_service === Number(mServiceDest)) {
      alert("L'agent est déjà affecté à ce service d'activité.");
      return;
    }

    const newMut: Mutation = {
      id_mutation: mutations.length + 1,
      id_agent: Number(mAgentId),
      service_source: ag.id_service,
      service_destination: Number(mServiceDest),
      date_mutation: mDate
    };

    onAddMutation(newMut);
    alert(`Mutation d'affectation enregistrée de l'agent ${ag.nom} vers le service : ${getServiceNom(mServiceDest)}.`);
  };

  const handleSanctionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sMotif) {
      alert("Veuillez renseigner le motif de la sanction disciplinaire.");
      return;
    }

    const newSanc: Sanction = {
      id_sanction: sanctions.length + 1,
      id_agent: Number(sAgentId),
      motif: sMotif,
      date_sanction: sDate
    };

    onAddSanction(newSanc);
    alert(`Sanction disciplinaire enregistrée au dossier administratif de l'agent.`);
    setSMotif("");
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Tab Menu Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Mouvements de Carrière & Discipline</h2>
          <p className="text-xs text-slate-500">Administrez l'évolution des carrières d'État : promotions d'échelon, mutations de postes et sanctions disciplinaires.</p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("promotions")}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === "promotions" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            Promotions de Grades
          </button>
          <button
            onClick={() => setActiveTab("mutations")}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === "mutations" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            Mutations de Service
          </button>
          <button
            onClick={() => setActiveTab("sanctions")}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === "sanctions" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            Registre des Sanctions
          </button>
        </div>
      </div>

      {activeTab === "promotions" ? (
        /* Promotions Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Action form */}
          <form onSubmit={handlePromotionSubmit} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Award className="w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Actionner un avancement de Grade</h4>
            </div>
            
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Choisir l'agent à promouvoir</label>
                <select
                  value={pAgentId}
                  onChange={(e) => setPAgentId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs font-semibold text-slate-850"
                >
                  {agents.map(a => (
                    <option key={a.id_agent} value={a.id_agent}>
                      {a.nom} {a.prenom} ({getGradeCode(a.id_grade)})
                    </option>
                  ))}
                </select>
                <span className="text-[9px] text-slate-400 font-mono block italic mt-1">
                  Grade actuel: {getGradeLib(agents.find(a => a.id_agent === pAgentId)?.id_grade || 1)}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Sélectionner Nouveau Grade d'État</label>
                <select
                  value={pNouveauGrade}
                  onChange={(e) => setPNouveauGrade(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs text-slate-800 font-medium"
                >
                  {grades.map(g => (
                    <option key={g.id_grade} value={g.id_grade}>
                      {g.code} — {g.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Date d'effet officielle de la promotion</label>
                <input
                  type="date"
                  value={pDate}
                  onChange={(e) => setPDate(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-emerald-550"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-sm cursor-pointer"
            >
              Enregistrer au dictionnaire d'avancement
            </button>

            <div className="bg-slate-50 p-3 rounded border text-[10.5px] text-slate-500 font-medium flex gap-1 leading-normal">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>La promotion d'un agent recalcule automatiquement sa grille d'indices et met à jour instantanément la base pour la génération des prochains bulletins de paie.</span>
            </div>
          </form>

          {/* Promotion Listing logs */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Historique d'avancements (promotions)</span>
            
            <div className="space-y-2.5 overflow-y-auto max-h-96 pr-1">
              {promotions.map(promo => (
                <div key={promo.id_promotion} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block font-bold text-slate-900">{getAgentName(promo.id_agent)}</strong>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                        <span>Ancien: {getGradeCode(promo.ancien_grade)}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-emerald-600 font-bold">Nouveau: {getGradeCode(promo.nouveau_grade)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">{promo.date_promotion}</span>
                    <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                      Actif en paie
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : activeTab === "mutations" ? (
        /* Mutations Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Action form */}
          <form onSubmit={handleMutationSubmit} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <GitPullRequest className="w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Actionner une mutation de Service</h4>
            </div>
            
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Choisir le fonctionnaire muté</label>
                <select
                  value={mAgentId}
                  onChange={(e) => setMAgentId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-indigo-500 text-xs font-semibold text-slate-800"
                >
                  {agents.map(a => (
                    <option key={a.id_agent} value={a.id_agent}>
                      {a.nom} {a.prenom} ({getAgentMatricule(a.id_agent)})
                    </option>
                  ))}
                </select>
                <span className="text-[9px] text-slate-400 font-mono block italic mt-1 truncate">
                  Service actuel: {getServiceNom(agents.find(a => a.id_agent === mAgentId)?.id_service || 1)}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Sélectionner le Service de Destination d'activité</label>
                <select
                  value={mServiceDest}
                  onChange={(e) => setMServiceDest(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-indigo-500 text-xs"
                >
                  {services.map(s => (
                    <option key={s.id_service} value={s.id_service}>
                      {s.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Date d'affectation au nouveau poste</label>
                <input
                  type="date"
                  value={mDate}
                  onChange={(e) => setMDate(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-indigo-550"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-sm cursor-pointer"
            >
              Enregistrer au dictionnaire d'affectations
            </button>
          </form>

          {/* Mutations Listing logs */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Historique d'affectations (mutations)</span>
            
            <div className="space-y-2.5 overflow-y-auto max-h-96 pr-1">
              {mutations.map(mut => (
                <div key={mut.id_mutation} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <GitPullRequest className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="block font-bold text-slate-900 truncate">{getAgentName(mut.id_agent)}</strong>
                      <span className="text-[10px] text-slate-400 mt-0.5 block truncate leading-normal">
                        Origine: {getServiceNom(mut.service_source)}
                        <br />
                        <span className="text-indigo-600 font-semibold uppercase">Vers: {getServiceNom(mut.service_destination)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 block">{mut.date_mutation}</span>
                    <span className="text-[9px] bg-indigo-50 border border-indigo-250 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase mt-2 inline-block">
                      Approuvé
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Sanctions Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Action form */}
          <form onSubmit={handleSanctionSubmit} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Notifier une Sanction disciplinaire</h4>
            </div>
            
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Choisir l'agent fautif</label>
                <select
                  value={sAgentId}
                  onChange={(e) => setSAgentId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-rose-500 text-xs font-semibold text-slate-800"
                >
                  {agents.map(a => (
                    <option key={a.id_agent} value={a.id_agent}>
                      {a.nom} {a.prenom} ({getAgentMatricule(a.id_agent)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Motif d'État d'avertissement disciplinaire</label>
                <textarea
                  rows={3}
                  value={sMotif}
                  onChange={(e) => setSMotif(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 focus:outline-rose-550 text-xs text-slate-800"
                  placeholder="Saisir la faute administrative avec précision (ex: Prise de congé intempestive, Avertissement écrit...)"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Date d'effet disciplinaire</label>
                <input
                  type="date"
                  value={sDate}
                  onChange={(e) => setSDate(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-rose-550"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-sm cursor-pointer"
            >
              Inscrire de la sanction au dossier agent
            </button>
          </form>

          {/* Sanctions Listing logs */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
              <ShieldX className="w-4 h-4 text-rose-500" />
              <span>Registre d'auditions disciplinaires (sanctions)</span>
            </span>
            
            <div className="space-y-2.5 overflow-y-auto max-h-96 pr-1">
              {sanctions.map(sanc => (
                <div key={sanc.id_sanction} className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 text-rose-700 rounded-lg mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block font-bold text-slate-900">{getAgentName(sanc.id_agent)}</strong>
                      <p className="text-[11px] text-rose-950 mt-1 italic font-medium">
                        "{sanc.motif}"
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 block">{sanc.date_sanction}</span>
                    <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded uppercase mt-2 inline-block">
                      Inscrit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
