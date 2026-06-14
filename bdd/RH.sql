
-- SGRH PUBLIC - SCHEMA COMPLET (Base de données)
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
 FOREIGN KEY(id_type_reference) REFERENCES types_reference(id_type_reference),
 UNIQUE(id_type_reference,code)
);

-- SECURITE
CREATE TABLE roles(
 id_role BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(50) UNIQUE NOT NULL,
 nom VARCHAR(100) NOT NULL
);

CREATE TABLE permissions(
 id_permission BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(100) UNIQUE NOT NULL,
 nom VARCHAR(150) NOT NULL
);

CREATE TABLE role_permissions(
 id_role BIGINT,
 id_permission BIGINT,
 PRIMARY KEY(id_role,id_permission),
 FOREIGN KEY(id_role) REFERENCES roles(id_role),
 FOREIGN KEY(id_permission) REFERENCES permissions(id_permission)
);

CREATE TABLE utilisateurs(
 id_utilisateur BIGINT AUTO_INCREMENT PRIMARY KEY,
 username VARCHAR(100) UNIQUE NOT NULL,
 email VARCHAR(150) UNIQUE,
 mot_de_passe VARCHAR(255) NOT NULL,
 actif BOOLEAN DEFAULT TRUE,
 date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE utilisateur_roles(
 id_utilisateur BIGINT,
 id_role BIGINT,
 PRIMARY KEY(id_utilisateur,id_role),
 FOREIGN KEY(id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
 FOREIGN KEY(id_role) REFERENCES roles(id_role)
);

-- ORGANISATION
CREATE TABLE ministeres(
 id_ministere BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(30) UNIQUE,
 nom VARCHAR(255) NOT NULL
);

CREATE TABLE directions(
 id_direction BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_ministere BIGINT NOT NULL,
 code VARCHAR(30),
 nom VARCHAR(255) NOT NULL,
 FOREIGN KEY(id_ministere) REFERENCES ministeres(id_ministere)
);

CREATE TABLE services(
 id_service BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_direction BIGINT NOT NULL,
 code VARCHAR(30),
 nom VARCHAR(255) NOT NULL,
 FOREIGN KEY(id_direction) REFERENCES directions(id_direction)
);

CREATE TABLE bureaux(
 id_bureau BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_service BIGINT NOT NULL,
 nom VARCHAR(255) NOT NULL,
 FOREIGN KEY(id_service) REFERENCES services(id_service)
);

CREATE TABLE categories(
 id_categorie BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(20),
 libelle VARCHAR(100)
);

CREATE TABLE corps(
 id_corps BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(20),
 libelle VARCHAR(150)
);

CREATE TABLE grades(
 id_grade BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_corps BIGINT,
 id_categorie BIGINT,
 code VARCHAR(20),
 libelle VARCHAR(150),
 FOREIGN KEY(id_corps) REFERENCES corps(id_corps),
 FOREIGN KEY(id_categorie) REFERENCES categories(id_categorie)
);

CREATE TABLE echelles_salariales(
 id_echelle BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_grade BIGINT,
 indice_min INT,
 indice_max INT,
 salaire_base DECIMAL(15,2),
 FOREIGN KEY(id_grade) REFERENCES grades(id_grade)
);

CREATE TABLE postes(
 id_poste BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(30),
 intitule VARCHAR(200) NOT NULL,
 description TEXT
);

-- AGENTS
CREATE TABLE agents(
 id_agent BIGINT AUTO_INCREMENT PRIMARY KEY,
 matricule VARCHAR(50) UNIQUE NOT NULL,
 nom VARCHAR(100) NOT NULL,
 prenom VARCHAR(100),
 date_naissance DATE,
 lieu_naissance VARCHAR(150),
 adresse TEXT,
 telephone VARCHAR(30),
 email VARCHAR(150),
 id_sexe BIGINT,
 id_statut_agent BIGINT,
 date_recrutement DATE,
 id_grade BIGINT,
 FOREIGN KEY(id_sexe) REFERENCES valeurs_reference(id_valeur_reference),
 FOREIGN KEY(id_statut_agent) REFERENCES valeurs_reference(id_valeur_reference),
 FOREIGN KEY(id_grade) REFERENCES grades(id_grade)
);

CREATE TABLE dossiers_agents(
 id_dossier BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT UNIQUE,
 date_ouverture DATE,
 observations TEXT,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent)
);

CREATE TABLE contacts_urgence(
 id_contact BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 nom VARCHAR(150),
 telephone VARCHAR(30),
 lien_parente VARCHAR(100),
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent)
);

CREATE TABLE documents_agents(
 id_document BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 id_type_document BIGINT,
 fichier VARCHAR(255),
 date_ajout DATETIME,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(id_type_document) REFERENCES valeurs_reference(id_valeur_reference)
);

