/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  FileText,
  Database,
  Building,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agentCount: number;
  pendingLeavesCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, agentCount, pendingLeavesCount }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "agents", label: "Agents & Dossiers", icon: Users, badge: agentCount },
    { id: "organisation", label: "Organisation & Grades", icon: Building2 },
    { id: "conges", label: "Congés & Absences", icon: CalendarDays, badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined, badgeColor: "bg-amber-500" },
    { id: "presences", label: "Pointage & Présences", icon: Clock },
    { id: "carrieres", label: "Carrières & Mouvements", icon: TrendingUp },
    { id: "evaluations", label: "Évaluations", icon: Award },
    { id: "formations", label: "Formations & Compétences", icon: BookOpen },
    { id: "paie", label: "Gestion de la Paie", icon: FileText },
    { id: "db-schema", label: "Modèle SQL & Audits", icon: Database }
  ];

  return (
    <div className="w-72 bg-[#0F1218] text-slate-300 flex flex-col border-r border-white/10 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 bg-[#0F1218]">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/images/logo.png"
            alt="Logo SGRH RH"
            className="w-11 h-11 object-cover rounded-lg shadow-lg shadow-indigo-500/20 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-tight">SGRH <span className="text-indigo-400">Public</span></h1>
            <p className="text-[10px] text-indigo-400 font-medium tracking-widest uppercase">secteur public • mg</p>
          </div>
        </div>
        
        {/* République indicator */}
        <div className="mt-4 px-3 py-1.5 bg-white/5 rounded flex items-center gap-2 border border-white/10">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider truncate">
            RÉPUBLIQUE DE MADAGASCAR
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all group border ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/25 shadow-lg shadow-indigo-500/5 font-semibold"
                  : "text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? "text-indigo-400 scale-110" : "text-slate-500 group-hover:text-slate-300"
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full text-white ${
                  item.badgeColor || "bg-[#161B22] border border-white/10"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Meta */}
      <div className="p-4 border-t border-white/10 bg-[#0F1218] text-xs text-slate-500">
        <div className="flex items-center justify-between mb-1">
          <span>Version</span>
          <span className="font-mono text-[10px] text-slate-400">v1.2.0-stable</span>
        </div>
        <div className="flex items-center justify-between">
          <span>État Base SQL</span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-400 text-[10px] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Connecté
          </span>
        </div>
      </div>
    </div>
  );
}
