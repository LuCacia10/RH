/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Clock,
  UserCheck,
  AlertCircle,
  Search,
  CheckCircle,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FolderMinus,
  Briefcase
} from "lucide-react";
import { Presence, Agent, ValeurReference } from "../types";

interface PresencesProps {
  presences: Presence[];
  agents: Agent[];
  valeursRef: ValeurReference[];
  onAddPresence: (newPresence: Presence) => void;
}

export default function Presences({
  presences,
  agents,
  valeursRef,
  onAddPresence
}: PresencesProps) {
  // Local state
  const [activeTab, setActiveTab] = useState<"liste" | "pointage">("liste");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pointage States
  const [pointageAgentId, setPointageAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [pointageStatus, setPointageStatus] = useState<number>(301); // Présent
  const [pointageTimeIn, setPointageTimeIn] = useState("07:30:00");
  const [pointageTimeOut, setPointageTimeOut] = useState("16:30:00");
  const [pointageDate, setPointageDate] = useState("2026-06-02");

  const getAgentName = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? `${ag.nom} ${ag.prenom}` : `Agent #${id}`;
  };

  const getAgentMatricule = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? ag.matricule : "A-00000";
  };

  const getStatusLabel = (id: number) => {
    return valeursRef.find(v => v.id_valeur_reference === id)?.libelle || "Inconnu";
  };

  // Stats computation (on active date e.g. 2026-06-02)
  const todayDate = "2026-06-02";
  const todayRecords = presences.filter(p => p.date_presence === todayDate);
  const totalToday = todayRecords.length;
  const presentToday = todayRecords.filter(p => p.id_statut_presence === 301).length;
  const lateToday = todayRecords.filter(p => p.id_statut_presence === 302).length;
  const absentToday = todayRecords.filter(p => p.id_statut_presence === 303).length;
  const excusedToday = todayRecords.filter(p => p.id_statut_presence === 304).length;

  const attendanceRatio = totalToday > 0 ? Math.round(((presentToday + lateToday) / totalToday) * 100) : 100;

  // Filtered presence listing
  const filteredPresences = presences.filter(p => {
    const agName = getAgentName(p.id_agent).toLowerCase();
    const matricule = getAgentMatricule(p.id_agent).toLowerCase();
    const dateQuery = p.date_presence;
    const searchMatch = agName.includes(searchQuery.toLowerCase()) || matricule.includes(searchQuery.toLowerCase()) || dateQuery.includes(searchQuery);
    return searchMatch;
  });

  const handlePointageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if check-in for this agent already exists on that date
    const exists = presences.some(p => p.id_agent === Number(pointageAgentId) && p.date_presence === pointageDate);
    if (exists) {
      alert("Un pointage existe déjà pour cet agent sur la date sélectionnée. Modification d'historique en base requise.");
      return;
    }

    const newPres: Presence = {
      id_presence: presences.length + 1,
      id_agent: Number(pointageAgentId),
      date_presence: pointageDate,
      heure_arrivee: pointageStatus === 303 ? "" : pointageTimeIn,
      heure_depart: pointageStatus === 303 ? null : pointageTimeOut || null,
      id_statut_presence: Number(pointageStatus)
    };

    onAddPresence(newPres);
    setActiveTab("liste");
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Top dashboard row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <div className="md:col-span-2 space-y-1 my-auto pr-0 md:pr-4 border-r-0 md:border-r border-slate-150">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Registre Quotidien des Présences</h2>
          <p className="text-xs text-slate-500">
            Contrôlez l'assiduité du service public. Enregistrez les heures d'arrivée (pointage) et calculez les statistiques de ponctualité.
          </p>
        </div>

        {/* Attendance KPI metrics */}
        <div className="grid grid-cols-4 gap-2 md:col-span-3 text-center text-xs">
          <div className="p-2 sm:p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Taux Présence</span>
            <strong className="text-lg font-bold text-slate-950 block mt-1 leading-none">{attendanceRatio}%</strong>
            <span className="text-[9px] text-indigo-500 block">Date: {todayDate}</span>
          </div>

          <div className="p-2 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Présents</span>
            <strong className="text-lg font-bold text-slate-950 block mt-1 leading-none">{presentToday}</strong>
            <span className="text-[9px] text-emerald-600 block">À l'heure</span>
          </div>

          <div className="p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Retards</span>
            <strong className="text-lg font-bold text-slate-950 block mt-1 leading-none">{lateToday}</strong>
            <span className="text-[9px] text-amber-600 block">Après 07h30</span>
          </div>

          <div className="p-2 sm:p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Absents</span>
            <strong className="text-lg font-bold text-slate-950 block mt-1 leading-none">{absentToday}</strong>
            <span className="text-[9px] text-rose-600 block">Non excusés</span>
          </div>
        </div>
      </div>

      {/* Main content interface */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Local Tab menu */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-1.5 p-1 bg-slate-200 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab("liste")}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === "liste" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Consulter l'Émargement Historique
            </button>
            <button
              onClick={() => setActiveTab("pointage")}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === "pointage" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Émarger d'un Agent (Pointage)
            </button>
          </div>

          {activeTab === "liste" ? (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher agent ou date (AAAA-MM-JJ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-emerald-550"
              />
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-mono italic">table: presences</span>
          )}
        </div>

        {activeTab === "liste" ? (
          /* Emargement List Grid */
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 font-bold text-[10px] uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Fonctionnaire</th>
                  <th className="py-2.5 px-3">Matricule</th>
                  <th className="py-2.5 px-3">Statut Présence</th>
                  <th className="py-2.5 px-3">Heure Arrivée</th>
                  <th className="py-2.5 px-3">Heure Départ</th>
                  <th className="py-2.5 px-3 text-right">Régularité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredPresences.map((p) => {
                  const statusLabel = getStatusLabel(p.id_statut_presence);
                  
                  // Style colors
                  const pillColors = 
                    p.id_statut_presence === 301 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    p.id_statut_presence === 302 ? "bg-amber-50 text-amber-700 border-amber-100" :
                    p.id_statut_presence === 303 ? "bg-rose-50 text-rose-700 border-rose-100" :
                    "bg-slate-100 text-slate-600 border-slate-200";

                  return (
                    <tr key={p.id_presence} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-semibold text-slate-900">{p.date_presence}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{getAgentName(p.id_agent)}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500 uppercase">{getAgentMatricule(p.id_agent)}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${pillColors}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{p.heure_arrivee || "—"}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{p.heure_depart || "—"}</td>
                      <td className="py-3 px-3 text-right">
                        {p.id_statut_presence === 301 && (
                          <span className="text-emerald-600 font-bold font-sans text-[10px] uppercase">Conforme</span>
                        )}
                        {p.id_statut_presence === 302 && (
                          <span className="text-amber-600 font-bold font-sans text-[10px] uppercase">Retard Justifiable</span>
                        )}
                        {p.id_statut_presence === 303 && (
                          <span className="text-rose-600 font-bold font-sans text-[10px] uppercase">Avertissement SQL</span>
                        )}
                        {p.id_statut_presence === 304 && (
                          <span className="text-slate-500 font-bold font-sans text-[10px] uppercase">Excusé</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Record Pointage View */
          <div className="p-6">
            <form onSubmit={handlePointageSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Fiche d'Émargement Quotidien</span>
                
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">1. Agent demandataire</label>
                  <select
                    value={pointageAgentId}
                    onChange={(e) => setPointageAgentId(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs font-semibold text-slate-800"
                  >
                    {agents.map(a => (
                      <option key={a.id_agent} value={a.id_agent}>
                        {a.nom} {a.prenom} ({a.matricule})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Date d'émargement</label>
                    <input
                      type="date"
                      value={pointageDate}
                      onChange={(e) => setPointageDate(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-emerald-550"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Statut d'assiduité</label>
                    <select
                      value={pointageStatus}
                      onChange={(e) => setPointageStatus(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:outline-emerald-500 text-xs text-slate-705"
                    >
                      <option value={301}>Présent à l'heure</option>
                      <option value={302}>En retard</option>
                      <option value={303}>Absent non justifié</option>
                      <option value={304}>Absent justifié (Excused)</option>
                    </select>
                  </div>
                </div>

                {pointageStatus !== 303 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Heure d'arrivée en poste</label>
                      <input
                        type="text"
                        placeholder="07:30:00"
                        value={pointageTimeIn}
                        onChange={(e) => setPointageTimeIn(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1 font-mono text-xs focus:outline-emerald-550"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Heure de départ (Clôture)</label>
                      <input
                        type="text"
                        placeholder="16:30:00"
                        value={pointageTimeOut}
                        onChange={(e) => setPointageTimeOut(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1 font-mono text-xs focus:outline-emerald-550"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Informative advice */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between h-56">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-indigo-600">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Norme administrative</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    L'horaire de référence officiel est fixé de <strong className="text-slate-800">07h30 à 16h30</strong>. Tout émargement d'arrivée au-delà de 07h30 est automatiquement étiqueté comme <strong>"En retard"</strong> et altère l'indicateur de productivité d'évaluation de l'agent.
                  </p>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("liste")}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Retour historique
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs p-1.5 px-4 rounded shadow-sm cursor-pointer"
                  >
                    Valider le pointage
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
