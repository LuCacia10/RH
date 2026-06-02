/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  PlusCircle,
  HelpCircle,
  CheckCircle,
  Sparkles,
  Award,
  Users,
  Search,
  CheckSquare,
  Bookmark
} from "lucide-react";
import { Formation, SessionFormation, InscriptionFormation, Agent, Competence, AgentCompetence, ValeurReference } from "../types";

interface FormationsProps {
  formations: Formation[];
  sessions: SessionFormation[];
  inscriptions: InscriptionFormation[];
  agents: Agent[];
  competences: Competence[];
  agentCompetences: AgentCompetence[];
  valeursRef: ValeurReference[];
  onAddInscription: (agentId: number, sessionId: number) => void;
  onAddAgentCompetence: (agentId: number, compId: number, levelId: number) => void;
}

export default function Formations({
  formations,
  sessions,
  inscriptions,
  agents,
  competences,
  agentCompetences,
  valeursRef,
  onAddInscription,
  onAddAgentCompetence
}: FormationsProps) {
  const [activeTab, setActiveTab] = useState<"formations" | "competences">("formations");

  // Inscription states
  const [insAgentId, setInsAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [insSessionId, setInsSessionId] = useState<number>(sessions[0]?.id_session || 1);

  // Skill assignment states
  const [skAgentId, setSkAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [skCompId, setSkCompId] = useState<number>(competences[0]?.id_competence || 1);
  const [skLevelId, setSkLevelId] = useState<number>(503); // Avancé

  const getAgentName = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? `${ag.nom} ${ag.prenom}` : `Agent #${id}`;
  };

  const getAgentMatricule = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? ag.matricule : "A-00000";
  };

  const getFormationTitle = (sessionId: number) => {
    const sess = sessions.find(s => s.id_session === sessionId);
    if (!sess) return "Formation Générale";
    return formations.find(f => f.id_formation === sess.id_formation)?.titre || "Inconnu";
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if duplicate enrollment
    const exists = inscriptions.some(i => i.id_agent === Number(insAgentId) && i.id_session === Number(insSessionId));
    if (exists) {
      alert("Ce fonctionnaire est déjà officiellement admis à participer à cette session de formation.");
      return;
    }

    onAddInscription(Number(insAgentId), Number(insSessionId));
    alert(`Inscription administrative enregistrée pour ${getAgentName(insAgentId)}.`);
  };

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddAgentCompetence(Number(skAgentId), Number(skCompId), Number(skLevelId));
    alert(`Compétence d'État enregistrée au dictionnaire de compétences de l'agent.`);
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Top dashboard block switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Formations Professionnelles & Compétences</h2>
          <p className="text-xs text-slate-500">
            Pilotez les plans nationaux d'apprentissage. Inscrivez les agents aux sessions de formation et certifiez leurs habilitations métiers.
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab("formations")}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === "formations" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            Sessions de Formation d'État
          </button>
          <button
            onClick={() => setActiveTab("competences")}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === "competences" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"}`}
          >
            Référentiel des Compétences d'Élite
          </button>
        </div>
      </div>

      {activeTab === "formations" ? (
        /* Formations View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Enroll agent card */}
          <form onSubmit={handleEnrollSubmit} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <PlusCircle className="w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Admettre un Fonctionnaire en session</h4>
            </div>
            
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase">1. Sélectionner l'agent à former</label>
                <select
                  value={insAgentId}
                  onChange={(e) => setInsAgentId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-indigo-500 text-xs font-semibold text-slate-850"
                >
                  {agents.map(a => (
                    <option key={a.id_agent} value={a.id_agent}>
                      {a.nom} {a.prenom} ({a.matricule})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase">2. Sélectionner la Session active</label>
                <select
                  value={insSessionId}
                  onChange={(e) => setInsSessionId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-indigo-550 text-xs text-slate-800 font-medium"
                >
                  {sessions.map(s => {
                    const fTitle = formations.find(f => f.id_formation === s.id_formation)?.titre || "Formation";
                    return (
                      <option key={s.id_session} value={s.id_session}>
                        S-{s.id_session} : {fTitle} (du {s.date_debut} au {s.date_fin})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 rounded-lg transition shadow-sm cursor-pointer"
            >
              Immatriculer et valider l'entrée en Formation
            </button>

            <div className="bg-slate-50 p-3.5 rounded border text-[10.5px] text-slate-500 font-medium flex gap-1 leading-normal">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Conforme à la table associative <code>inscriptions_formations</code>. La présence à ces sessions donne lieu à l'attribution automatique de points de mérite de carrière.</span>
            </div>
          </form>

          {/* Planned sessions listing / enrolments detail */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Catalogue des Formations d'État programmées</span>
            
            <div className="space-y-4">
              {sessions.map(ses => {
                const formDetail = formations.find(f => f.id_formation === ses.id_formation);
                const countInscr = inscriptions.filter(i => i.id_session === ses.id_session).length;
                return (
                  <div key={ses.id_session} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition duration-150">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {formDetail?.titre}
                        </h4>
                        <p className="text-xs text-slate-500">{formDetail?.description}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold rounded shrink-0 border border-indigo-100">
                        Session #{ses.id_session}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-150 pt-2.5 text-xs text-slate-500">
                      <span className="font-mono text-[10px] flex items-center gap-1.5 font-semibold text-slate-650">
                        <CalendarDays className="w-4 h-4 text-slate-450" />
                        Période: du {ses.date_debut} au {ses.date_fin}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-200/50 rounded-full text-slate-700 font-bold text-[10px] flex items-center gap-1 font-sans border">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>{countInscr} {countInscr > 1 ? "inscrits" : "inscrit"}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Competencies view */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* New Skill Mapping form */}
          <form onSubmit={handleSkillSubmit} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Award className="w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Habiliter une aptitude métier (Compétence)</h4>
            </div>
            
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-450 uppercase">1. Fonctionnaire concerné</label>
                <select
                  value={skAgentId}
                  onChange={(e) => setSkAgentId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs font-semibold text-slate-800"
                >
                  {agents.map(a => (
                    <option key={a.id_agent} value={a.id_agent}>
                      {a.nom} {a.prenom} ({a.matricule})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-450 uppercase">2. Titre de l'aptitude légale</label>
                <select
                  value={skCompId}
                  onChange={(e) => setSkCompId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs"
                >
                  {competences.map(tc => (
                    <option key={tc.id_competence} value={tc.id_competence}>
                      {tc.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-450 uppercase">3. Niveau d'expertise attesté</label>
                <select
                  value={skLevelId}
                  onChange={(e) => setSkLevelId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs text-slate-700 font-medium"
                >
                  <option value={501}>Notions de base (Débutant)</option>
                  <option value={502}>Compétence Pratique (Intermédiaire)</option>
                  <option value={503}>Maitrise avancée</option>
                  <option value={504}>Rôle d'expert / Formateur</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2.5 rounded-lg transition shadow-sm cursor-pointer"
            >
              Inscrire de force au dictionnaire de compétences
            </button>
          </form>

          {/* Skills referential detailed block */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Cartographie nationale des compétences d'élite d'État</span>
            
            <div className="space-y-4">
              {competences.map(comp => {
                const agentsWithCount = agentCompetences.filter(ac => ac.id_competence === comp.id_competence);
                return (
                  <div key={comp.id_competence} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg shadow-sm">
                      <span className="font-bold text-slate-900">{comp.libelle}</span>
                      <span className="font-mono text-[9px] text-slate-400 font-semibold uppercase">ID COMP: #{comp.id_competence}</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-450 uppercase block font-sans">Fonctionnaires habilités :</span>
                      {agentsWithCount.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Aucun agent détenteur enregistré pour le moment.</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {agentsWithCount.map(ac => {
                            const levelLib = valeursRef.find(v => v.id_valeur_reference === ac.id_niveau)?.libelle || "Acquis";
                            return (
                              <span key={ac.id_agent} className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded font-semibold text-[10px] flex items-center gap-1 uppercase">
                                <Bookmark className="w-2.5 h-2.5 text-emerald-600" />
                                <span>{getAgentName(ac.id_agent).split(" ")[0]} ({levelLib})</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
