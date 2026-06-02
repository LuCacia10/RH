/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Users,
  CalendarCheck2,
  DollarSign,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { Agent, Ministere, Presence, DemandeConge, BulletinPaie, JournalAudit } from "../types";

interface DashboardProps {
  agents: Agent[];
  ministeres: Ministere[];
  presences: Presence[];
  conges: DemandeConge[];
  bulletins: BulletinPaie[];
  audits: JournalAudit[];
  onQuickAction: (tab: string) => void;
}

export default function Dashboard({
  agents,
  ministeres,
  presences,
  conges,
  bulletins,
  audits,
  onQuickAction
}: DashboardProps) {
  // Stat 1: Total Agents
  const totalAgents = agents.length;
  const menCount = agents.filter(a => a.id_sexe === 101).length;
  const womenCount = agents.filter(a => a.id_sexe === 102).length;
  const womenRatio = totalAgents > 0 ? Math.round((womenCount / totalAgents) * 100) : 0;

  // Stat 2: Présences du jour (Taux de présence)
  // Utilisons la date du 2026-06-02 (date de simulation)
  const todayDate = "2026-06-02";
  const todayPresences = presences.filter(p => p.date_presence === todayDate);
  const presentCount = todayPresences.filter(p => p.id_statut_presence === 301 || p.id_statut_presence === 302).length;
  const absentCount = todayPresences.filter(p => p.id_statut_presence === 303).length;
  const excuseCount = todayPresences.filter(p => p.id_statut_presence === 304).length;
  
  const activeCount = todayPresences.length || 5; 
  const presenceRate = Math.round((presentCount / (activeCount - excuseCount || 5)) * 100) || 80;

  // Stat 3: Demandes de congés en attente
  const pendingLeaves = conges.filter(c => c.id_statut_conge === 401).length;

  // Stat 4: Budget Paie Mensuelle estimé
  const totalPayroll = bulletins.reduce((acc, curr) => acc + curr.salaire_net, 0) || 2886600;

  // Distribution des Agents par Ministère
  const ministereStats = ministeres.map(min => {
    const count = agents.filter(a => a.id_ministere === min.id_ministere).length;
    return {
      name: min.code,
      fullName: min.nom,
      count,
      percentage: totalAgents > 0 ? (count / totalAgents) * 100 : 0
    };
  });

  // Tri pour diagramme à barres
  const maxAgentInMin = Math.max(...ministereStats.map(m => m.count), 1);

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-indigo-950 via-[#161B22] to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-white/5">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-12 select-none pointer-events-none">
          <TrendingUp className="w-64 h-64 rotate-12 text-indigo-500" />
        </div>
        
        <div className="space-y-1.5 relative z-10">
          <span className="px-2.5 py-0.5 bg-indigo-500/20 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
            Portail Ministériel SGRH
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Bonjour, Administrateur Central</h2>
          <p className="text-slate-300 text-xs max-w-xl">
            Bienvenue dans l'espace national de contrôle des ressources humaines de l'administration publique. Tous vos indicateurs statistiques et dossiers agents ont été chargés.
          </p>
        </div>

        <div className="mt-4 md:mt-0 relative z-10 shrink-0">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-right">
            <span className="text-[10px] uppercase text-indigo-400 font-bold block">Dernier relevé d'audit</span>
            <span className="font-mono text-sm font-semibold block text-white">2026-06-02 21:07</span>
            <span className="text-[10px] text-indigo-300">Base de données stable (MySQL/InnoDB)</span>
          </div>
        </div>
      </div>

      {/* Grid des indicateurs clés (SGRH standard metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Effectif */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Effectif Total</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{totalAgents}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-slate-700">{menCount} Hommes</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">{womenCount} Femmes ({womenRatio}%)</span>
            </p>
          </div>
        </div>

        {/* Card 2: Présences */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taux de Présence</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{presenceRate}%</h3>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all" 
                style={{ width: `${presenceRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Relevé du jour : <span className="font-medium text-slate-700">{presentCount} actifs</span> • <span className="text-amber-600 font-medium">{absentCount} absences</span>
            </p>
          </div>
        </div>

        {/* Card 3: Demandes congés */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demandes Congés</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{pendingLeaves}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {pendingLeaves > 0 ? (
                <span className="text-amber-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Nécessite validation RH
                </span>
              ) : (
                <span className="text-slate-500">Aucune demande en attente</span>
              )}
            </p>
          </div>
        </div>

        {/* Card 4: Masse salariale mensuelle */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Paie Net</span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
              {totalPayroll.toLocaleString("fr-FR")} FCFA
            </h3>
            <p className="text-[11px] text-slate-500 mt-2 block">
              Calculé sur le mois de <span className="font-medium text-slate-700">Mai 2026</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Actions area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Distribution des agents par Ministère (Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-2 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-base leading-tight">Effectifs par Ministère</h4>
              <p className="text-xs text-slate-500">Volume global d'agents affectés aux ministères sectoriels.</p>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
              Données Nationales Actives
            </span>
          </div>

          <div className="space-y-4">
            {ministereStats.map((stat, idx) => {
              const barWidth = stat.count > 0 ? (stat.count / maxAgentInMin) * 100 : 0;
              const barColors = [
                "bg-emerald-600",
                "bg-indigo-600",
                "bg-amber-500",
                "bg-sky-600"
              ];
              const textColors = [
                "text-emerald-700 bg-emerald-50 border-emerald-100",
                "text-indigo-700 bg-indigo-50 border-indigo-100",
                "text-amber-700 bg-amber-50 border-amber-100",
                "text-sky-700 bg-sky-50 border-sky-100"
              ];
              const colorClass = barColors[idx % barColors.length];
              const badgeClass = textColors[idx % textColors.length];

              return (
                <div key={stat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${badgeClass}`}>{stat.name}</span>
                      <span className="font-normal text-slate-500 truncate max-w-sm hidden sm:inline">{stat.fullName}</span>
                    </span>
                    <span className="text-slate-900 font-bold">
                      {stat.count} {stat.count > 1 ? "agents" : "agent"} ({Math.round(stat.percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className={`${colorClass} h-full rounded-full transition-all`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SGRH Quick Action links */}
          <div className="border-t border-slate-150 pt-5 mt-6">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Centre d'actions rapides</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                id="act-recruiting"
                onClick={() => onQuickAction("agents")}
                className="p-3 text-left bg-slate-50 hover:bg-emerald-50 rounded-lg group border border-slate-200 transition-all text-xs"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-900 block">Recruter un agent</span>
                <span className="text-[10px] text-slate-500">Ajout au registre</span>
              </button>

              <button
                id="act-leave-validation"
                onClick={() => onQuickAction("conges")}
                className="p-3 text-left bg-slate-50 hover:bg-amber-50 rounded-lg group border border-slate-200 transition-all text-xs"
              >
                <CalendarCheck2 className="w-4 h-4 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-900 block">Valider des congés</span>
                <span className="text-[10px] text-slate-500">{pendingLeaves} en attente</span>
              </button>

              <button
                id="act-presence"
                onClick={() => onQuickAction("presences")}
                className="p-3 text-left bg-slate-50 hover:bg-indigo-50 rounded-lg group border border-slate-200 transition-all text-xs"
              >
                <Clock className="w-4 h-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-900 block">Faire le pointage</span>
                <span className="text-[10px] text-slate-500">Clôture journalière</span>
              </button>

              <button
                id="act-payrolls"
                onClick={() => onQuickAction("paie")}
                className="p-3 text-left bg-slate-50 hover:bg-sky-50 rounded-lg group border border-slate-200 transition-all text-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-900 block">Fiches de Paie</span>
                <span className="text-[10px] text-slate-500">Générer les bulletins</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Audit trail of SQL operations (Real-time sync representation) */}
        <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base leading-tight flex items-center gap-2">
              <span>Journal d'Audit du Système</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono text-[9px] rounded-full uppercase font-bold tracking-wider animate-pulse">
                live Sync
              </span>
            </h4>
            <p className="text-xs text-slate-400">Traces en base de données (journal_audit)</p>
          </div>

          <div className="space-y-4 my-2 flex-1 overflow-y-auto max-h-80 pr-1.5 scrollbar-thin">
            {audits.map((audit) => (
              <div key={audit.id_audit} className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-slate-700 transition">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] font-mono uppercase font-bold text-slate-300">
                    {audit.table_concernee}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{audit.date_action}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed truncate-2-lines break-all">
                  {audit.action_effectuee}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Utilisateur: admin_central</span>
                  <span className="text-emerald-500">SUCCESS</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 mt-2">
            <p className="text-[11px] text-slate-400 leading-normal flex items-start gap-1 p-2 bg-slate-950/25 rounded border border-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Chaque action effectuée modifie l'état React de simulation et s'ajoute dynamiquement au journal d'audit conformément à la table <code>journal_audit</code>.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
