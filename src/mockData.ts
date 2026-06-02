/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ValeurReference,
  Ministere,
  Direction,
  Service,
  Bureau,
  Categorie,
  Corps,
  Grade,
  EchelleSalariale,
  Poste,
  Agent,
  DossierAgent,
  ContactUrgence,
  DocumentAgent,
  Affectation,
  Promotion,
  Mutation,
  Sanction,
  Presence,
  TypeConge,
  DemandeConge,
  CampagneEvaluation,
  CritereEvaluation,
  Evaluation,
  NoteEvaluation,
  Formation,
  SessionFormation,
  InscriptionFormation,
  Competence,
  AgentCompetence,
  Prime,
  Retenue,
  BulletinPaie,
  JournalAudit,
  Utilisateur,
  TypeReference
} from "./types";

// Types de Référence
export const initialTypesReference: TypeReference[] = [
  { id_type_reference: 1, code: "SEXE", libelle: "Genre de l'agent" },
  { id_type_reference: 2, code: "STATUT_AGENT", libelle: "Statut d'engagement" },
  { id_type_reference: 3, code: "STATUT_PRESENCE", libelle: "Statut de présence quotidienne" },
  { id_type_reference: 4, code: "STATUT_CONGE", libelle: "Statut d'une demande de congé" },
  { id_type_reference: 5, code: "NIVEAU_COMPETENCE", libelle: "Échelon de maîtrise d'une compétence" },
  { id_type_reference: 6, code: "TYPE_DOCUMENT", libelle: "Types de documents administratifs" }
];

export const initialValeursReference: ValeurReference[] = [
  // Sexe (id_type_reference: 1)
  { id_valeur_reference: 101, id_type_reference: 1, code: "H", libelle: "Homme", actif: true },
  { id_valeur_reference: 102, id_type_reference: 1, code: "F", libelle: "Femme", actif: true },

  // Statut Agent (id_type_reference: 2)
  { id_valeur_reference: 201, id_type_reference: 2, code: "TITULAIRE", libelle: "Fonctionnaire Titulaire", actif: true },
  { id_valeur_reference: 202, id_type_reference: 2, code: "STAGIAIRE", libelle: "Stagiaire", actif: true },
  { id_valeur_reference: 203, id_type_reference: 2, code: "CONTRACTUEL", libelle: "Contractuel de l'État", actif: true },
  { id_valeur_reference: 204, id_type_reference: 2, code: "DETACHE", libelle: "En Détachement", actif: true },

  // Statut Présence (id_type_reference: 3)
  { id_valeur_reference: 301, id_type_reference: 3, code: "PRESENT", libelle: "Présent", actif: true },
  { id_valeur_reference: 302, id_type_reference: 3, code: "RETARD", libelle: "En retard", actif: true },
  { id_valeur_reference: 303, id_type_reference: 3, code: "ABSENT_N_J", libelle: "Absent non justifié", actif: true },
  { id_valeur_reference: 304, id_type_reference: 3, code: "ABSENT_J", libelle: "Absent justifié", actif: true },

  // Statut Congé (id_type_reference: 4)
  { id_valeur_reference: 401, id_type_reference: 4, code: "ATTENTE", libelle: "En attente d'approbation", actif: true },
  { id_valeur_reference: 402, id_type_reference: 4, code: "VALIDE", libelle: "Validé / Approuvé", actif: true },
  { id_valeur_reference: 403, id_type_reference: 4, code: "REJETE", libelle: "Rejeté", actif: true },

  // Niveau Compétence (id_type_reference: 5)
  { id_valeur_reference: 501, id_type_reference: 5, code: "DEBUTANT", libelle: "Notions de base", actif: true },
  { id_valeur_reference: 502, id_type_reference: 5, code: "INTERMEDIAIRE", libelle: "Compétence Pratique", actif: true },
  { id_valeur_reference: 503, id_type_reference: 5, code: "AVANCE", libelle: "Maitrise avancée", actif: true },
  { id_valeur_reference: 504, id_type_reference: 5, code: "EXPERT", libelle: "Rôle d'expert / Formateur", actif: true },

  // Type Document (id_type_reference: 6)
  { id_valeur_reference: 601, id_type_reference: 6, code: "CNI", libelle: "Carte Nationale d'Identité", actif: true },
  { id_valeur_reference: 602, id_type_reference: 6, code: "ARRETE_NOM", libelle: "Arrêté de nomination", actif: true },
  { id_valeur_reference: 603, id_type_reference: 6, code: "DIPLOME", libelle: "Diplôme principal", actif: true },
  { id_valeur_reference: 604, id_type_reference: 6, code: "RIB", libelle: "Relevé d'Identité Bancaire", actif: true }
];

