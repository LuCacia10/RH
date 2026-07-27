/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CalendarCheck2,
  Hourglass,
  CheckCircle,
  XCircle,
  PlusCircle,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { DemandeConge, Agent, TypeConge, ValeurReference } from "../types";

interface CongesAbsencesProps {
  conges: DemandeConge[];
  agents: Agent[];
  typesConges: TypeConge[];
  valeursRef: ValeurReference[];
  onAddDemandeConge: (demande: Omit<DemandeConge, "id_conge" | "id_statut_conge">) => Promise<void>;
  onModifierStatutConge: (congeId: number, nouveauStatut: number) => void;
  beneficiaries: { userId: number; username: string; email: string; agentId: number; matricule: string; nomComplet: string }[];
  permissions: string[];
}

export default function CongesAbsences({
  conges,
  agents,
  typesConges,
  valeursRef,
  onAddDemandeConge,
  onModifierStatutConge,
  beneficiaries,
  permissions
}: CongesAbsencesProps) {
  const [activeTab, setActiveTab] = useState<"liste" | "nouvelle">("liste");
  const [selectedAgentId, setSelectedAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [selectedTypeId, setSelectedTypeId] = useState<number>(typesConges[0]?.id_type_conge || 1);
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-15");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const canApprove = permissions.includes("LEAVE_APPROVE");
  const canCreate = permissions.includes("LEAVE_REQUEST") || permissions.includes("LEAVE_MANAGE");

  useEffect(() => {
    if (beneficiaries.length && !beneficiaries.some(user => user.agentId === selectedAgentId)) setSelectedAgentId(beneficiaries[0].agentId);
  }, [beneficiaries, selectedAgentId]);

  // Calculated stats
  const totalCount = conges.length;
  const pendingStatusId = valeursRef.find(value => value.code === "ATTENTE")?.id_valeur_reference ?? 401;
  const approvedStatusId = valeursRef.find(value => value.code === "VALIDE")?.id_valeur_reference ?? 402;
  const rejectedStatusId = valeursRef.find(value => value.code === "REJETE")?.id_valeur_reference ?? 403;
  const pendingCount = conges.filter(c => c.id_statut_conge === pendingStatusId).length;
  const approvedCount = conges.filter(c => c.id_statut_conge === approvedStatusId).length;
  const rejectedCount = conges.filter(c => c.id_statut_conge === rejectedStatusId).length;

  const getAgentName = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? `${ag.nom} ${ag.prenom}` : `Agent #${id}`;
  };

  const getAgentMatricule = (id: number) => {
    const ag = agents.find(a => a.id_agent === id);
    return ag ? ag.matricule : "A-00000";
  };

  const getCongeTypeLib = (id: number) => {
    return typesConges.find(t => t.id_type_conge === id)?.libelle || "Congé Régulier";
  };

  const currentTypeMaxDays = typesConges.find(t => t.id_type_conge === selectedTypeId)?.nb_jours || 30;

  // Compute duraction between startDate and endDate
  const dStart = new Date(startDate);
  const dEnd = new Date(endDate);
  const diffTime = Math.abs(dEnd.getTime() - dStart.getTime());
  const calculatedDays = dEnd >= dStart ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;
  
  // Validation guard
  const durationExceededRefMax = calculatedDays > currentTypeMaxDays;

  const handleCreateDemande = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (calculatedDays <= 0) {
      alert("La date de fin doit être postérieure ou égale à la date de début.");
      return;
    }

    if (durationExceededRefMax) {
      alert(`La durée saisie (${calculatedDays} jours) dépasse le quota autorisé pour ce motif (${currentTypeMaxDays} jours).`);
      return;
    }

    const newDemande: Omit<DemandeConge, "id_conge" | "id_statut_conge"> = {
      id_agent: Number(selectedAgentId),
      id_type_conge: Number(selectedTypeId),
      date_debut: startDate,
      date_fin: endDate
    };

    setIsSubmitting(true);
    try {
      await onAddDemandeConge(newDemande);
      setActiveTab("liste");
    } catch {
      setSubmitError("La demande n'a pas pu être enregistrée. Vérifiez la connexion au serveur puis réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Top dashboard summary card and tab menu */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <div className="md:col-span-2 space-y-1 my-auto pr-0 md:pr-4 border-r-0 md:border-r border-slate-150">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Congés Républicains & Absences</h2>
          <p className="text-xs text-slate-500">Planifiez, automatisez et validez les périodes de repos des agents conformes à la réglementation du travail public.</p>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 md:col-span-2 text-center text-xs">
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
            <Hourglass className="w-5 h-5 text-amber-500 mx-auto mb-1 animate-spin" style={{ animationDuration: "12s" }} />
            <strong className="text-slate-900 text-lg block leading-none">{pendingCount}</strong>
            <span className="text-[10px] text-slate-500 block font-medium mt-1 uppercase">En Attente</span>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
            <CalendarCheck2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <strong className="text-slate-900 text-lg block leading-none">{approvedCount}</strong>
            <span className="text-[10px] text-slate-500 block font-medium mt-1 uppercase">Validés</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
            <CalendarDays className="w-5 h-5 text-slate-500 mx-auto mb-1" />
            <strong className="text-slate-900 text-lg block leading-none">{totalCount}</strong>
            <span className="text-[10px] text-slate-500 block font-medium mt-1 uppercase">Total Logs</span>
          </div>
        </div>
      </div>

      {/* Tabs list menu */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl py-3 justify-between items-center -mb-6 border-x">
        <div className="flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("liste")}
            className={`pb-3 border-b-2 px-1 transition ${
              activeTab === "liste" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Suivi des Demandes de Congé
          </button>
          {canCreate && <button
            onClick={() => setActiveTab("nouvelle")}
            className={`pb-3 border-b-2 px-1 transition ${
              activeTab === "nouvelle" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Déposer une Demande de Congé
          </button>}
        </div>

        <span className="text-[10px] text-slate-400 font-mono tracking-wider italic uppercase">
          Table: demandes_conges
        </span>
      </div>

      {activeTab === "liste" ? (
        /* Leave request list view with approval controls */
        <div className="bg-white border border-slate-200 p-6 rounded-b-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Demandes Relevées en Base de Données</span>
            <span className="text-xs text-slate-400 italic">Chef de service ou RH validateur</span>
          </div>

          <div className="space-y-3.5">
            {conges.map((conge) => {
              const isPending = conge.id_statut_conge === pendingStatusId;
              const isApproved = conge.id_statut_conge === approvedStatusId;
              const isRejected = conge.id_statut_conge === rejectedStatusId;

              const startF = new Date(conge.date_debut);
              const endF = new Date(conge.date_fin);
              const daysDiff = Math.abs(endF.getTime() - startF.getTime());
              const days = Math.ceil(daysDiff / (1000 * 60 * 60 * 24)) + 1;

              return (
                <div
                  key={conge.id_conge}
                  id={`conge-log-${conge.id_conge}`}
                  className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl transition duration-150 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="p-3 bg-white border border-slate-200 text-slate-600 rounded-lg shrink-0 shadow-sm">
                      <Clock className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="min-w-0 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm truncate">
                          {getAgentName(conge.id_agent)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold font-mono bg-white border px-1.5 py-0.5 rounded uppercase shrink-0">
                          {getAgentMatricule(conge.id_agent)}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 font-medium">
                        Motif: <strong className="text-slate-900 font-semibold">{getCongeTypeLib(conge.id_type_conge)}</strong>
                      </p>

                      <p className="text-slate-500 font-mono text-[10px] mt-1">
                        Période: du <strong className="text-slate-700">{conge.date_debut}</strong> au <strong className="text-slate-700">{conge.date_fin}</strong> 
                        <span className="ml-1.5 px-1 bg-indigo-50 text-indigo-700 font-bold font-sans rounded text-[9px] uppercase tracking-wide">
                          {days} {days > 1 ? "jours" : "jour"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions / Status block */}
                  <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-end">
                    
                    {isPending ? (canApprove ? (
                      <div className="flex gap-2 items-center">
                        <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] uppercase flex items-center gap-1">
                          <Hourglass className="w-3 h-3 animate-spin" />
                          <span>À valider</span>
                        </span>

                        <div className="flex gap-2">
                          <button
                            id={`approve-conge-${conge.id_conge}`}
                            onClick={() => onModifierStatutConge(conge.id_conge, approvedStatusId)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 px-3.5 rounded text-xs font-semibold cursor-pointer transition shadow-sm h-8"
                          >
                            Valider
                          </button>
                          <button
                            id={`reject-conge-${conge.id_conge}`}
                            onClick={() => onModifierStatutConge(conge.id_conge, rejectedStatusId)}
                            className="bg-white hover:bg-slate-100 border border-slate-350 p-1 px-3 text-slate-700 font-medium text-xs rounded cursor-pointer transition h-8"
                          >
                            Rejeter
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] uppercase flex items-center gap-1">
                        <Hourglass className="w-3 h-3 animate-spin" />
                        <span>En attente de validation RH</span>
                      </span>
                    )) : isApproved ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Demande Approuvée</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Demande Refusée</span>
                      </span>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Demander congé form view */
        <div className="bg-white border border-slate-200 p-6 rounded-b-xl shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Déclarer un départ en congé</h3>
              <p className="text-xs text-slate-500">Introduire une nouvelle période d'absence réglementaire autorisée pour un agent en exercice.</p>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
              validation hiérarchique intégrée
            </span>
          </div>

          <form onSubmit={handleCreateDemande} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">1. Sélectionner le fonctionnaire</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(Number(e.target.value))}
                  disabled={!beneficiaries.length}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs text-slate-800 font-semibold"
                >
                  {!beneficiaries.length && <option value="">Aucun utilisateur associé à un dossier agent</option>}
                  {beneficiaries.map(user => (
                    <option key={user.userId} value={user.agentId}>
                      {user.username} — {user.nomComplet} ({user.matricule})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase">2. Sélectionner le motif légal (Type congé)</label>
                <select
                  value={selectedTypeId}
                  onChange={(e) => setSelectedTypeId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-emerald-500 text-xs"
                >
                  {typesConges.map(tc => (
                    <option key={tc.id_type_conge} value={tc.id_type_conge}>
                      {tc.libelle} (Quota max d'État : {tc.nb_jours} jours)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Date Début repos</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Date Reprise d'activité</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 focus:outline-emerald-500 text-xs"
                  />
                </div>
              </div>

            </div>

            {/* Calculations and rules engine indicators */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Garde de validation réglementaire d'État</span>
                
                <div className="grid grid-cols-2 gap-2 text-center py-2.5 bg-white rounded-lg border">
                  <div>
                    <span className="text-[9px] text-slate-505 block uppercase">Quota autorisé</span>
                    <strong className="text-slate-900 text-base font-mono">{currentTypeMaxDays} jours</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-505 block uppercase font-medium">Durée calculée</span>
                    <strong className={`text-base font-mono block ${durationExceededRefMax ? "text-rose-600" : "text-emerald-600"}`}>
                      {calculatedDays} jours
                    </strong>
                  </div>
                </div>

                {durationExceededRefMax ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded text-[11px] flex gap-1.5 leading-normal">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>ALERTE DE CARGO : La période de repos demandée dépasse le quota d'État autorisé ({currentTypeMaxDays} jours). Veuillez réajuster les dates de congé.</span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded text-[11px] flex gap-1.5 leading-normal">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Conforme : La période de repos est conforme au schéma référentiel d'État pour cet agent.</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                {submitError && <p role="alert" className="mr-auto text-xs text-rose-600">{submitError}</p>}
                <button
                  type="button"
                  onClick={() => setActiveTab("liste")}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={durationExceededRefMax || !beneficiaries.length || isSubmitting}
                  className={`p-2 px-5 font-semibold text-xs text-white rounded shadow-sm cursor-pointer ${
                    durationExceededRefMax || !beneficiaries.length || isSubmitting ? "bg-slate-300 pointer-events-none" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isSubmitting ? "Envoi en cours…" : "Soumettre au validateur hiérarchique"}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
