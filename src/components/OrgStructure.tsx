/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Building2,
  GitPullRequest,
  Calculator,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles,
  HelpCircle,
  Briefcase
} from "lucide-react";
import { 
  Ministere, 
  Direction, 
  Service, 
  Bureau, 
  Categorie, 
  Corps, 
  Grade, 
  EchelleSalariale, 
  Poste 
} from "../types";

interface OrgStructureProps {
  ministeres: Ministere[];
  directions: Direction[];
  services: Service[];
  bureaux: Bureau[];
  categories: Categorie[];
  corps: Corps[];
  grades: Grade[];
  echelles: EchelleSalariale[];
  postes: Poste[];
}

export default function OrgStructure({
  ministeres,
  directions,
  services,
  bureaux,
  categories,
  corps,
  grades,
  echelles,
  postes
}: OrgStructureProps) {
  // Navigation inside this tab: "organigramme" or "salary-scale" or "postes"
  const [innerTab, setInnerTab] = useState<"organigramme" | "salary-scale" | "postes">("organigramme");

  // Selection states for Organigramme Collapsible tree
  const [selectedMinId, setSelectedMinId] = useState<number>(1);
  const [selectedDirId, setSelectedDirId] = useState<number>(1);
  const [selectedServId, setSelectedServId] = useState<number>(1);

  // Selection state for Grade Salary Calculator
  const [calcGradeId, setCalcGradeId] = useState<number>(2); // Default to Administrateur Civil Principal (A3)
  const [salaryMultiplier, setSalaryMultiplier] = useState<number>(233); // Multiplicateur d'indice typique de la fonction publique (e.g. 233 FCFA / Point)

  // Computed data for organigram
  const filteredDirections = directions.filter(d => d.id_ministere === selectedMinId);
  
  // ensure the selected Direction belongs to the chosen Ministry; otherwise reset
  const activeDirections = directions.find(d => d.id_direction === selectedDirId && d.id_ministere === selectedMinId)
    ? selectedDirId
    : filteredDirections[0]?.id_direction || 1;

  const filteredServices = services.filter(s => s.id_direction === activeDirections);
  
  // ensure selected Service belongs to the chosen Direction
  const activeServiceId = services.find(s => s.id_service === selectedServId && s.id_direction === activeDirections)
    ? selectedServId
    : filteredServices[0]?.id_service || 1;

  const filteredBureaux = bureaux.filter(b => b.id_service === activeServiceId);

  // Computed data for salary scale
  const selectedGrade = grades.find(g => g.id_grade === calcGradeId);
  const selectedEchelle = echelles.find(e => e.id_grade === calcGradeId);
  const gradeCorps = corps.find(c => c.id_corps === selectedGrade?.id_corps)?.libelle || "N/A";
  const gradeCategorie = categories.find(c => c.id_categorie === selectedGrade?.id_categorie)?.code || "N/A";

  const calculatedBaseMin = selectedEchelle ? selectedEchelle.indice_min * salaryMultiplier : 0;
  const calculatedBaseMax = selectedEchelle ? selectedEchelle.indice_max * salaryMultiplier : 0;

  return (
    <div className="space-y-6 fade-in">
      
      {/* Tab Switcher inside Org Component */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Architecture Administrative & Salariale</h2>
          <p className="text-xs text-slate-500">Visualisation des organigrammes ministériels, cartographie des corps et barèmes d'indices.</p>
        </div>
        
        {/* Switchers buttons */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setInnerTab("organigramme")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              innerTab === "organigramme" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Organigramme National
          </button>
          <button
            onClick={() => setInnerTab("salary-scale")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              innerTab === "salary-scale" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Grades & Grilles Salariales
          </button>
          <button
            onClick={() => setInnerTab("postes")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              innerTab === "postes" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Fiches de Poste
          </button>
        </div>
      </div>

      {innerTab === "organigramme" ? (
        /* organigram View code */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Collapsible Left navigation steps represent SQL Hierarchy */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Hiérarchie Territoriale</span>
            <h4 className="font-bold text-slate-800 text-sm">Sélectionner un Ministère</h4>
            
            <div className="space-y-2">
              {ministeres.map(min => {
                const isSelected = selectedMinId === min.id_ministere;
                return (
                  <button
                    key={min.id_ministere}
                    onClick={() => {
                      setSelectedMinId(min.id_ministere);
                      // Reset cascaded
                      const dirs = directions.filter(d => d.id_ministere === min.id_ministere);
                      if (dirs.length > 0) {
                        setSelectedDirId(dirs[0].id_direction);
                        const servs = services.filter(s => s.id_direction === dirs[0].id_direction);
                        if (servs.length > 0) setSelectedServId(servs[0].id_service);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition ${
                      isSelected 
                        ? "bg-slate-50 border-emerald-500 text-emerald-950 shadow-sm" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className="truncate">{min.code}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Données Nationales</span>
              <span>L'organigramme structure l'autorité administrative depuis les Ministères centraux jusqu'au bureau local d'exécution.</span>
            </div>
          </div>

          {/* Collapsible Cascade visualizer */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ministère choisi</span>
                  <h3 className="font-bold text-slate-900 text-base">
                    {ministeres.find(m => m.id_ministere === selectedMinId)?.nom}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono italic">ID: {selectedMinId}</span>
              </div>

              {/* Steps cascade nodes */}
              <div className="space-y-6 relative">
                
                {/* Node 1: Directions */}
                <div className="flex gap-4 items-start relative after:absolute after:left-5 after:top-10 after:-bottom-6 after:w-0.5 after:bg-indigo-400/30">
                  <div className="relative z-10 w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    Dir
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">Direction Générale d'Administration (Directions)</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {filteredDirections.map(dir => {
                        const isSelected = activeDirections === dir.id_direction;
                        return (
                          <button
                            key={dir.id_direction}
                            id={`dir-node-${dir.id_direction}`}
                            onClick={() => {
                              setSelectedDirId(dir.id_direction);
                              const servs = services.filter(s => s.id_direction === dir.id_direction);
                              if (servs.length > 0) setSelectedServId(servs[0].id_service);
                            }}
                            className={`p-3 text-left border rounded-lg text-xs leading-normal transition ${
                              isSelected 
                                ? "bg-indigo-50/45 border-indigo-500 text-indigo-950 font-semibold" 
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                            }`}
                          >
                            <span className="font-mono text-[10px] text-indigo-500 block">[{dir.code || "DIR"}]</span>
                            <span className="truncate block mt-0.5">{dir.nom}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Node 2: Services */}
                <div className="flex gap-4 items-start relative after:absolute after:left-5 after:top-10 after:-bottom-6 after:w-0.5 after:bg-emerald-400/30">
                  <div className="relative z-10 w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    Serv
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wildest block">Services Opérationnels Sectoriels (Services)</span>
                    
                    {filteredServices.length === 0 ? (
                      <p className="text-xs text-slate-400 italic mt-2">Aucun service rattaché à cette Direction Générale.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {filteredServices.map(ser => {
                          const isSelected = activeServiceId === ser.id_service;
                          return (
                            <button
                              key={ser.id_service}
                              id={`serv-node-${ser.id_service}`}
                              onClick={() => setSelectedServId(ser.id_service)}
                              className={`p-3 text-left border rounded-lg text-xs leading-normal transition ${
                                isSelected 
                                  ? "bg-emerald-50/45 border-emerald-500 text-emerald-950 font-semibold" 
                                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                              }`}
                            >
                              <span className="font-mono text-[10px] text-emerald-600 block">[{ser.code || "SRV"}]</span>
                              <span className="truncate block mt-0.5">{ser.nom}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Node 3: Bureaux locaux */}
                <div className="flex gap-4 items-start relative">
                  <div className="relative z-10 w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    Bur
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Bureaux d'exécution finale (Bureaux)</span>
                    
                    {filteredBureaux.length === 0 ? (
                      <p className="text-xs text-slate-400 italic mt-2">Aucun bureau physique rattaché à ce Service.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                        {filteredBureaux.map(bur => (
                          <div
                            key={bur.id_bureau}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium flex items-center justify-between"
                          >
                            <span className="truncate">{bur.nom}</span>
                            <span className="text-[9px] text-slate-400 font-mono">b-{bur.id_bureau}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      ) : innerTab === "salary-scale" ? (
        /* Salary scale View code */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Index scale parameter calculator */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Calculator className="w-4 h-4" />
              <h4 className="font-bold text-slate-800 text-sm">Calculateur Budgétaire par Grade</h4>
            </div>
            <p className="text-xs text-slate-500">Configurez l'indice national de calcul budgétaire de base pour évaluer la masse salariale.</p>
            
            <div className="space-y-3.5 pt-2">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Rechercher par Grade fonctionnaire</label>
                <select
                  value={calcGradeId}
                  onChange={(e) => setCalcGradeId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-indigo-500 text-xs font-medium"
                >
                  {grades.map(g => (
                    <option key={g.id_grade} value={g.id_grade}>
                      {g.code} - {g.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                  <span>Valeur du point d'indice (FCFA)</span>
                  <span className="text-slate-400 font-mono">{salaryMultiplier} FCFA</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={500}
                  step={5}
                  value={salaryMultiplier}
                  onChange={(e) => setSalaryMultiplier(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Calculated stats */}
              {selectedGrade && (
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-mono text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Simulation de Salaire de Base Mensuelle</span>
                  <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[9px] text-slate-500 block">Indice minimal</span>
                      <strong className="text-white text-sm">{selectedEchelle?.indice_min || 0} pts</strong>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">{calculatedBaseMin.toLocaleString()} F</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">Indice maximal</span>
                      <strong className="text-white text-sm">{selectedEchelle?.indice_max || 0} pts</strong>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">{calculatedBaseMax.toLocaleString()} F</span>
                    </div>
                  </div>
                  
                  <div className="pt-1 select-all">
                    <span className="text-[9px] text-slate-500 block uppercase">Base Statutaire (SQL)</span>
                    <strong className="text-emerald-500 text-lg">{(selectedEchelle?.salaire_base || 0).toLocaleString()} FCFA</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-[11px] text-emerald-800 leading-relaxed flex gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Conforme à la table <code>echelles_salariales</code>. Les indices min/max fixent l'amplitude des avancements d'échelons au sein d'un même grade.</span>
            </div>
          </div>

          {/* Grades Table Detail */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Référentiel des Grades & Indices Nationaux</h4>
                <p className="text-xs text-slate-500">Liste des classifications statutaires par corps et indices de rémunération.</p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 text-[10px] font-mono font-bold">
                8 grades configurés
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 font-bold text-[10px] uppercase">
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Libellé</th>
                    <th className="py-2.5 px-3">Indices Min / Max</th>
                    <th className="py-2.5 px-3 text-right">Salaire Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {grades.map(g => {
                    const ech = echelles.find(e => e.id_grade === g.id_grade);
                    return (
                      <tr key={g.id_grade} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{g.code}</td>
                        <td className="py-3 px-3 flex flex-col">
                          <span>{g.libelle}</span>
                          <span className="text-[10px] text-slate-400">Corps: {corps.find(c => c.id_corps === g.id_corps)?.libelle}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {ech ? `${ech.indice_min} — ${ech.indice_max}` : "N/A"}
                        </td>
                        <td className="py-3 px-3 font-mono text-right font-bold text-slate-900">
                          {ech ? `${ech.salaire_base.toLocaleString("fr-FR")} F` : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* postes (Job Descriptions) list code */
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Fiches de Poste & Profils Type du Secteur Public</h3>
            <p className="text-xs text-slate-500">Aperçu descriptif des affectations de postes configurées dans la table <code>postes</code>.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postes.map(p => (
              <div key={p.id_poste} className="border border-slate-200 p-5 rounded-xl hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 border rounded font-mono text-[10px] text-slate-500 font-semibold uppercase">
                      Code: {p.code}
                    </span>
                    <Briefcase className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{p.intitule}</h4>
                  <p className="text-xs text-slate-600 leading-normal">{p.description}</p>
                </div>
                <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Secteur: Public National</span>
                  <span className="text-emerald-600 font-semibold">Poste Requis</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