// Sécurité
export const initialUtilisateurs: Utilisateur[] = [
  { id_utilisateur: 1, username: "admin_central", email: "admin.rh@fpublique.gouv.mg", actif: true, date_creation: "2024-01-10", role: "Administrateur Central RH" },
  { id_utilisateur: 2, username: "responsable_sante", email: "drh.sante@sante.gouv.mg", actif: true, date_creation: "2024-02-15", role: "Responsable RH (Santé)" },
  { id_utilisateur: 3, username: "chef_service_lycee", email: "proviseur.lycee@edu.gouv.mg", actif: true, date_creation: "2024-03-01", role: "Chef de Service" },
  { id_utilisateur: 4, username: "agent_jean_dupont", email: "jean.dupont@fonctionnaire.mg", actif: true, date_creation: "2025-01-20", role: "Agent Public" }
];

// Ministères
export const initialMinisteres: Ministere[] = [
  { id_ministere: 1, code: "MIN_FP", nom: "Ministère de la Fonction Publique, du Travail et de la Modernisation" },
  { id_ministere: 2, code: "MIN_SANTE", nom: "Ministère de la Santé et de l'Hygiène Publique" },
  { id_ministere: 3, code: "MIN_EDU", nom: "Ministère de l'Éducation Nationale et de l'Alphabétisation" },
  { id_ministere: 4, code: "MIN_FINANCES", nom: "Ministère de l'Économie, des Finances et du Budget" }
];

// Directions
export const initialDirections: Direction[] = [
  // Ministère Fonction Publique (id_ministere: 1)
  { id_direction: 1, id_ministere: 1, code: "DGRH_FP", nom: "Direction Générale des Ressources Humaines de l'État" },
  { id_direction: 2, id_ministere: 1, code: "DSI_FP", nom: "Direction des Systèmes d'Information" },

  // Ministère Santé (id_ministere: 2)
  { id_direction: 3, id_ministere: 2, code: "DG_SANTE", nom: "Direction Générale de la Santé Publique" },
  { id_direction: 4, id_ministere: 2, code: "DRH_SANTE", nom: "Direction des Ressources Humaines de la Santé" },

  // Ministère Éducation (id_ministere: 3)
  { id_direction: 5, id_ministere: 3, code: "DGE_EDU", nom: "Direction Générale de l'Enseignement Secondaire" },
  { id_direction: 6, id_ministere: 3, code: "DRH_EDU", nom: "Direction des Ressources Humaines - Éducation" }
];

// Services
export const initialServices: Service[] = [
  // DGRH_FP (id_direction: 1)
  { id_service: 1, id_direction: 1, code: "SERV_RECRUT", nom: "Service de Recrutement et Profils" },
  { id_service: 2, id_direction: 1, code: "SERV_CARRIERE", nom: "Service Central de Gestion des Carrières" },

  // DG_SANTE (id_direction: 3)
  { id_service: 3, id_direction: 3, code: "CH_REGIONAL", nom: "CHRR de Toamasina" },
  { id_service: 4, id_direction: 3, code: "SERV_URGENCE", nom: "Service des Urgences Générales" },

  // DGE_EDU (id_direction: 5)
  { id_service: 5, id_direction: 5, code: "LYCEE_CLA", nom: "Lycée Gallieni d'Andohalo, Tananarive" },
  { id_service: 6, id_direction: 5, code: "SERV_SCOL_LYC", nom: "Service Scolarité et Orientations" }
];

// Bureaux
export const initialBureaux: Bureau[] = [
  { id_bureau: 1, id_service: 1, nom: "Bureau Concours Directs" },
  { id_bureau: 2, id_service: 2, nom: "Bureau de l'Avancement et Échelonnement" },
  { id_bureau: 3, id_service: 3, nom: "Bureau Admissions et Soins d'Urgence" },
  { id_bureau: 4, id_service: 5, nom: "Secrétariat Principal du Proviseur" }
];

// Catégories
export const initialCategories: Categorie[] = [
  { id_categorie: 1, code: "A", libelle: "Catégorie A (Cadres supérieurs et Conception)" },
  { id_categorie: 2, code: "B", libelle: "Catégorie B (Cadres d'application et de Maîtrise)" },
  { id_categorie: 3, code: "C", libelle: "Catégorie C (Exécution administrative ou technique)" }
];

