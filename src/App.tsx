/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";

// Imports Subcomponents
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AgentManager from "./components/AgentManager";
import OrgStructure from "./components/OrgStructure";
import CongesAbsences from "./components/CongesAbsences";
import Presences from "./components/Presences";
import Careers from "./components/Careers";
import Evaluations from "./components/Evaluations";
import Formations from "./components/Formations";
import Paie from "./components/Paie";
import SchemaVisualizer from "./components/SchemaVisualizer";
import Login from "./components/Login";
import { AuthUser, clearSession, fetchData, getCurrentUser, getStoredToken, postData, putData } from "./services/api";

// Raw definitions and preloads
import {
  initialTypesReference,
  initialValeursReference,
  initialUtilisateurs,
  initialMinisteres,
  initialDirections,
  initialServices,
  initialBureaux,
  initialCategories,
  initialCorps,
  initialGrades,
  initialEchellesSalariales,
  initialPostes,
  initialAgents,
  initialDossiersAgents,
  initialContactsUrgence,
  initialDocumentsAgents,
  initialAffectations,
  initialPromotions,
  initialMutations,
  initialSanctions,
  initialPresences,
  initialTypesConges,
  initialDemandesConges,
  initialCampagnesEvaluation,
  initialCriteresEvaluation,
  initialEvaluations,
  initialNotesEvaluation,
  initialFormations,
  initialSessionsFormation,
  initialInscriptionsFormations,
  initialCompetences,
  initialAgentCompetences,
  initialPrimes,
  initialRetenues,
  initialBulletinsPaie,
  initialJournalAudit,
  sgrhSqlSchema
} from "./mockData";