-- CARRIERE
CREATE TABLE affectations(
 id_affectation BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 id_poste BIGINT,
 id_service BIGINT,
 date_debut DATE,
 date_fin DATE,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(id_poste) REFERENCES postes(id_poste),
 FOREIGN KEY(id_service) REFERENCES services(id_service)
);

CREATE TABLE promotions(
 id_promotion BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 ancien_grade BIGINT,
 nouveau_grade BIGINT,
 date_promotion DATE,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(ancien_grade) REFERENCES grades(id_grade),
 FOREIGN KEY(nouveau_grade) REFERENCES grades(id_grade)
);

CREATE TABLE mutations(
 id_mutation BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 service_source BIGINT,
 service_destination BIGINT,
 date_mutation DATE,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent)
);

CREATE TABLE sanctions(
 id_sanction BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 motif TEXT,
 date_sanction DATE,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent)
);

-- PRESENCES
CREATE TABLE presences(
 id_presence BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 date_presence DATE,
 heure_arrivee TIME,
 heure_depart TIME,
 id_statut_presence BIGINT,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(id_statut_presence) REFERENCES valeurs_reference(id_valeur_reference)
);

-- CONGES
CREATE TABLE types_conges(
 id_type_conge BIGINT AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(20),
 libelle VARCHAR(100),
 nb_jours INT
);

CREATE TABLE demandes_conges(
 id_conge BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 id_type_conge BIGINT,
 date_debut DATE,
 date_fin DATE,
 id_statut_conge BIGINT,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(id_type_conge) REFERENCES types_conges(id_type_conge),
 FOREIGN KEY(id_statut_conge) REFERENCES valeurs_reference(id_valeur_reference)
);

-- EVALUATIONS
CREATE TABLE campagnes_evaluation(
 id_campagne BIGINT AUTO_INCREMENT PRIMARY KEY,
 annee YEAR,
 libelle VARCHAR(150)
);

CREATE TABLE criteres_evaluation(
 id_critere BIGINT AUTO_INCREMENT PRIMARY KEY,
 libelle VARCHAR(150),
 coefficient INT
);

CREATE TABLE evaluations(
 id_evaluation BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 id_campagne BIGINT,
 date_evaluation DATE,
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(id_campagne) REFERENCES campagnes_evaluation(id_campagne)
);

CREATE TABLE notes_evaluation(
 id_evaluation BIGINT,
 id_critere BIGINT,
 note DECIMAL(5,2),
 PRIMARY KEY(id_evaluation,id_critere),
 FOREIGN KEY(id_evaluation) REFERENCES evaluations(id_evaluation),
 FOREIGN KEY(id_critere) REFERENCES criteres_evaluation(id_critere)
);

-- FORMATIONS
CREATE TABLE formations(
 id_formation BIGINT AUTO_INCREMENT PRIMARY KEY,
 titre VARCHAR(255),
 description TEXT
);

CREATE TABLE sessions_formation(
 id_session BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_formation BIGINT,
 date_debut DATE,
 date_fin DATE,
 FOREIGN KEY(id_formation) REFERENCES formations(id_formation)
);

CREATE TABLE inscriptions_formations(
 id_agent BIGINT,
 id_session BIGINT,
 PRIMARY KEY(id_agent,id_session),
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(id_session) REFERENCES sessions_formation(id_session)
);

-- COMPETENCES
CREATE TABLE competences(
 id_competence BIGINT AUTO_INCREMENT PRIMARY KEY,
 libelle VARCHAR(150)
);

CREATE TABLE agent_competences(
 id_agent BIGINT,
 id_competence BIGINT,
 id_niveau BIGINT,
 PRIMARY KEY(id_agent,id_competence),
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent),
 FOREIGN KEY(id_competence) REFERENCES competences(id_competence),
 FOREIGN KEY(id_niveau) REFERENCES valeurs_reference(id_valeur_reference)
);

-- PAIE
CREATE TABLE primes(
 id_prime BIGINT AUTO_INCREMENT PRIMARY KEY,
 libelle VARCHAR(150),
 montant DECIMAL(15,2)
);

CREATE TABLE retenues(
 id_retenue BIGINT AUTO_INCREMENT PRIMARY KEY,
 libelle VARCHAR(150),
 montant DECIMAL(15,2)
);

CREATE TABLE bulletins_paie(
 id_bulletin BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_agent BIGINT,
 mois INT,
 annee YEAR,
 salaire_base DECIMAL(15,2),
 salaire_net DECIMAL(15,2),
 FOREIGN KEY(id_agent) REFERENCES agents(id_agent)
);

-- NOTIFICATIONS ET AUDIT
CREATE TABLE notifications(
 id_notification BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_utilisateur BIGINT,
 titre VARCHAR(200),
 message TEXT,
 date_notification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

CREATE TABLE journal_audit(
 id_audit BIGINT AUTO_INCREMENT PRIMARY KEY,
 id_utilisateur BIGINT,
 table_concernee VARCHAR(100),
 action_effectuee VARCHAR(50),
 date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);