// Corps
export const initialCorps: Corps[] = [
  { id_corps: 1, code: "ADMIN_CIVIL", libelle: "Corps des Administrateurs Civils" },
  { id_corps: 2, code: "MEDECINS", libelle: "Corps des Médecins Spécialistes" },
  { id_corps: 3, code: "PROF_LYCEE", libelle: "Corps des Enseignants du Secondaire" },
  { id_corps: 4, code: "INFORMATICIENS", libelle: "Corps des Ingénieurs de Technologie" }
];

// Grades
export const initialGrades: Grade[] = [
  // Corps Administrateurs A1, A2, A3
  { id_grade: 1, id_corps: 1, id_categorie: 1, code: "A4", libelle: "Administrateur Général des Services Publics" },
  { id_grade: 2, id_corps: 1, id_categorie: 1, code: "A3", libelle: "Administrateur Civil Principal" },
  { id_grade: 3, id_corps: 1, id_categorie: 1, code: "A2", libelle: "Administrateur Civil Adjoint" },

  // Medecins
  { id_grade: 4, id_corps: 2, id_categorie: 1, code: "M3", libelle: "Médecin Chef Spécialiste" },
  { id_grade: 5, id_corps: 2, id_categorie: 1, code: "M1", libelle: "Médecin Généraliste Principal" },

  // Enseignants
  { id_grade: 6, id_corps: 3, id_categorie: 1, code: "PLE_EX", libelle: "Professeur de Lycée Exceptionnel" },
  { id_grade: 7, id_corps: 3, id_categorie: 1, code: "PLE_CL", libelle: "Professeur de Lycée Classe Normale" },

  // Informatieicns
  { id_grade: 8, id_corps: 4, id_categorie: 1, code: "ING_PRINC", libelle: "Ingénieur Principal d'Études" }
];

// Echelles salariales
export const initialEchellesSalariales: EchelleSalariale[] = [
  { id_echelle: 1, id_grade: 1, indice_min: 750, indice_max: 1250, salaire_base: 850000.00 },
  { id_echelle: 2, id_grade: 2, indice_min: 600, indice_max: 980, salaire_base: 680000.00 },
  { id_echelle: 3, id_grade: 3, indice_min: 450, indice_max: 750, salaire_base: 520000.00 },
  { id_echelle: 4, id_grade: 4, indice_min: 800, indice_max: 1300, salaire_base: 950000.00 },
  { id_echelle: 5, id_grade: 5, indice_min: 620, indice_max: 950, salaire_base: 720000.00 },
  { id_echelle: 6, id_grade: 6, indice_min: 650, indice_max: 1050, salaire_base: 650000.00 },
  { id_echelle: 7, id_grade: 7, indice_min: 420, indice_max: 780, salaire_base: 480000.00 },
  { id_echelle: 8, id_grade: 8, indice_min: 550, indice_max: 920, salaire_base: 590000.00 }
];

// Postes
export const initialPostes: Poste[] = [
  { id_poste: 1, code: "DIR_GEN", intitule: "Directeur Général des Services", description: "Supervise la coordination stratégique de l'ensemble des directions sectorielles." },
  { id_poste: 2, code: "CH_SERV", intitule: "Chef de Service Administratif", description: "Anime l'équipe opérationnelle du service, gère le flux de dossiers." },
  { id_poste: 3, code: "MED_URG", intitule: "Médecin Urgentiste Référent", description: "Assure la prise en charge médicale des cas urgents et gère le planning des équipes de soins." },
  { id_poste: 4, code: "PROF_MATH", intitule: "Enseignant Agrégé de Mathématiques", description: "Enseigne les mathématiques supérieures en classes terminales lycéennes." },
  { id_poste: 5, code: "DEV_INFR", intitule: "Ingénieur Cloud & Sécurité", description: "Assure la haute disponibilité et la cybersécurité de la plateforme centrale SGRH." }
];

