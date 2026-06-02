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
  JournalAudit
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // React State stores with LocalStorage synchronisation
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem("sgrh_agents");
    return saved ? JSON.parse(saved) : initialAgents;
  });

  const [dossiers, setDossiers] = useState<DossierAgent[]>(() => {
    const saved = localStorage.getItem("sgrh_dossiers");
    return saved ? JSON.parse(saved) : initialDossiersAgents;
  });

  const [contacts, setContacts] = useState<ContactUrgence[]>(() => {
    const saved = localStorage.getItem("sgrh_contacts");
    return saved ? JSON.parse(saved) : initialContactsUrgence;
  });

  const [documents, setDocuments] = useState<DocumentAgent[]>(() => {
    const saved = localStorage.getItem("sgrh_documents");
    return saved ? JSON.parse(saved) : initialDocumentsAgents;
  });

  const [presences, setPresences] = useState<Presence[]>(() => {
    const saved = localStorage.getItem("sgrh_presences");
    return saved ? JSON.parse(saved) : initialPresences;
  });

  const [conges, setConges] = useState<DemandeConge[]>(() => {
    const saved = localStorage.getItem("sgrh_conges");
    return saved ? JSON.parse(saved) : initialDemandesConges;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem("sgrh_promotions");
    return saved ? JSON.parse(saved) : initialPromotions;
  });

  const [mutations, setMutations] = useState<Mutation[]>(() => {
    const saved = localStorage.getItem("sgrh_mutations");
    return saved ? JSON.parse(saved) : initialMutations;
  });

  const [sanctions, setSanctions] = useState<Sanction[]>(() => {
    const saved = localStorage.getItem("sgrh_sanctions");
    return saved ? JSON.parse(saved) : initialSanctions;
  });

  const [inscriptions, setInscriptions] = useState<InscriptionFormation[]>(() => {
    const saved = localStorage.getItem("sgrh_inscriptions");
    return saved ? JSON.parse(saved) : initialInscriptionsFormations;
  });

  const [agentCompetences, setAgentCompetences] = useState<AgentCompetence[]>(() => {
    const saved = localStorage.getItem("sgrh_agent_competences");
    return saved ? JSON.parse(saved) : initialAgentCompetences;
  });

  const [bulletins, setBulletins] = useState<BulletinPaie[]>(() => {
    const saved = localStorage.getItem("sgrh_bulletins");
    return saved ? JSON.parse(saved) : initialBulletinsPaie;
  });

  const [audits, setAudits] = useState<JournalAudit[]>(() => {
    const saved = localStorage.getItem("sgrh_audits");
    return saved ? JSON.parse(saved) : initialJournalAudit;
  });

  const [evaluations, setEvaluations] = useState<any[]>(() => {
    const saved = localStorage.getItem("sgrh_evaluations");
    return saved ? JSON.parse(saved) : initialEvaluations;
  });

  const [notesEvaluation, setNotesEvaluation] = useState<any[]>(() => {
    const saved = localStorage.getItem("sgrh_notes_evaluation");
    return saved ? JSON.parse(saved) : initialNotesEvaluation;
  });

  // Save changes to localStorage on state changes
  useEffect(() => {
    localStorage.setItem("sgrh_agents", JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem("sgrh_dossiers", JSON.stringify(dossiers));
  }, [dossiers]);

  useEffect(() => {
    localStorage.setItem("sgrh_contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("sgrh_documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("sgrh_presences", JSON.stringify(presences));
  }, [presences]);

  useEffect(() => {
    localStorage.setItem("sgrh_conges", JSON.stringify(conges));
  }, [conges]);

  useEffect(() => {
    localStorage.setItem("sgrh_promotions", JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem("sgrh_mutations", JSON.stringify(mutations));
  }, [mutations]);

  useEffect(() => {
    localStorage.setItem("sgrh_sanctions", JSON.stringify(sanctions));
  }, [sanctions]);

  useEffect(() => {
    localStorage.setItem("sgrh_inscriptions", JSON.stringify(inscriptions));
  }, [inscriptions]);

  useEffect(() => {
    localStorage.setItem("sgrh_agent_competences", JSON.stringify(agentCompetences));
  }, [agentCompetences]);

  useEffect(() => {
    localStorage.setItem("sgrh_bulletins", JSON.stringify(bulletins));
  }, [bulletins]);

  useEffect(() => {
    localStorage.setItem("sgrh_audits", JSON.stringify(audits));
  }, [audits]);

  useEffect(() => {
    localStorage.setItem("sgrh_evaluations", JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem("sgrh_notes_evaluation", JSON.stringify(notesEvaluation));
  }, [notesEvaluation]);


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
  const handleAddAgent = (
    newAgent: Agent, 
    dossierObs: string, 
    emergency: { nom: string; telephone: string; lien: string }
  ) => {
    setAgents(prev => [...prev, newAgent]);

    const newDossier: DossierAgent = {
      id_dossier: dossiers.length + 1,
      id_agent: newAgent.id_agent,
      date_ouverture: newAgent.date_recrutement,
      observations: dossierObs
    };
    setDossiers(prev => [...prev, newDossier]);

    if (emergency.nom) {
      const newContact: ContactUrgence = {
        id_contact: contacts.length + 1,
        id_agent: newAgent.id_agent,
        nom: emergency.nom,
        telephone: emergency.telephone,
        lien_parente: emergency.lien
      };
      setContacts(prev => [...prev, newContact]);
    }

    logAudit("agents", `INSERT INTO agents - Recrutement agent ${newAgent.nom} ${newAgent.prenom} (Matricule: ${newAgent.matricule})`);
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

  const handleAddDemandeConge = (demande: DemandeConge) => {
    setConges(prev => [...prev, demande]);
    const agName = agents.find(a => a.id_agent === demande.id_agent)?.nom || "";
    logAudit("demandes_conges", `INSERT INTO demandes_conges - Demande de congé initiée pour l'agent ${agName}`);
  };

  const handleModifierStatutConge = (congeId: number, nouveauStatut: number) => {
    setConges(prev =>
      prev.map(c => c.id_conge === congeId ? { ...c, id_statut_conge: nouveauStatut } : c)
    );
    const conge = conges.find(c => c.id_conge === congeId);
    if (!conge) return;
    const agName = agents.find(a => a.id_agent === conge.id_agent)?.nom || "";
    const label = nouveauStatut === 402 ? "APPROBATION" : "REJET";
    logAudit("demandes_conges", `UPDATE demandes_conges SET id_statut_conge = ${nouveauStatut} - ${label} congé agent ${agName}`);
  };

  const handleAddPresence = (newPresence: Presence) => {
    setPresences(prev => [...prev, newPresence]);
    const agName = agents.find(a => a.id_agent === newPresence.id_agent)?.nom || "";
    logAudit("presences", `INSERT INTO presences - Pointage de présence effectué pour l'agent ${agName} (${newPresence.date_presence})`);
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

  const handleAddBulletin = (newBulletin: BulletinPaie) => {
    setBulletins(prev => [...prev, newBulletin]);
    const agName = agents.find(a => a.id_agent === newBulletin.id_agent)?.nom || "";
    logAudit("bulletins_paie", `INSERT INTO bulletins_paie - Solde de paie calculée et provisionnée pour l'agent ${agName}`);
  };

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
            <span className="text-[11px] font-mono font-semibold bg-white/5 text-slate-300 px-2.5 py-1 rounded border border-white/10">
              UTC: 2026-06-02 21:07
            </span>
          </div>
        </header>

        {/* Selected tab conditional viewport router */}
        <div className="fade-in">
          {activeTab === "dashboard" && (
            <Dashboard
              agents={agents}
              ministeres={initialMinisteres}
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
              ministeres={initialMinisteres}
              directions={initialDirections}
              services={initialServices}
              bureaux={initialBureaux}
              grades={initialGrades}
              postes={initialPostes}
              dossiers={dossiers}
              contacts={contacts}
              documents={documents}
              valeursRef={initialValeursReference}
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
              valeursRef={initialValeursReference}
              onAddDemandeConge={handleAddDemandeConge}
              onModifierStatutConge={handleModifierStatutConge}
            />
          )}

          {activeTab === "presences" && (
            <Presences
              presences={presences}
              agents={agents}
              valeursRef={initialValeursReference}
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