import {
  Agent,
  DossierAgent,
  ContactUrgence,
  DocumentAgent,
  Presence,
  DemandeConge,
  Promotion,
  Mutation,
  Sanction,
  InscriptionFormation,
  AgentCompetence,
  BulletinPaie,
  JournalAudit, ValeurReference, Ministere, Direction, Service, Bureau, Grade, Corps, Categorie, Poste, EchelleSalariale
} from "./types";

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(getStoredToken()));
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // React State stores
  const [valeursRef, setValeursRef] = useState<ValeurReference[]>([]);
  const [ministeres, setMinisteres] = useState<Ministere[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [corps, setCorps] = useState<Corps[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [echelles, setEchelles] = useState<EchelleSalariale[]>([]);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [dossiers, setDossiers] = useState<DossierAgent[]>([]);
  const [contacts, setContacts] = useState<ContactUrgence[]>([]);
  const [documents, setDocuments] = useState<DocumentAgent[]>([]);
  const [presences, setPresences] = useState<Presence[]>([]);
  const [conges, setConges] = useState<DemandeConge[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [mutations, setMutations] = useState<Mutation[]>([]);
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  const [inscriptions, setInscriptions] = useState<InscriptionFormation[]>([]);
  const [agentCompetences, setAgentCompetences] = useState<AgentCompetence[]>([]);
  const [bulletins, setBulletins] = useState<BulletinPaie[]>([]);
  const [audits, setAudits] = useState<JournalAudit[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [notesEvaluation, setNotesEvaluation] = useState<any[]>([]);

  useEffect(() => {
    const restore = async () => { if (!getStoredToken()) return; try { setCurrentUser(await getCurrentUser()); } catch { clearSession(); } finally { setAuthLoading(false); } };
    restore(); const logout = () => setCurrentUser(null); window.addEventListener('sgrh:unauthorized', logout);
    return () => window.removeEventListener('sgrh:unauthorized', logout);
  }, []);

  // Fetch all data from backend after authentication
  useEffect(() => {
    if (!currentUser) return;
    const loadDashboardData = async () => {
      const stats = await fetchData('/dashboard/stats');
      if (stats) {
        if (stats.agents) setAgents(stats.agents);
        if (stats.ministeres) setMinisteres(stats.ministeres);
        if (stats.presences) setPresences(stats.presences);
        if (stats.conges) setConges(stats.conges);
        if (stats.bulletins) setBulletins(stats.bulletins);
        if (stats.audits) setAudits(stats.audits);
      }
      
      const refs = await fetchData('/references/valeurs');
      if (refs) setValeursRef(refs);
    };
    loadDashboardData();
  }, [currentUser]);

  // LocalStorage logic removed - synchronising with backend now


  // Helper: Append a new audit trail log row
  const logAudit = (tableName: string, action: string) => {
    const nowHours = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 16);
    const newAudit: JournalAudit = {
      id_audit: audits.length + 1,
      id_utilisateur: 1, // Default admin
      table_concernee: tableName,
      action_effectuee: action,
      date_action: nowHours
    };
    setAudits(prev => [newAudit, ...prev]);
  };

  // State modification Handlers (to pass into modules)
  const handleAddAgent = async (
    newAgent: Agent, 
    dossierObs: string, 
    emergency: { nom: string; telephone: string; lien: string }
  ) => {
    const savedAgent = await postData('/agents', newAgent);
    if (!savedAgent) return;

    setAgents(prev => [...prev, savedAgent]);

    // We could also post dossier and contact here if we have those API endpoints
    // For now, let's just log and update local state to match backend
    logAudit("agents", `INSERT INTO agents - Recrutement agent ${savedAgent.nom} (Matricule: ${savedAgent.matricule})`);
  };

  const handleUploadDocument = (agentId: number, typeDoc: number, fileName: string) => {
    const newDoc: DocumentAgent = {
      id_document: documents.length + 1,
      id_agent: agentId,
      id_type_document: typeDoc,
      fichier: fileName,
      date_ajout: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 16)
    };
    setDocuments(prev => [...prev, newDoc]);
    
    // search agent name
    const agName = agents.find(a => a.id_agent === agentId)?.nom || `#${agentId}`;
    logAudit("documents_agents", `INSERT INTO documents_agents - Ajout pièce '${fileName}' pour l'agent ${agName}`);
  };

  const handleAddDemandeConge = async (demande: DemandeConge) => {
    const saved = await postData('/conges', demande);
    if (saved) {
      setConges(prev => [...prev, saved]);
      const agName = agents.find(a => a.id_agent === demande.id_agent)?.nom || "";
      logAudit("demandes_conges", `INSERT INTO demandes_conges - Demande de congé initiée pour l'agent ${agName}`);
    }
  };

  const handleModifierStatutConge = async (congeId: number, nouveauStatut: number) => {
    const update = { id_conge: congeId, statutConge: { id_valeur_reference: nouveauStatut } };
    await putData(`/conges/${congeId}`, update);
    
    setConges(prev =>
      prev.map(c => c.id_conge === congeId ? { ...c, id_statut_conge: nouveauStatut } : c)
    );
    const conge = conges.find(c => c.id_conge === congeId);
    if (!conge) return;
    const agName = agents.find(a => a.id_agent === conge.id_agent)?.nom || "";
    const label = nouveauStatut === 402 ? "APPROBATION" : "REJET";
    logAudit("demandes_conges", `UPDATE demandes_conges SET id_statut_conge = ${nouveauStatut} - ${label} congé agent ${agName}`);
  };

  const handleAddPresence = async (newPresence: Presence) => {
    const saved = await postData('/presences', newPresence);
    if (saved) {
      setPresences(prev => [...prev, saved]);
      const agName = agents.find(a => a.id_agent === newPresence.id_agent)?.nom || "";
      logAudit("presences", `INSERT INTO presences - Pointage de présence effectué pour l'agent ${agName} (${newPresence.date_presence})`);
    }
  };

  const handleAddPromotion = (promo: Promotion) => {
    setPromotions(prev => [...prev, promo]);
    // Met également à jour le grade de l'agent concerné
    setAgents(prev =>
      prev.map(ag => ag.id_agent === promo.id_agent ? { ...ag, id_grade: promo.nouveau_grade } : ag)
    );
    const agName = agents.find(a => a.id_agent === promo.id_agent)?.nom || "";
    logAudit("promotions", `INSERT INTO promotions - Promotion validée pour l'agent ${agName}. Grade mis à jour.`);
  };

  const handleAddMutation = (mut: Mutation) => {
    setMutations(prev => [...prev, mut]);
    // Met à jour la direction et le service affecté
    setAgents(prev =>
      prev.map(ag => ag.id_agent === mut.id_agent ? { ...ag, id_service: mut.service_destination } : ag)
    );
    const agName = agents.find(a => a.id_agent === mut.id_agent)?.nom || "";
    logAudit("mutations", `INSERT INTO mutations - Mutation de service effectuée pour l'agent ${agName}`);
  };

  const handleAddSanction = (sanc: Sanction) => {
    setSanctions(prev => [...prev, sanc]);
    const agName = agents.find(a => a.id_agent === sanc.id_agent)?.nom || "";
    logAudit("sanctions", `INSERT INTO sanctions - Sanction disciplinaire ajoutée au dossier de l'agent ${agName}`);
  };

  const handleAddEvaluation = (newEval: any, notes: any[]) => {
    setEvaluations(prev => [...prev, newEval]);
    setNotesEvaluation(prev => [...prev, ...notes]);
    const agName = agents.find(a => a.id_agent === newEval.id_agent)?.nom || "";
    logAudit("evaluations", `INSERT INTO evaluations SET id_agent = ${newEval.id_agent} - Audit annuel signé pour l'agent ${agName}`);
  };

  const handleAddInscription = (agentId: number, sessionId: number) => {
    const newInsc: InscriptionFormation = { id_agent: agentId, id_session: sessionId };
    setInscriptions(prev => [...prev, newInsc]);
    const agName = agents.find(a => a.id_agent === agentId)?.nom || "";
    logAudit("inscriptions_formations", `INSERT INTO inscriptions_formations - Matriculation de l'agent ${agName} en formation`);
  };

  const handleAddAgentCompetence = (agentId: number, compId: number, levelId: number) => {
    // Supprime la compétence précédente si elle existe
    setAgentCompetences(prev => {
      const filtered = prev.filter(ac => !(ac.id_agent === agentId && ac.id_competence === compId));
      return [...filtered, { id_agent: agentId, id_competence: compId, id_niveau: levelId }];
    });
    const agName = agents.find(a => a.id_agent === agentId)?.nom || "";
    logAudit("agent_competences", `REPLACE INTO agent_competences - Certification compétence pour l'agent ${agName}`);
  };

  const handleAddBulletin = async (newBulletin: BulletinPaie) => {
    const saved = await postData('/paie/bulletins', newBulletin);
    if (saved) {
      setBulletins(prev => [...prev, saved]);
      const agName = agents.find(a => a.id_agent === newBulletin.id_agent)?.nom || "";
      logAudit("bulletins_paie", `INSERT INTO bulletins_paie - Solde de paie calculée et provisionnée pour l'agent ${agName}`);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-[#0A0C10] text-indigo-400 grid place-items-center">Vérification de la session…</div>;
  if (!currentUser) return <Login onAuthenticated={setCurrentUser}/>;
  const handleLogout=()=>{clearSession();setCurrentUser(null);};
  const pendingLeavesCount = conges.filter(c => c.id_statut_conge === 401).length;

  return (
    <div id="root-sgrh" className="min-h-screen bg-[#0A0C10] text-slate-300 font-sans flex antialiased">
      
      {/* 1. Global Side menu */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        agentCount={agents.length}
        pendingLeavesCount={pendingLeavesCount}
      />

      {/* 2. Main content chassis wrapper */}
      <main className="flex-1 overflow-x-hidden p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Top bar */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block">SERVICES DE L'ÉTAT MALGACHE</span>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mt-1">
              Système de Gestion Numérique des Ressources Humaines (SGRH)
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right hidden sm:block"><span className="text-xs font-semibold text-white block">{currentUser.username}</span><span className="text-[10px] text-slate-500">{currentUser.roles.join(', ')}</span></div>
            <button onClick={handleLogout} className="text-xs border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5">Déconnexion</button>
            <span className="text-[11px] font-mono font-semibold bg-white/5 text-slate-300 px-2.5 py-1 rounded border border-white/10">
              {new Date().toLocaleString('fr-FR')}
            </span>
          </div>
        </header>

        {/* Selected tab conditional viewport router */}
        <div className="fade-in">
          {activeTab === "dashboard" && (
            <Dashboard
              agents={agents}
              ministeres={ministeres}
              presences={presences}
              conges={conges}
              bulletins={bulletins}
              audits={audits}
              onQuickAction={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "agents" && (
            <AgentManager
              agents={agents}
              ministeres={ministeres}
              directions={directions}
              services={services}
              bureaux={bureaux}
              grades={grades}
              postes={postes}
              dossiers={dossiers}
              contacts={contacts}
              documents={documents}
              valeursRef={valeursRef}
              competences={initialCompetences}
              agentCompetences={agentCompetences}
              sanctions={sanctions}
              promotions={promotions}
              onAddAgent={handleAddAgent}
              onUploadDocument={handleUploadDocument}
            />
          )}

          {activeTab === "organisation" && (
            <OrgStructure
              ministeres={initialMinisteres}
              directions={initialDirections}
              services={initialServices}
              bureaux={initialBureaux}
              categories={initialCategories}
              corps={initialCorps}
              grades={initialGrades}
              echelles={initialEchellesSalariales}
              postes={initialPostes}
            />
          )}

          {activeTab === "conges" && (
            <CongesAbsences
              conges={conges}
              agents={agents}
              typesConges={initialTypesConges}
              valeursRef={valeursRef}
              onAddDemandeConge={handleAddDemandeConge}
              onModifierStatutConge={handleModifierStatutConge}
            />
          )}

          {activeTab === "presences" && (
            <Presences
              presences={presences}
              agents={agents}
              valeursRef={valeursRef}
              onAddPresence={handleAddPresence}
            />
          )}

          {activeTab === "carrieres" && (
            <Careers
              agents={agents}
              grades={initialGrades}
              services={initialServices}
              promotions={promotions}
              mutations={mutations}
              sanctions={sanctions}
              onAddPromotion={handleAddPromotion}
              onAddMutation={handleAddMutation}
              onAddSanction={handleAddSanction}
            />
          )}

          {activeTab === "evaluations" && (
            <Evaluations
              evaluations={evaluations}
              notesEvaluation={notesEvaluation}
              agents={agents}
              campagnes={initialCampagnesEvaluation}
              criteres={initialCriteresEvaluation}
              onAddEvaluation={handleAddEvaluation}
            />
          )}

          {activeTab === "formations" && (
            <Formations
              formations={initialFormations}
              sessions={initialSessionsFormation}
              inscriptions={inscriptions}
              agents={agents}
              competences={initialCompetences}
              agentCompetences={agentCompetences}
              valeursRef={initialValeursReference}
              onAddInscription={handleAddInscription}
              onAddAgentCompetence={handleAddAgentCompetence}
            />
          )}

          {activeTab === "paie" && (
            <Paie
              bulletins={bulletins}
              agents={agents}
              grades={initialGrades}
              echelles={initialEchellesSalariales}
              primes={initialPrimes}
              retenues={initialRetenues}
              onAddBulletin={handleAddBulletin}
            />
          )}

          {activeTab === "db-schema" && (
            <SchemaVisualizer 
              ddlScript={sgrhSqlSchema} 
            />
          )}
        </div>

      </main>

    </div>
  );
}