// Agents
export const initialAgents: Agent[] = [
  {
    id_agent: 1,
    matricule: "FN-729103",
    nom: "RABEMANANJARA",
    prenom: "Andry",
    date_naissance: "1978-05-14",
    lieu_naissance: "Antananarivo",
    adresse: "Villa 3, Ambohibao, Antananarivo, Madagascar",
    telephone: "+261 34 56 123 45",
    email: "andry.rabemananjara@fonctionnaires.gouv.mg",
    id_sexe: 101, // Homme
    id_statut_agent: 201, // Titulaire
    date_recrutement: "2008-01-15",
    id_grade: 2, // Administrateur Civil Principal (A3)
    id_ministere: 1,
    id_direction: 1,
    id_service: 2, // SERV_CARRIERE
    id_poste: 2 // Chef de Service
  },
  {
    id_agent: 2,
    matricule: "FN-108293",
    nom: "RAKOTOMALALA",
    prenom: "Feno",
    date_naissance: "1983-09-22",
    lieu_naissance: "Fianarantsoa",
    adresse: "Isotry, Antananarivo, Madagascar",
    telephone: "+261 32 44 231 09",
    email: "feno.rakotomalala@sante.gouv.mg",
    id_sexe: 102, // Femme
    id_statut_agent: 201, // Titulaire
    date_recrutement: "2012-04-10",
    id_grade: 4, // Médecin Chef Spécialiste (M3)
    id_ministere: 2,
    id_direction: 3,
    id_service: 4, // SERV_URGENCE
    id_poste: 3 // Médecin Urgentiste Référent
  },
  {
    id_agent: 3,
    matricule: "FN-910482",
    nom: "ANDRIANARIVO",
    prenom: "Harijaona",
    date_naissance: "1990-11-04",
    lieu_naissance: "Toamasina",
    adresse: "Quartier Tanambao, Toamasina, Madagascar",
    telephone: "+261 33 15 888 77",
    email: "harijaona.andrianarivo@education.mg",
    id_sexe: 101,
    id_statut_agent: 201,
    date_recrutement: "2018-10-01",
    id_grade: 7, // Professeur de Lycée Classe Normale
    id_ministere: 3,
    id_direction: 5,
    id_service: 5, // LYCEE_CLA
    id_poste: 4 // Enseignant Agrégé de Mathématiques
  },
  {
    id_agent: 4,
    matricule: "FN-382910",
    nom: "RAZAFINDRAKOTO",
    prenom: "Hasina",
    date_naissance: "1994-02-18",
    lieu_naissance: "Mahajanga",
    adresse: "Ankorondrano, Antananarivo, Madagascar",
    telephone: "+261 34 89 777 55",
    email: "hasina.razafindrakoto@modernisation.mg",
    id_sexe: 102,
    id_statut_agent: 203, // Contractuel
    date_recrutement: "2021-03-01",
    id_grade: 8, // Ingénieur d'Études (ING_PRINC)
    id_ministere: 1,
    id_direction: 2,
    id_service: 1, // SERV_RECRUT
    id_poste: 5 // Ingénieur Cloud
  },
  {
    id_agent: 5,
    matricule: "FN-489028",
    nom: "RANDRIANASOLO",
    prenom: "Toky",
    date_naissance: "1997-07-30",
    lieu_naissance: "Antsirabe",
    adresse: "Analakely, Antananarivo, Madagascar",
    telephone: "+261 32 99 111 22",
    email: "toky.randrianasolo@fonctionnaires.mg",
    id_sexe: 101,
    id_statut_agent: 202, // Stagiaire
    date_recrutement: "2024-02-01",
    id_grade: 3, // Administrateur Civil Adjoint
    id_ministere: 1,
    id_direction: 1,
    id_service: 1,
    id_poste: 2
  }
];

// Dossiers
export const initialDossiersAgents: DossierAgent[] = [
  { id_dossier: 1, id_agent: 1, date_ouverture: "2008-01-20", observations: "Excellentes appreciations au fil des avancements. Dossier à jour." },
  { id_dossier: 2, id_agent: 2, date_ouverture: "2012-04-12", observations: "Mutation effectuée en 2020 pour le CHRR Toamasina depuis Antananarivo Analakely." },
  { id_dossier: 3, id_agent: 3, date_ouverture: "2018-10-05", observations: "Aptitudes pédagogiques saluées par l'inspection académique nationale." },
  { id_dossier: 4, id_agent: 4, date_ouverture: "2021-03-05", observations: "Recrutée sur contrat exceptionnel pour l'infogérance SGRH." },
  { id_dossier: 5, id_agent: 5, date_ouverture: "2024-02-10", observations: "Rapport d'évaluation de stage attendu pour titularisation définitive." }
];

