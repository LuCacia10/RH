/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Database,
  Terminal,
  Copy,
  CheckCircle,
  KeyRound,
  ArrowRight,
  RefreshCw,
  GitCommit,
  HelpCircle
} from "lucide-react";

interface SchemaVisualizerProps {
  ddlScript: string;
}

export default function SchemaVisualizer({ ddlScript }: SchemaVisualizerProps) {
  const [activeTab, setActiveTab] = useState<"erd" | "sql">("erd");
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(ddlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Predefined ERD table nodes reflecting the SQL DDL
  const erdTables = [
    {
      name: "types_reference",
      columns: [
        { name: "id_type_reference", type: "BIGINT", pk: true },
        { name: "code", type: "VARCHAR(50)", unique: true },
        { name: "libelle", type: "VARCHAR(150)" }
      ],
      relations: []
    },
    {
      name: "valeurs_reference",
      columns: [
        { name: "id_valeur_reference", type: "BIGINT", pk: true },
        { name: "id_type_reference", type: "BIGINT", fk: true, ref: "types_reference" },
        { name: "code", type: "VARCHAR(55)", unique: true },
        { name: "libelle", type: "VARCHAR(150)" },
        { name: "actif", type: "BOOLEAN" }
      ],
      relations: ["types_reference"]
    },
    {
      name: "ministeres",
      columns: [
        { name: "id_ministere", type: "BIGINT", pk: true },
        { name: "code", type: "VARCHAR(30)", unique: true },
        { name: "nom", type: "VARCHAR(255)" }
      ],
      relations: []
    },
    {
      name: "directions",
      columns: [
        { name: "id_direction", type: "BIGINT", pk: true },
        { name: "id_ministere", type: "BIGINT", fk: true, ref: "ministeres" },
        { name: "code", type: "VARCHAR(30)" },
        { name: "nom", type: "VARCHAR(255)" }
      ],
      relations: ["ministeres"]
    },
    {
      name: "services",
      columns: [
        { name: "id_service", type: "BIGINT", pk: true },
        { name: "id_direction", type: "BIGINT", fk: true, ref: "directions" },
        { name: "code", type: "VARCHAR(30)" },
        { name: "nom", type: "VARCHAR(255)" }
      ],
      relations: ["directions"]
    },
    {
      name: "agents",
      columns: [
        { name: "id_agent", type: "BIGINT", pk: true },
        { name: "matricule", type: "VARCHAR(50)", unique: true },
        { name: "nom", type: "VARCHAR(100)" },
        { name: "prenom", type: "VARCHAR(100)" },
        { name: "date_naissance", type: "DATE" },
        { name: "lieu_naissance", type: "VARCHAR(150)" },
        { name: "adresse", type: "TEXT" },
        { name: "telephone", type: "VARCHAR(30)" },
        { name: "email", type: "VARCHAR(150)" },
        { name: "id_sexe", type: "BIGINT", fk: true, ref: "valeurs_reference" },
        { name: "id_statut_agent", type: "BIGINT", fk: true, ref: "valeurs_reference" },
        { name: "date_recrutement", type: "DATE" },
        { name: "id_grade", type: "BIGINT", fk: true, ref: "grades" }
      ],
      relations: ["valeurs_reference", "grades"]
    },
    {
      name: "demandes_conges",
      columns: [
        { name: "id_conge", type: "BIGINT", pk: true },
        { name: "id_agent", type: "BIGINT", fk: true, ref: "agents" },
        { name: "id_type_conge", type: "BIGINT", fk: true, ref: "types_conges" },
        { name: "date_debut", type: "DATE" },
        { name: "date_fin", type: "DATE" },
        { name: "id_statut_conge", type: "BIGINT", fk: true, ref: "valeurs_reference" }
      ],
      relations: ["agents", "valeurs_reference"]
    },
    {
      name: "bulletins_paie",
      columns: [
        { name: "id_bulletin", type: "BIGINT", pk: true },
        { name: "id_agent", type: "BIGINT", fk: true, ref: "agents" },
        { name: "mois", type: "INT" },
        { name: "annee", type: "YEAR" },
        { name: "salaire_base", type: "DECIMAL(15,2)" },
        { name: "salaire_net", type: "DECIMAL(15,2)" }
      ],
      relations: ["agents"]
    }
  ];

  return (
    <div className="space-y-6 fade-in">
      
      {/* Tab Switcher Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Architecture SQL & Religiosité Mappings</h2>
          <p className="text-xs text-slate-500">Examinez le schéma relationnel et téléchargez la structure SQL complète (sgrh_public).</p>
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("erd")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "erd" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Diagramme Relationnel (ERD)
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "sql" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Script DDL SQL Complet
          </button>
        </div>
      </div>

      {activeTab === "erd" ? (
        /* ERD Panel Interactive with relationships highlighting */
        <div className="space-y-6">
          
          {/* Help box */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block font-mono">Modèle relationnel physique d'État</span>
              <h4 className="font-bold text-slate-100 leading-snug">Visualiseur Interactif des Tables Principal de la BD</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
                Cliquez sur n'importe quelle table de la grille pour mettre en surbrillance ses relations de clés étrangères (FK) et examiner ses contraintes d'intégrité référentielle d'État.
              </p>
            </div>
            {selectedTable && (
              <button
                onClick={() => setSelectedTable(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-250 font-bold text-xs border border-slate-705 rounded hover:text-white shrink-0 cursor-pointer"
              >
                Réinitialiser la sélection
              </button>
            )}
          </div>

          {/* Table Grid blocks mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {erdTables.map(tbl => {
              const isActive = selectedTable === tbl.name;
              const isHighlightNeighbor = selectedTable && (tbl.relations.includes(selectedTable) || erdTables.find(t => t.name === selectedTable)?.relations.includes(tbl.name));
              
              const borderStyles = isActive 
                ? "border-emerald-600 ring-2 ring-emerald-500/10 shadow-lg bg-emerald-50/5"
                : isHighlightNeighbor 
                ? "border-indigo-500 ring-2 ring-indigo-500/5 shadow-md bg-indigo-50/5" 
                : "border-slate-201 bg-white hover:border-slate-300 shadow-sm";

              return (
                <div
                  key={tbl.name}
                  onClick={() => setSelectedTable(tbl.name)}
                  className={`p-4 border rounded-xl transition-all cursor-pointer ${borderStyles}`}
                >
                  {/* Table Header block */}
                  <div className={`-mx-4 -mt-4 p-3 border-b flex items-center justify-between rounded-t-xl ${
                    isActive ? "bg-emerald-600 text-white" : isHighlightNeighbor ? "bg-indigo-650 text-white" : "bg-slate-50 text-slate-800"
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase tracking-wide">
                      <Database className="w-3.5 h-3.5 shrink-0" />
                      <span>{tbl.name}</span>
                    </div>
                    <span className="text-[9px] font-mono opacity-80 opacity-60">TABLE</span>
                  </div>

                  {/* Columns block */}
                  <div className="space-y-2 pt-3 font-mono text-[10px]">
                    {tbl.columns.map(col => (
                      <div key={col.name} className="flex justify-between items-center text-slate-600">
                        <span className="flex items-center gap-1 leading-normal">
                          {col.pk ? (
                            <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : col.fk ? (
                            <GitCommit className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-350 shrink-0"></span>
                          )}
                          <span className={`font-semibold ${col.pk ? "text-slate-900" : ""}`}>{col.name}</span>
                        </span>
                        <span className="text-slate-400 font-semibold">{col.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Active Relationship Lines drawer */}
                  {tbl.relations.length > 0 && (
                    <div className={`mt-3 pt-2.5 border-t text-[9px] font-sans text-slate-400 space-y-1 ${isActive ? "border-emerald-250" : "border-slate-100"}`}>
                      <span className="font-bold flex items-center gap-1 uppercase tracking-wide text-slate-450">
                        <span>Clés Étrangères:</span>
                      </span>
                      {tbl.columns.filter(c => c.fk).map(col => (
                        <div key={col.name} className="flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-mono text-indigo-600 font-bold">{col.name}</span>
                          <span>➜</span>
                          <span className="font-mono font-semibold text-slate-700 uppercase">{col.ref}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl text-[11px] text-slate-500 flex gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="leading-relaxed">
              <strong>Architecture Relationnelle:</strong> Ce dictionnaire visuel reflète fidèlement la structure relationnelle MySQL d'État. Les contraintes d'intégrité garantissent qu'aucun agent déchu ne conserve ses indices salariaux actifs en comptabilité.
            </p>
          </div>

        </div>
      ) : (
        /* Formatter Script SQL panel */
        <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-500" />
              <div>
                <h4 className="font-mono text-sm uppercase text-slate-100 font-bold">sgrh_public_schema.sql</h4>
                <p className="text-[10px] text-slate-400">Script complet de création de la Base de données nationale</p>
              </div>
            </div>

            <button
              id="btn-copy-sql"
              onClick={handleCopySql}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white flex items-center gap-2 text-xs font-semibold p-2 px-4 rounded border border-slate-700 cursor-pointer transition"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copier le Script</span>
                </>
              )}
            </button>
          </div>

          <pre className="font-mono text-[11.5px] p-4 bg-slate-900 rounded-xl overflow-x-auto max-h-120 pr-3 scrollbar-thin text-slate-350 leading-relaxed">
            {ddlScript}
          </pre>
        </div>
      )}

    </div>
  );
}
