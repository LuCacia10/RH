/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  FileText,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Lock,
  Download,
  UploadCloud
} from "lucide-react";
import { 
  Agent, 
  Ministere, 
  Direction, 
  Service, 
  Bureau, 
  Grade, 
  Poste, 
  DossierAgent, 
  ContactUrgence, 
  DocumentAgent, 
  ValeurReference,
  AgentCompetence,
  Competence,
  Sanction,
  Promotion
} from "../types";

interface AgentManagerProps {
  agents: Agent[];
  ministeres: Ministere[];
  directions: Direction[];
  services: Service[];
  bureaux: Bureau[];
  grades: Grade[];
  postes: Poste[];
  dossiers: DossierAgent[];
  contacts: ContactUrgence[];
  documents: DocumentAgent[];
  valeursRef: ValeurReference[];
  competences: Competence[];
  agentCompetences: AgentCompetence[];
  sanctions: Sanction[];
  promotions: Promotion[];
  onAddAgent: (newAgent: Agent, dossierObs: string, emergencyContact: { nom: string; telephone: string; lien: string }) => void;
  onUploadDocument: (agentId: number, typeDoc: number, fileName: string) => void;
}

export default function AgentManager({
  agents,
  ministeres,
  directions,
  services,
  bureaux,
  grades,
  postes,
  dossiers,
  contacts,
  documents,
  valeursRef,
  competences,
  agentCompetences,
  sanctions,
  promotions,
  onAddAgent,
  onUploadDocument
}: AgentManagerProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMinFilter, setSelectedMinFilter] = useState<number | "ALL">("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<number | "ALL">("ALL");
  const [selectedAgentId, setSelectedAgentId] = useState<number>(agents[0]?.id_agent || 1);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formNom, setFormNom] = useState("");
  const [formPrenom, setFormPrenom] = useState("");
  const [formMatricule, setFormMatricule] = useState(`FN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [formBirthDate, setFormBirthDate] = useState("1992-05-18");
  const [formBirthPlace, setFormBirthPlace] = useState("Antananarivo");
  const [formAdresse, setFormAdresse] = useState("Analakely, Antananarivo");
  const [formPhone, setFormPhone] = useState("+261 34 ");
  const [formEmail, setFormEmail] = useState("");
  const [formSexe, setFormSexe] = useState<number>(101); // Homme
  const [formStatutAgent, setFormStatutAgent] = useState<number>(201); // Titulaire
  const [formGrade, setFormGrade] = useState<number>(grades[0]?.id_grade || 1);
  const [formMin, setFormMin] = useState<number>(1);
  const [formDir, setFormDir] = useState<number>(1);
  const [formServ, setFormServ] = useState<number>(1);
  const [formPoste, setFormPoste] = useState<number>(postes[0]?.id_poste || 1);
  const [formDossierObs, setFormDossierObs] = useState("Recrutement initial par concours de la digne administration.");
  const [formUrgenceNom, setFormUrgenceNom] = useState("");
  const [formUrgenceTel, setFormUrgenceTel] = useState("");
  const [formUrgenceLien, setFormUrgenceLien] = useState("");

  // Document upload state (simplifié)
  const [docTypeName, setDocTypeName] = useState<number>(601);
  const [docFileName, setDocFileName] = useState("");

  // Filters directions et services cascaded in the form
  const availableDirections = directions.filter(d => d.id_ministere === formMin);
  const availableServices = services.filter(s => {
    // trouve si le service appartient à l'une des directions du ministere
    const parentDir = directions.find(d => d.id_direction === s.id_direction);
    return parentDir && parentDir.id_ministere === formMin;
  });

  // Filtered agent list
  const filteredAgents = agents.filter(agent => {
    const fullName = `${agent.nom} ${agent.prenom}`.toLowerCase();
    const matricule = agent.matricule.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || matricule.includes(searchQuery.toLowerCase());
    const matchesMin = selectedMinFilter === "ALL" || agent.id_ministere === Number(selectedMinFilter);
    const matchesStatus = selectedStatusFilter === "ALL" || agent.id_statut_agent === Number(selectedStatusFilter);
    return matchesSearch && matchesMin && matchesStatus;
  });

  // Selected Agent Full Detailed views
  const selectedAgent = agents.find(a => a.id_agent === selectedAgentId) || agents[0];

  const agentDossier = dossiers.find(d => d.id_agent === selectedAgent?.id_agent);
  const agentContacts = contacts.filter(c => c.id_agent === selectedAgent?.id_agent);
  const agentDocs = documents.filter(d => d.id_agent === selectedAgent?.id_agent);
  const agentSk = agentCompetences.filter(c => c.id_agent === selectedAgent?.id_agent);
  const agentSanct = sanctions.filter(s => s.id_agent === selectedAgent?.id_agent);
  const agentProm = promotions.filter(p => p.id_agent === selectedAgent?.id_agent);

  // Helper names
  const getRefLibelle = (id: number) => valeursRef.find(v => v.id_valeur_reference === id)?.libelle || "Inconnu";
  const getMinCode = (id: number) => ministeres.find(m => m.id_ministere === id)?.code || "N/A";
  const getMinNom = (id: number) => ministeres.find(m => m.id_ministere === id)?.nom || "N/A";
  const getDirectionNom = (id: number) => directions.find(d => d.id_direction === id)?.nom || "N/A";
  const getServiceNom = (id: number) => services.find(s => s.id_service === id)?.nom || "N/A";
  const getGradeLib = (id: number) => grades.find(g => g.id_grade === id)?.libelle || "N/A";
  const getGradeCode = (id: number) => grades.find(g => g.id_grade === id)?.code || "N/A";
  const getPosteNom = (id: number) => postes.find(p => p.id_poste === id)?.intitule || "N/A";

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNom || !formPrenom) {
      alert("Veuillez saisir le nom et le prénom de l'agent.");
      return;
    }

    const newAgent: Agent = {
      id_agent: agents.length + 1,
      matricule: formMatricule,
      nom: formNom.toUpperCase(),
      prenom: formPrenom,
      date_naissance: formBirthDate,
      lieu_naissance: formBirthPlace,
      adresse: formAdresse,
      telephone: formPhone,
      email: formEmail || `${formPrenom.toLowerCase().replace(/\s+/g, '')}.${formNom.toLowerCase()}@gouv.mg`,
      id_sexe: Number(formSexe),
      id_statut_agent: Number(formStatutAgent),
      date_recrutement: new Date().toISOString().split('T')[0],
      id_grade: Number(formGrade),
      id_ministere: Number(formMin),
      id_direction: Number(formDir),
      id_service: Number(formServ),
      id_poste: Number(formPoste)
    };

    onAddAgent(newAgent, formDossierObs, {
      nom: formUrgenceNom || "Non spécifié",
      telephone: formUrgenceTel || "Non spécifié",
      lien: formUrgenceLien || "Autre"
    });

    // Reset Form states
    setFormNom("");
    setFormPrenom("");
    setFormMatricule(`FN-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormUrgenceNom("");
    setFormUrgenceTel("");
    setFormUrgenceLien("");
    setShowAddForm(false);
    setSelectedAgentId(newAgent.id_agent);
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFileName) return;
    onUploadDocument(selectedAgent.id_agent, Number(docTypeName), docFileName);
    setDocFileName("");
  };

  return (
    <div className="space-y-6 fade-in">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Registre National des Agents Publics</h2>
          <p className="text-xs text-slate-500">Recherchez, gérez et numérisez les dossiers administratifs d'agents d'État.</p>
        </div>
        <button
          id="btn-recruit"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm shadow-emerald-700/10"
        >
          <UserPlus className="w-4 h-4" />
          <span>Recruter un nouvel Agent</span>
        </button>
      </div>

      {showAddForm ? (
        /* Recrutement Form Card */
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Formulaire de Recrutement d'un Agent (Nouvelle immatriculation)</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Annuler
            </button>
          </div>

          <form onSubmit={handleCreateAgent} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sec 1: Identité */}
              <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-6">
                <h4 className="text-slate-800 text-xs font-bold uppercase tracking-wider">1. État Civil & Identité</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Matricule</label>
                    <input
                      type="text"
                      value={formMatricule}
                      onChange={(e) => setFormMatricule(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold focus:outline-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Sexe / Genre</label>
                    <select
                      value={formSexe}
                      onChange={(e) => setFormSexe(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                    >
                      <option value={101}>Homme</option>
                      <option value={102}>Femme</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Code de Famille (NOM)</label>
                  <input
                    type="text"
                    placeholder="Saisir en majuscules (ex: COULIBALY)"
                    value={formNom}
                    onChange={(e) => setFormNom(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-emerald-500 uppercase"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Prénoms</label>
                  <input
                    type="text"
                    placeholder="Saisir les prénoms (ex: Sékou Bakary)"
                    value={formPrenom}
                    onChange={(e) => setFormPrenom(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Naissance</label>
                    <input
                      type="date"
                      value={formBirthDate}
                      onChange={(e) => setFormBirthDate(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:outline-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Lieu Naiss</label>
                    <input
                      type="text"
                      value={formBirthPlace}
                      onChange={(e) => setFormBirthPlace(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Téléphone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-emerald-500"
                    placeholder="+225 07..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Adresse Domicile</label>
                  <textarea
                    rows={2}
                    value={formAdresse}
                    onChange={(e) => setFormAdresse(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs focus:outline-emerald-500"
                  />
                </div>
              </div>

              {/* Sec 2: Organisation */}
              <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-6">
                <h4 className="text-slate-800 text-xs font-bold uppercase tracking-wider">2. Affectation Ministère & Poste</h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Ministère Mandataire</label>
                  <select
                    value={formMin}
                    onChange={(e) => {
                      const mId = Number(e.target.value);
                      setFormMin(mId);
                      // met à jour la direction et le service correspondants
                      const dirs = directions.filter(d => d.id_ministere === mId);
                      if (dirs.length > 0) {
                        setFormDir(dirs[0].id_direction);
                        const servs = services.filter(s => s.id_direction === dirs[0].id_direction);
                        if (servs.length > 0) setFormServ(servs[0].id_service);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                  >
                    {ministeres.map((min) => (
                      <option key={min.id_ministere} value={min.id_ministere}>
                        {min.code} - {min.nom.substring(0, 45)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Direction d'Affectation</label>
                  <select
                    value={formDir}
                    onChange={(e) => {
                      const dId = Number(e.target.value);
                      setFormDir(dId);
                      const servs = services.filter(s => s.id_direction === dId);
                      if (servs.length > 0) setFormServ(servs[0].id_service);
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                  >
                    {availableDirections.map((dir) => (
                      <option key={dir.id_direction} value={dir.id_direction}>
                        {dir.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Service Opérationnel</label>
                  <select
                    value={formServ}
                    onChange={(e) => setFormServ(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                  >
                    {availableServices.map((ser) => (
                      <option key={ser.id_service} value={ser.id_service}>
                        {ser.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Intitulé du Poste occupée</label>
                  <select
                    value={formPoste}
                    onChange={(e) => setFormPoste(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                  >
                    {postes.map((p) => (
                      <option key={p.id_poste} value={p.id_poste}>
                        {p.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase font-semibold">Grade & Statut Salarial</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                  >
                    {grades.map((g) => (
                      <option key={g.id_grade} value={g.id_grade}>
                        {g.code} - {g.libelle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Régime Fonction publique</label>
                  <select
                    value={formStatutAgent}
                    onChange={(e) => setFormStatutAgent(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                  >
                    <option value={201}>Fonctionnaire Titulaire</option>
                    <option value={202}>Stagiaire</option>
                    <option value={203}>Contractuel de l'État</option>
                  </select>
                </div>
              </div>

              {/* Sec 3: Dossier & Urgence */}
              <div className="space-y-4 md:col-span-1">
                <h4 className="text-slate-800 text-xs font-bold uppercase tracking-wider">3. Remarques administratives & Contact Urgence</h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Observations du Dossier</label>
                  <textarea
                    rows={3}
                    placeholder="Saisir des notes pour l'ouverture du dossier d'agent"
                    value={formDossierObs}
                    onChange={(e) => setFormDossierObs(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-700 uppercase block mb-1">Contact d'Urgence Principal</span>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Nom Complet</label>
                    <input
                      type="text"
                      placeholder="Epouse, Parent, Frère..."
                      value={formUrgenceNom}
                      onChange={(e) => setFormUrgenceNom(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-emerald-500 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Téléphone</label>
                      <input
                        type="text"
                        placeholder="+225..."
                        value={formUrgenceTel}
                        onChange={(e) => setFormUrgenceTel(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-emerald-500 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Lien Parentele</label>
                      <input
                        type="text"
                        placeholder="Conjoint, Oncle..."
                        value={formUrgenceLien}
                        onChange={(e) => setFormUrgenceLien(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-emerald-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 leading-normal flex gap-1.5">
                  <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>En enregistrant cet agent, un dossier numérique officiel est ouvert dans la table <code>dossiers_agents</code>, et un premier versement comptable est provisionné.</span>
                </div>
              </div>

            </div>

            {/* Form actions */}
            <div className="border-t border-slate-200 pt-4 flex justify-end gap-3 bg-slate-50/50 -mx-6 -my-6 p-6">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-lg cursor-pointer"
              >
                Créer l'agent & Ouvrir le Dossier
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Main split dashboard list + detail explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left pane: Filterable List of Agents */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 lg:col-span-5 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer par nom ou matricule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-2 text-xs">
            {/* Ministry Filter */}
            <div className="w-1/2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Ministère</label>
              <select
                value={selectedMinFilter}
                onChange={(e) => setSelectedMinFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 focus:outline-emerald-500 text-xs"
              >
                <option value="ALL">Tous les ministères</option>
                {ministeres.map(min => (
                  <option key={min.id_ministere} value={min.id_ministere}>{min.code}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-1/2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Statut</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 focus:outline-emerald-500 text-xs"
              >
                <option value="ALL">Tous les statuts</option>
                <option value={201}>Titulaire</option>
                <option value={202}>Stagiaire</option>
                <option value={203}>Contractuel</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 my-2 pt-2">
            <div className="flex justify-between items-center px-1 mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Agents ({filteredAgents.length})</span>
              <span className="text-[10px] text-slate-400 font-mono">ID / Matricule</span>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-110 pr-1 select-none">
              {filteredAgents.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Aucun agent ne correspond à vos critères.</p>
                </div>
              ) : (
                filteredAgents.map(ag => {
                  const isSelected = selectedAgentId === ag.id_agent;
                  const sexLabel = ag.id_sexe === 101 ? "Homme" : "Femme";
                  return (
                    <button
                      key={ag.id_agent}
                      id={`agent-row-${ag.id_agent}`}
                      onClick={() => setSelectedAgentId(ag.id_agent)}
                      className={`w-full text-left p-3 rounded-lg flex items-center justify-between border transition-all ${
                        isSelected 
                          ? "bg-slate-50 border-emerald-500 text-emerald-950 shadow-sm" 
                          : "border-transparent hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-2 shrink-0 ${
                          isSelected ? "bg-emerald-600 text-white ring-emerald-500/20" : "bg-slate-100 text-slate-600 ring-transparent"
                        }`}>
                          {ag.nom.substring(0, 1)}{ag.prenom.substring(0, 1)}
                        </div>
                        <div className="truncate max-w-[150px] sm:max-w-[180px]">
                          <span className="font-semibold block text-xs truncate leading-tight">
                            {ag.nom} {ag.prenom}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-semibold">{getMinCode(ag.id_ministere)}</span>
                            <span>•</span>
                            <span className="truncate">{getPosteNom(ag.id_poste)}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-[10px] font-bold block">{ag.matricule}</span>
                        <span className={`inline-block py-0.5 px-2 rounded-full text-[9px] font-bold mt-1 ${
                          ag.id_statut_agent === 201 ? "bg-emerald-50 text-emerald-700" :
                          ag.id_statut_agent === 202 ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {getRefLibelle(ag.id_statut_agent).split(" ")[0]}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right pane: Agent Detail Dossier Explorer */}
        <div className="lg:col-span-7 space-y-6">
          {selectedAgent ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
              
              {/* Profile Top header section */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                    {selectedAgent.nom[0]}{selectedAgent.prenom[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {selectedAgent.nom} {selectedAgent.prenom}
                    </h3>
                    <p className="font-mono text-xs font-semibold text-emerald-600 mt-1">
                      Matricule National: {selectedAgent.matricule}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recruté le : <span className="font-semibold">{selectedAgent.date_recrutement}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wider block">
                    {getRefLibelle(selectedAgent.id_statut_agent)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    Sexe: {getRefLibelle(selectedAgent.id_sexe)}
                  </span>
                </div>
              </div>

              {/* Sections tabs/cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Information d'Affectation & Grade */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <ClipboardList className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Affectation Administrative</h4>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Ministère de Rattachement</span>
                      <p className="text-slate-800 font-medium leading-relaxed">{getMinNom(selectedAgent.id_ministere)}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Direction Générale / Sectorielle</span>
                      <p className="text-slate-800 font-medium">{getDirectionNom(selectedAgent.id_direction)}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Service d'activité</span>
                      <p className="text-slate-800 font-medium">{getServiceNom(selectedAgent.id_service)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Poste Occupé</span>
                        <p className="text-slate-800 font-semibold">{getPosteNom(selectedAgent.id_poste)}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Grade Statutaire</span>
                        <p className="text-emerald-700 font-bold bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100/50 inline-block">
                          {getGradeCode(selectedAgent.id_grade)} - {getGradeLib(selectedAgent.id_grade)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* État Civil & Dossier Observations */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Identité Civile & Dossier</h4>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-slate-600">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Date de naissance</span>
                        <p className="text-slate-800 font-medium">{selectedAgent.date_naissance}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Lieu de naissance</span>
                        <p className="text-slate-800 font-medium">{selectedAgent.lieu_naissance}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Coordonnées personnelles</span>
                      <p className="text-slate-800 font-medium flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedAgent.email}</span>
                      </p>
                      <p className="text-slate-800 font-medium flex items-center gap-1 mt-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedAgent.telephone || "N/A"}</span>
                      </p>
                      <p className="text-slate-800 font-medium flex items-center gap-1 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{selectedAgent.adresse || "N/A"}</span>
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Dossier de l'Agent</span>
                      <p className="text-[11px] text-slate-700 italic">
                        "{agentDossier?.observations || "Aucune observation enregistrée dans dossiers_agents."}"
                      </p>
                      <span className="text-[9px] text-slate-400 block mt-1.5 text-right font-mono">
                        Ouvert le: {agentDossier?.date_ouverture}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Contacts urgences & Compétences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-5">
                {/* 1. Contacts urgences */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Contacts d'urgence</span>
                  {agentContacts.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Aucun contact enregistré pour ce fonctionnaire.</p>
                  ) : (
                    <div className="space-y-2">
                      {agentContacts.map(c => (
                        <div key={c.id_contact} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-slate-800 block">{c.nom}</span>
                            <span className="text-[10px] text-slate-500">{c.lien_parente}</span>
                          </div>
                          <span className="font-mono text-slate-700 font-bold">{c.telephone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Compétences */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cartographie des compétences</span>
                  </span>
                  {agentSk.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Aucune habilitation validée dans agent_competences.</p>
                  ) : (
                    <div className="space-y-2">
                      {agentSk.map(ask => {
                        const compLibelle = competences.find(c => c.id_competence === ask.id_competence)?.libelle || "Aptitude générale";
                        const lev = getRefLibelle(ask.id_niveau);
                        const levColor = 
                          ask.id_niveau === 504 ? "bg-emerald-500" :
                          ask.id_niveau === 503 ? "bg-indigo-500" : "bg-slate-400";
                        return (
                          <div key={ask.id_competence} className="space-y-1 text-xs">
                            <div className="flex justify-between items-center text-slate-700 font-medium">
                              <span>{compLibelle}</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">{lev}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className={`${levColor} h-1.5 rounded-full`} style={{
                                width: ask.id_niveau === 504 ? "100%" : ask.id_niveau === 503 ? "75%" : "40%"
                              }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Mouvements Historiques (Sanctions & Promotions de l'Agent) */}
              {(agentProm.length > 0 || agentSanct.length > 0) && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Événements de Carrière récents</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {/* Promotions */}
                    {agentProm.map(p => (
                      <div key={p.id_promotion} className="p-2.5 bg-white border border-emerald-100 rounded-lg text-xs flex justify-between items-center">
                        <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Promotion validée : Passage grade {getGradeCode(p.ancien_grade)} → <strong>{getGradeCode(p.nouveau_grade)}</strong></span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{p.date_promotion}</span>
                      </div>
                    ))}
                    {/* Sanctions */}
                    {agentSanct.map(s => (
                      <div key={s.id_sanction} className="p-2.5 bg-white border border-rose-100 rounded-lg text-xs flex justify-between items-center">
                        <span className="text-rose-800 font-medium flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sanction administrative : {s.motif}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{s.date_sanction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Digital Folder Documents File Upload simulation */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    <span>Dossier Numérique - Pièces Justificatives de l'Agent ({agentDocs.length})</span>
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono border">
                    table: documents_agents
                  </span>
                </div>

                {agentDocs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic pb-2">Aucun document numérique téléversé pour le moment.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                    {agentDocs.map(doc => {
                      const typeLabel = getRefLibelle(doc.id_type_document) || "Justificatif";
                      return (
                        <div key={doc.id_document} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between text-xs transition">
                          <div className="truncate pr-2">
                            <span className="font-semibold text-slate-800 truncate block">{doc.fichier}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">{typeLabel}</span>
                          </div>
                          <button
                            id={`down-doc-${doc.id_document}`}
                            onClick={() => alert(`Téléchargement simulé de la pièce justificative: ${doc.fichier}`)}
                            className="p-1 px-2.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-mono text-[10px] font-semibold flex items-center gap-1 hover:text-slate-900"
                          >
                            <Download className="w-3 h-3 text-slate-500" />
                            <span>PDF</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Simuler téléversement de nouvelles pièces */}
                <form onSubmit={handleDocSubmit} className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 block">Ajouter et numériser une nouvelle pièce justificative</span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <select
                        value={docTypeName}
                        onChange={(e) => setDocTypeName(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-emerald-500"
                      >
                        <option value={601}>Carte Nationale d'Identité (CNI)</option>
                        <option value={602}>Arrêté de nomination officiel</option>
                        <option value={603}>Diplôme principal d'État</option>
                        <option value={604}>Relevé d'Identité Bancaire (RIB)</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Fichier (ex: arrete_nom_2026.pdf)..."
                        value={docFileName}
                        onChange={(e) => setDocFileName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-emerald-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition shrink-0 cursor-pointer"
                    >
                      Téléverser en base
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 italic">
                    Astuce: l'action simule la création d'un enregistrement d'audit associé et enregistre le fichier virtuel immédiatement.
                  </p>
                </form>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center text-slate-400">
              <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold">Veuillez sélectionner un agent dans le panneau latéral pour charger son dossier.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