// Contacts urgences
export const initialContactsUrgence: ContactUrgence[] = [
  { id_contact: 1, id_agent: 1, nom: "RABEMANANJARA Albertine", telephone: "+261 34 48 112 33", lien_parente: "Épouse" },
  { id_contact: 2, id_agent: 2, nom: "RAKOTOMALALA Vamara", telephone: "+261 32 02 030 45", lien_parente: "Père" },
  { id_contact: 3, id_agent: 3, nom: "ANDRIANARIVO Sali", telephone: "+261 33 99 887 66", lien_parente: "Mère" }
];

// Documents administratifs
export const initialDocumentsAgents: DocumentAgent[] = [
  { id_document: 1, id_agent: 1, id_type_document: 601, fichier: "cni_rabemananjara_andry.pdf", date_ajout: "2024-05-10 14:00" },
  { id_document: 2, id_agent: 1, id_type_document: 602, fichier: "arrete_andry_promotion.pdf", date_ajout: "2024-06-15 09:30" },
  { id_document: 3, id_agent: 2, id_type_document: 603, fichier: "diplome_doctorat_feno.pdf", date_ajout: "2024-02-01 11:00" },
  { id_document: 4, id_agent: 4, id_type_document: 604, fichier: "rib_hasina_razafindrakoto.pdf", date_ajout: "2024-03-01 16:45" }
];

// Affectations
export const initialAffectations: Affectation[] = [
  { id_affectation: 1, id_agent: 1, id_poste: 2, id_service: 2, date_debut: "2020-05-10", date_fin: null },
  { id_affectation: 2, id_agent: 2, id_poste: 3, id_service: 4, date_debut: "2022-01-15", date_fin: null },
  { id_affectation: 3, id_agent: 3, id_poste: 4, id_service: 5, date_debut: "2018-10-01", date_fin: null }
];

// Promotions
export const initialPromotions: Promotion[] = [
  { id_promotion: 1, id_agent: 1, ancien_grade: 3, nouveau_grade: 2, date_promotion: "2022-01-01" },
  { id_promotion: 2, id_agent: 2, ancien_grade: 5, nouveau_grade: 4, date_promotion: "2020-10-12" }
];

// Mutations
export const initialMutations: Mutation[] = [
  { id_mutation: 1, id_agent: 2, service_source: 1, service_destination: 4, date_mutation: "2020-03-01" }
];

// Sanctions
export const initialSanctions: Sanction[] = [
  { id_sanction: 1, id_agent: 5, motif: "Retards injustifiés répétés lors de réunions stratégiques (Avertissement)", date_sanction: "2025-05-18" }
];

// Résumé des présences récentes de simulation
export const initialPresences: Presence[] = [
  { id_presence: 1, id_agent: 1, date_presence: "2026-06-02", heure_arrivee: "07:28:10", heure_depart: "16:45:00", id_statut_presence: 301 },
  { id_presence: 2, id_agent: 2, date_presence: "2026-06-02", heure_arrivee: "08:15:33", heure_depart: "18:00:15", id_statut_presence: 302 }, // Retard
  { id_presence: 3, id_agent: 3, date_presence: "2026-06-02", heure_arrivee: "07:11:00", heure_depart: "15:00:00", id_statut_presence: 301 },
  { id_presence: 4, id_agent: 4, date_presence: "2026-06-02", heure_arrivee: "07:44:20", heure_depart: null, id_statut_presence: 301 },
  { id_presence: 5, id_agent: 5, date_presence: "2026-06-02", heure_arrivee: "", heure_depart: null, id_statut_presence: 303 }, // Absent non justifié

  { id_presence: 6, id_agent: 1, date_presence: "2026-06-01", heure_arrivee: "07:35:00", heure_depart: "16:30:00", id_statut_presence: 301 },
  { id_presence: 7, id_agent: 2, date_presence: "2026-06-01", heure_arrivee: "07:45:00", heure_depart: "17:15:00", id_statut_presence: 301 },
  { id_presence: 8, id_agent: 3, date_presence: "2026-06-01", heure_arrivee: "", heure_depart: null, id_statut_presence: 304 } // Justifié d'absence
];

