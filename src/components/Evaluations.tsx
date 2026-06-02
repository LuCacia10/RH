/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Award,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  Percent,
  CheckCircle,
  FileCheck2,
  Calendar,
  Sparkles,
  Search,
  UserCheck
} from "lucide-react";
import { Evaluation, NoteEvaluation, Agent, CampagneEvaluation, CritereEvaluation } from "../types";

interface EvaluationsProps {
  evaluations: Evaluation[];
  notesEvaluation: NoteEvaluation[];
  agents: Agent[];
  campagnes: CampagneEvaluation[];
  criteres: CritereEvaluation[];
  onAddEvaluation: (newEval: Evaluation, notes: NoteEvaluation[]) => void;
}

export default function Evaluations({
  evaluations,
  notesEvaluation,
  agents,
  campagnes,
  criteres,
  onAddEvaluation
}: EvaluationsProps) {
  const [activeTab, setActiveTab] = useState<"liste" | "evaluation">("liste");
  const [searchQuery, setSearchQuery] = useState("");

  // Evaluation Form States
  const [evalAgentId, setEvalAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [evalCampagneId, setEvalCampagneId] = useState<number>(campagnes[0]?.id_campagne || 1);
  
  // Dynamic notes notes record states
  const [scores, setScores] = useState<Record<number, number>>({
    1: 15, // Rendement
    2: 15, // Discipline
    3: 15, // Initiative
    4: 15  // Ethique
  });

  const getAgentName = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? `${ag.nom} ${ag.prenom}` : `Agent #${id}`;
  };

  const getAgentMatricule = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? ag.matricule : "A-00000";
  };

  const getCampagneLib = (id: number) => {
    return campagnes.find(c => c.id_campagne === id)?.libelle || "Campagne Annuelle";
  };

  // Calculate weighted average score for a specific evaluation
  const calculateWeightedAverage = (evalId: number) => {
    const activeNotes = notesEvaluation.filter(n => n.id_evaluation === evalId);
    let totalScoreTimesCoeff = 0;
    let totalCoeffSum = 0;

    activeNotes.forEach(note => {
      const crit = criteres.find(c => c.id_critere === note.id_critere);
      const coeff = crit ? crit.coefficient : 2;
      totalScoreTimesCoeff += note.note * coeff;
      totalCoeffSum += coeff;
    });

    return totalCoeffSum > 0 ? Number((totalScoreTimesCoeff / totalCoeffSum).toFixed(2)) : 10;
  };

  // Calculate current unsaved scoring average in form
  const currentUnsavedAverage = React.useMemo(() => {
    let sumScoreXCoeff = 0;
    let sumCoeff = 0;

    criteres.forEach(crit => {
      const score = scores[crit.id_critere] || 10;
      sumScoreXCoeff += score * crit.coefficient;
      sumCoeff += crit.coefficient;
    });

    return sumCoeff > 0 ? Number((sumScoreXCoeff / sumCoeff).toFixed(2)) : 10;
  }, [scores, criteres]);

  const handleScoreChange = (critId: number, val: number) => {
    let safeVal = Math.max(0, Math.min(20, val));
    setScores(prev => ({
      ...prev,
      [critId]: safeVal
    }));
  };

  const handleCreateEvaluation = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if evaluation for that agent and campaign already exists
    const exists = evaluations.some(ev => ev.id_agent === Number(evalAgentId) && ev.id_campagne === Number(evalCampagneId));
    if (exists) {
      alert("Une évaluation a déjà été validée pour cet agent sous la campagne sélectionnée. Veuillez éditer la fiche existante.");
      return;
    }

    const newEvalId = evaluations.length + 1;
    const newEval: Evaluation = {
      id_evaluation: newEvalId,
      id_agent: Number(evalAgentId),
      id_campagne: Number(evalCampagneId),
      date_evaluation: new Date().toISOString().split('T')[0]
    };

    const newNotes: NoteEvaluation[] = criteres.map(crit => ({
      id_evaluation: newEvalId,
      id_critere: crit.id_critere,
      note: Number(scores[crit.id_critere] || 0)
    }));

    onAddEvaluation(newEval, newNotes);
    alert(`Évaluation enregistrée et signée avec succès pour ${getAgentName(evalAgentId)} (Moyenne : ${currentUnsavedAverage}/20).`);
    setActiveTab("liste");
  };

  // Filtered appraisals lists
  const filteredEvaluations = evaluations.filter(ev => {
    const agName = getAgentName(ev.id_agent).toLowerCase();
    const campLabel = getCampagneLib(ev.id_campagne).toLowerCase();
    const pass = agName.includes(searchQuery.toLowerCase()) || campLabel.includes(searchQuery.toLowerCase());
    return pass;
  });

  return (
    <div className="space-y-6 fade-in">
      
      {/* Top row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Évaluations Annuelles & Rendements</h2>
          <p className="text-xs text-slate-500">
            Évaluez l'efficacité et l'assiduité professionnelle. Renseignez les critères et coefficients de notation prévus par le décret SGRH d'État.
          </p>
        </div>

        {/* Local switcher */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("liste")}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === "liste" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            Fiches d'Évaluation Validées
          </button>
          <button
            onClick={() => setActiveTab("evaluation")}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === "evaluation" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            Évaluer un Fonctionnaire
          </button>
        </div>
      </div>

      {activeTab === "liste" ? (
        /* List Validated Evaluations */
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Fiches Validées dans evaluations / notes_evaluation</span>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer par agent ou campagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredEvaluations.map(ev => {
              const avg = calculateWeightedAverage(ev.id_evaluation);
              const scoreColor = 
                avg >= 16 ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                avg >= 12 ? "text-indigo-700 bg-indigo-50 border-indigo-200" : "text-amber-700 bg-amber-50 border-amber-200";

              return (
                <div key={ev.id_evaluation} className="border border-slate-205 p-5 rounded-xl hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 bg-slate-50/50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-lg shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ID EVAL: #{ev.id_evaluation}</span>
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {ev.date_evaluation}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 text-sm">{getAgentName(ev.id_agent)}</h4>
                    <p className="text-xs font-semibold text-indigo-700 font-mono">
                      {getCampagneLib(ev.id_campagne)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">Moyenne Générale</span>
                    <strong className={`font-mono px-3 py-1 rounded-lg text-sm border font-semibold ${scoreColor}`}>
                      {avg} / 20
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Perform Evaluation view */
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Fiche de Notation & Habilitation</h3>
              <p className="text-xs text-slate-500">Attribution des notes sur 20 aux coefficients d'État correspondants.</p>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono italic">
              table: notes_evaluation
            </span>
          </div>

          <form onSubmit={handleCreateEvaluation} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Input select criteria */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Agent à Auditer</label>
                  <select
                    value={evalAgentId}
                    onChange={(e) => setEvalAgentId(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-555 text-xs text-slate-800 font-semibold"
                  >
                    {agents.map(a => (
                      <option key={a.id_agent} value={a.id_agent}>
                        {a.nom} {a.prenom} ({a.matricule})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Campagne Globale</label>
                  <select
                    value={evalCampagneId}
                    onChange={(e) => setEvalCampagneId(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-555 text-xs text-indigo-700 font-semibold"
                  >
                    {campagnes.map(c => (
                      <option key={c.id_campagne} value={c.id_campagne}>
                        {c.libelle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic list criteria sliders */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Notes par critères d'État</span>
                </span>

                {criteres.map(crit => (
                  <div key={crit.id_critere} className="space-y-1.5 p-3.5 bg-slate-55 rounded-lg border border-slate-201 text-xs hover:border-slate-300 transition duration-150">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 block">
                        {crit.libelle}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-50 border text-indigo-700 text-[10px] font-bold rounded">
                        Coeff : {crit.coefficient}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={20}
                        step={0.5}
                        value={scores[crit.id_critere] ?? 15}
                        onChange={(e) => handleScoreChange(crit.id_critere, Number(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-emerald-600"
                      />
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={scores[crit.id_critere] ?? 15}
                        onChange={(e) => handleScoreChange(crit.id_critere, Number(e.target.value))}
                        className="w-14 bg-white border border-slate-300 rounded text-center py-1 font-mono font-bold text-xs focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Calculations summaries */}
            <div className="lg:col-span-5 bg-slate-900 text-slate-200 p-5 rounded-2xl flex flex-col justify-between font-mono">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-emerald-400">
                  <FileCheck2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Synthèse d'Évaluation</span>
                </div>
                
                <div className="py-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Moyenne Pondérée Calculée</span>
                  <strong className="text-emerald-500 text-4xl font-bold leading-tight my-1.5 block">
                    {currentUnsavedAverage} / 20
                  </strong>
                  <span className="text-[10px] text-slate-500 block uppercase italic">
                    {currentUnsavedAverage >= 16 ? "Niveau Exceptionnel (A+)" :
                     currentUnsavedAverage >= 12 ? "Excellent Travail d'État" : "Niveau à consolider"}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 font-sans">
                  <span className="font-bold text-white block">Remarques juridiques:</span>
                  <p className="leading-normal">
                    La signature de cette fiche valide définitivement la notation de l'agent. Le barème de notation est conservé conformément aux conditions de mutation et avancements d'échelon.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setActiveTab("liste")}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-5 rounded-lg shadow-md hover:scale-102 transition cursor-pointer"
                >
                  Valider et Signer la fiche d'Évaluation
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
