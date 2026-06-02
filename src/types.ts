/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Types de référence
export interface TypeReference {
  id_type_reference: number;
  code: string;
  libelle: string;
}

export interface ValeurReference {
  id_valeur_reference: number;
  id_type_reference: number;
  code: string;
  libelle: string;
  actif: boolean;
}

// Sécurité & Utilisateurs
export interface Role {
  id_role: number;
  code: string;
  nom: string;
}

export interface Permission {
  id_permission: number;
  code: string;
  nom: string;
}

export interface Utilisateur {
  id_utilisateur: number;
  username: string;
  email: string;
  actif: boolean;
  date_creation: string;
  role: string; // Simplifié pour l'interface
}

// Organisation - Structure administrative
export interface Ministere {
  id_ministere: number;
  code: string;
  nom: string;
}

export interface Direction {
  id_direction: number;
  id_ministere: number;
  code: string;
  nom: string;
}

export interface Service {
  id_service: number;
  id_direction: number;
  code: string;
  nom: string;
}

export interface Bureau {
  id_bureau: number;
  id_service: number;
  nom: string;
}

export interface Categorie {
  id_categorie: number;
  code: string;
  libelle: string;
}

export interface Corps {
  id_corps: number;
  code: string;
  libelle: string;
}

export interface Grade {
  id_grade: number;
  id_corps: number;
  id_categorie: number;
  code: string;
  libelle: string;
  // relations enrichies
  corps_libelle?: string;
  categorie_code?: string;
}

export interface EchelleSalariale {
  id_echelle: number;
  id_grade: number;
  indice_min: number;
  indice_max: number;
  salaire_base: number;
}

export interface Poste {
  id_poste: number;
  code: string;
  intitule: string;
  description: string;
}

// Agents & Dossier
export interface Agent {
  id_agent: number;
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  adresse: string;
  telephone: string;
  email: string;
  id_sexe: number; // reference à id_valeur_reference
  id_statut_agent: number; // reference à id_valeur_reference (Actif, Suspendu, Retraité...)
  date_recrutement: string;
  id_grade: number;
  
  // Relations d'organisation pour affichage rapide
  id_ministere: number;
  id_direction: number;
  id_service: number;
  id_poste: number;
}

export interface DossierAgent {
  id_dossier: number;
  id_agent: number;
  date_ouverture: string;
  observations: string;
}

export interface ContactUrgence {
  id_contact: number;
  id_agent: number;
  nom: string;
  telephone: string;
  lien_parente: string;
}

export interface DocumentAgent {
  id_document: number;
  id_agent: number;
  id_type_document: number; // reference à id_valeur_reference (CNI, Diplôme, Contrat...)
  fichier: string;
  date_ajout: string;
}

// Carrière & Mouvements
export interface Affectation {
  id_affectation: number;
  id_agent: number;
  id_poste: number;
  id_service: number;
  date_debut: string;
  date_fin: string | null;
}

export interface Promotion {
  id_promotion: number;
  id_agent: number;
  ancien_grade: number;
  nouveau_grade: number;
  date_promotion: string;
}

export interface Mutation {
  id_mutation: number;
  id_agent: number;
  service_source: number;
  service_destination: number;
  date_mutation: string;
}

export interface Sanction {
  id_sanction: number;
  id_agent: number;
  motif: string;
  date_sanction: string;
}

// Présences
export interface Presence {
  id_presence: number;
  id_agent: number;
  date_presence: string;
  heure_arrivee: string;
  heure_depart: string | null;
  id_statut_presence: number; // Présent, Retard, Absent, Justifié...
}

// Congés
export interface TypeConge {
  id_type_conge: number;
  code: string;
  libelle: string;
  nb_jours: number;
}

export interface DemandeConge {
  id_conge: number;
  id_agent: number;
  id_type_conge: number;
  date_debut: string;
  date_fin: string;
  id_statut_conge: number; // En attente, Validé, Rejeté
}

// Évaluations
export interface CampagneEvaluation {
  id_campagne: number;
  annee: number;
  libelle: string;
}

export interface CritereEvaluation {
  id_critere: number;
  libelle: string;
  coefficient: number;
}

export interface Evaluation {
  id_evaluation: number;
  id_agent: number;
  id_campagne: number;
  date_evaluation: string;
}

export interface NoteEvaluation {
  id_evaluation: number;
  id_critere: number;
  note: number;
}

// Formations & Compétences
export interface Formation {
  id_formation: number;
  titre: string;
  description: string;
}

export interface SessionFormation {
  id_session: number;
  id_formation: number;
  date_debut: string;
  date_fin: string;
}

export interface InscriptionFormation {
  id_agent: number;
  id_session: number;
}

export interface Competence {
  id_competence: number;
  libelle: string;
}

export interface AgentCompetence {
  id_agent: number;
  id_competence: number;
  id_niveau: number; // Débutant, Intermédiaire, Expert...
}

// Paie
export interface Prime {
  id_prime: number;
  libelle: string;
  montant: number;
}

export interface Retenue {
  id_retenue: number;
  libelle: string;
  montant: number;
}

export interface BulletinPaie {
  id_bulletin: number;
  id_agent: number;
  mois: number;
  annee: number;
  salaire_base: number;
  salaire_net: number;
}

// Notifications & Audit
export interface Notification {
  id_notification: number;
  id_utilisateur: number;
  titre: string;
  message: string;
  date_notification: string;
}

export interface JournalAudit {
  id_audit: number;
  id_utilisateur: number;
  table_concernee: string;
  action_effectuee: string;
  date_action: string;
}