// Types de Congés
export const initialTypesConges: TypeConge[] = [
  { id_type_conge: 1, code: "CONGE_ANNUEL", libelle: "Congé Annuel Régulier", nb_jours: 30 },
  { id_type_conge: 2, code: "MALADIE", libelle: "Congé Maladie ou Convalescence", nb_jours: 15 },
  { id_type_conge: 3, code: "MATERNITE", libelle: "Congé de Maternité", nb_jours: 98 },
  { id_type_conge: 4, code: "MOUV_SPEC", libelle: "Permission pour évènements familiaux", nb_jours: 5 }
];

// Demandes de Congés
export const initialDemandesConges: DemandeConge[] = [
  { id_conge: 1, id_agent: 1, id_type_conge: 1, date_debut: "2026-08-01", date_fin: "2026-08-31", id_statut_conge: 401 }, // En attente
  { id_conge: 2, id_agent: 2, id_type_conge: 1, date_debut: "2026-07-01", date_fin: "2026-07-15", id_statut_conge: 402 }, // Validé
  { id_conge: 4, id_agent: 3, id_type_conge: 2, date_debut: "2026-05-18", date_fin: "2026-05-24", id_statut_conge: 402 }, // Passé approuvé
  { id_conge: 3, id_agent: 5, id_type_conge: 4, date_debut: "2026-06-10", date_fin: "2026-06-12", id_statut_conge: 401 }  // En attente
];

// Campagnes Évaluations & Critères
export const initialCampagnesEvaluation: CampagneEvaluation[] = [
  { id_campagne: 1, annee: 2024, libelle: "Campagne d'Évaluation Annuelle 2024" },
  { id_campagne: 2, annee: 2025, libelle: "Campagne d'Évaluation Annuelle 2025" }
];

export const initialCriteresEvaluation: CritereEvaluation[] = [
  { id_critere: 1, libelle: "Rendement de travail / Productivité", coefficient: 3 },
  { id_critere: 2, libelle: "Discipline et respect de la hiérarchie", coefficient: 2 },
  { id_critere: 3, libelle: "Initiative médicale / innovation", coefficient: 2 },
  { id_critere: 4, libelle: "Sens du Service Public & Éthique", coefficient: 3 }
];

export const initialEvaluations: Evaluation[] = [
  { id_evaluation: 1, id_agent: 1, id_campagne: 2, date_evaluation: "2025-11-20" },
  { id_evaluation: 2, id_agent: 2, id_campagne: 2, date_evaluation: "2025-12-04" },
  { id_evaluation: 3, id_agent: 3, id_campagne: 2, date_evaluation: "2025-11-15" }
];

export const initialNotesEvaluation: NoteEvaluation[] = [
  // Évaluation 1 (id_agent: 1)
  { id_evaluation: 1, id_critere: 1, note: 16.5 },
  { id_evaluation: 1, id_critere: 2, note: 18.0 },
  { id_evaluation: 1, id_critere: 4, note: 17.0 },

  // Évaluation 2 (id_agent: 2)
  { id_evaluation: 2, id_critere: 1, note: 18.5 },
  { id_evaluation: 2, id_critere: 3, note: 19.0 },
  { id_evaluation: 2, id_critere: 4, note: 18.0 },

  // Évaluation 3 (id_agent: 3)
  { id_evaluation: 3, id_critere: 1, note: 14.5 },
  { id_evaluation: 3, id_critere: 2, note: 15.0 },
  { id_evaluation: 3, id_critere: 4, note: 16.0 }
];

// Formations & Sessions
export const initialFormations: Formation[] = [
  { id_formation: 1, titre: "Modernisation des écrits administratifs officiels", description: "Maitriser les nouvelles règles de la rédaction administrative républicaine." },
  { id_formation: 2, titre: "Urgences pédiatriques en milieu hospitalier public", description: "Protocoles d'interventions avancés sur les détresses respiratoires de l'enfant." },
  { id_formation: 3, titre: "Cybersécurité des bases de données de l'État", description: "Application pratique aux architectures SGRH du cloud gouvernemental." }
];

export const initialSessionsFormation: SessionFormation[] = [
  { id_session: 1, id_formation: 1, date_debut: "2026-04-10", date_fin: "2026-04-14" },
  { id_session: 2, id_formation: 2, date_debut: "2026-05-15", date_fin: "2026-05-20" },
  { id_session: 3, id_formation: 3, date_debut: "2026-06-20", date_fin: "2026-06-25" }
];

export const initialInscriptionsFormations: InscriptionFormation[] = [
  { id_agent: 1, id_session: 1 },
  { id_agent: 5, id_session: 1 },
  { id_agent: 2, id_session: 2 },
  { id_agent: 4, id_session: 3 }
];

// Compétences
export const initialCompetences: Competence[] = [
  { id_competence: 1, libelle: "Rédaction administrative générale" },
  { id_competence: 2, libelle: "Médecine d'urgence" },
  { id_competence: 3, libelle: "Didactique des Mathématiques avancées" },
  { id_competence: 4, libelle: "Administration Firestore & Cloud SQL" },
  { id_competence: 5, libelle: "Éthique républicaine et déontologie" }
];

export const initialAgentCompetences: AgentCompetence[] = [
  { id_agent: 1, id_competence: 1, id_niveau: 504 }, // Expert
  { id_agent: 1, id_competence: 5, id_niveau: 503 }, // Avancé
  
  { id_agent: 2, id_competence: 2, id_niveau: 504 }, // Expert
  
  { id_agent: 4, id_competence: 4, id_niveau: 503 }, // Avancé
  { id_agent: 4, id_competence: 1, id_niveau: 502 }  // Intermédiaire
];

// Primes et retenues
export const initialPrimes: Prime[] = [
  { id_prime: 1, libelle: "Indemnité de Logement Publique", montant: 80000.00 },
  { id_prime: 2, libelle: "Prime d'Urgence et Risques Médicaux", montant: 120000.00 },
  { id_prime: 3, libelle: "Prime de Recherche et Encadrement", montant: 50000.00 },
  { id_prime: 4, libelle: "Prime d'Ancienneté Administrative", montant: 30000.00 }
];

export const initialRetenues: Retenue[] = [
  { id_retenue: 1, libelle: "Cotisation Mutuelle Générale Fonctionnaires (MGE)", montant: 15600.00 },
  { id_retenue: 2, libelle: "Retenue Régime de Caisse Générale de Retraite (IPS)", montant: 34000.00 },
  { id_retenue: 3, libelle: "Impôt Général sur les Revenus Salariaux (IGR)", montant: 45000.00 }
];

export const initialBulletinsPaie: BulletinPaie[] = [
  { id_bulletin: 1, id_agent: 1, mois: 5, annee: 2026, salaire_base: 680000.00, salaire_net: 730400.00 },
  { id_bulletin: 2, id_agent: 2, mois: 5, annee: 2026, salaire_base: 950000.00, salaire_net: 1020400.00 },
  { id_bulletin: 3, id_agent: 3, mois: 5, annee: 2026, salaire_base: 480000.00, salaire_net: 510400.00 },
  { id_bulletin: 4, id_agent: 4, mois: 5, annee: 2026, salaire_base: 590000.00, salaire_net: 625400.00 }
];

// Audit et Logs
export const initialJournalAudit: JournalAudit[] = [
  { id_audit: 1, id_utilisateur: 1, table_concernee: "utilisateurs", action_effectuee: "CONNEXION (admin_central)", date_action: "2026-06-02 18:30" },
  { id_audit: 2, id_utilisateur: 1, table_concernee: "demandes_conges", action_effectuee: "VALIDATION_CONGE (id: 2, Agent: Fanta)", date_action: "2026-06-02 18:45" },
  { id_audit: 3, id_utilisateur: 2, table_concernee: "agents", action_effectuee: "MODIFICATION (Mise à jour contacts urgence agent_1)", date_action: "2026-06-02 19:10" },
  { id_audit: 4, id_utilisateur: 1, table_concernee: "agents", action_effectuee: "CREATION (Recrutement nouvel agent FN-489028)", date_action: "2026-06-02 20:15" }
];


// SQL DDL schema script ready for aesthetic rendering
export const sgrhSqlSchema = `-- SGRH PUBLIC - SCHEMA COMPLET (Base de données)
DROP DATABASE IF EXISTS sgrh_public;
CREATE DATABASE sgrh_public CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sgrh_public;

-- REFERENCES GENERIQUES
CREATE TABLE types_reference(
 id_type_reference BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(50) UNIQUE NOT NULL,
 libelle VARCHAR(150) NOT NULL
);

CREATE TABLE valeurs_reference(
 id_valeur_reference BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_type_reference BIGINT NOT NULL,
 code VARCHAR(50) NOT NULL,
 libelle VARCHAR(150) NOT NULL,
 actif BOOLEAN DEFAULT TRUE,
 FOREIGN KEY(id_type_reference) REFERENCES types_reference(id_type_reference)
);

-- SECURITE
...`;
