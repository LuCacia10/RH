-- ============================================================================
-- SGRH PUBLIC MADAGASCAR - JEU DE DONNEES DE TEST COHERENT
-- Identités fictives, données administratives réalistes, montants en MGA.
-- À exécuter après RH.sql : mysql -u root sgrh_public < bdd/RH_test_data.sql
-- Mot de passe commun des comptes de démonstration : Demo@2026
-- IMPORTANT : ne jamais conserver ce mot de passe dans un environnement réel.
-- ============================================================================
USE sgrh_public;
SET NAMES utf8mb4;

-- 1-2. Référentiels génériques
INSERT IGNORE INTO types_reference(id_type_reference,code,libelle) VALUES
(1,'SEXE','Sexe'),(2,'STATUT_AGENT','Statut administratif de l’agent'),
(3,'STATUT_PRESENCE','Statut de présence'),(4,'STATUT_CONGE','Statut de demande de congé'),
(5,'TYPE_DOCUMENT','Type de document RH'),(6,'NIVEAU_COMPETENCE','Niveau de compétence');

INSERT IGNORE INTO valeurs_reference(id_valeur_reference,id_type_reference,code,libelle,actif) VALUES
(101,1,'H','Homme',1),(102,1,'F','Femme',1),
(201,2,'TITULAIRE','Fonctionnaire titulaire',1),(202,2,'STAGIAIRE','Fonctionnaire stagiaire',1),(203,2,'CONTRACTUEL','Agent contractuel',1),
(301,3,'PRESENT','Présent',1),(302,3,'RETARD','En retard',1),(303,3,'ABSENT_NJ','Absent non justifié',1),(304,3,'ABSENT_J','Absent justifié',1),
(401,4,'ATTENTE','En attente de validation',1),(402,4,'VALIDE','Validé',1),(403,4,'REJETE','Rejeté',1),
(501,5,'CIN','Carte nationale d’identité',1),(502,5,'DIPLOME','Diplôme certifié',1),(503,5,'ARRETE','Arrêté de nomination',1),(504,5,'CERTIFICAT','Certificat administratif',1),
(601,6,'DEBUTANT','Débutant',1),(602,6,'INTERMEDIAIRE','Intermédiaire',1),(603,6,'AVANCE','Avancé',1),(604,6,'EXPERT','Expert',1);

-- 3-7. Sécurité RBAC
INSERT IGNORE INTO roles(id_role,code,nom) VALUES
(1,'ADMIN_CENTRAL','Administrateur Central RH'),(2,'RESPONSABLE_RH','Responsable RH'),
(3,'CHEF_SERVICE','Chef de Service'),(4,'AGENT_PUBLIC','Agent Public');

INSERT IGNORE INTO permissions(id_permission,code,nom) VALUES
(1,'DASHBOARD_NATIONAL','Tableau de bord national'),(2,'DASHBOARD_RH','Tableau de bord RH'),
(3,'DASHBOARD_SERVICE','Tableau de bord du service'),(4,'DASHBOARD_PERSONAL','Tableau de bord personnel'),
(5,'USER_MANAGE','Gérer les utilisateurs'),(6,'ROLE_MANAGE','Gérer les rôles'),(7,'PERMISSION_MANAGE','Gérer les permissions'),
(8,'SYSTEM_MANAGE','Gérer les paramètres système'),(9,'BACKUP_MANAGE','Gérer les sauvegardes'),(10,'AUDIT_VIEW','Consulter le journal d’audit'),
(11,'REPORT_NATIONAL','Générer les rapports nationaux'),(12,'REPORT_ADMIN','Générer les rapports administratifs'),(13,'STATS_RH','Consulter les statistiques RH'),
(14,'ORG_VIEW','Consulter l’organisation'),(15,'ORG_MANAGE','Gérer l’organisation'),(16,'REFERENCE_VIEW','Consulter les référentiels'),
(17,'AGENT_VIEW_ALL','Consulter tous les agents'),(18,'AGENT_VIEW_SERVICE','Consulter les agents du service'),(19,'AGENT_VIEW_SELF','Consulter son dossier'),
(20,'AGENT_MANAGE','Gérer les agents'),(21,'AGENT_DELETE','Supprimer un agent'),(22,'AGENT_SELF_EDIT','Modifier ses informations'),
(23,'CAREER_MANAGE','Gérer les carrières'),(24,'CAREER_VIEW_SELF','Consulter sa carrière'),
(25,'LEAVE_MANAGE','Gérer les congés'),(26,'LEAVE_APPROVE','Valider les congés'),(27,'LEAVE_REQUEST','Demander un congé'),(28,'LEAVE_VIEW_SELF','Consulter ses congés'),
(29,'PRESENCE_VALIDATE','Valider les présences'),(30,'PRESENCE_VIEW_SERVICE','Consulter les présences du service'),
(31,'EVALUATION_MANAGE','Gérer les évaluations'),(32,'EVALUATION_SERVICE','Évaluer les agents du service'),
(33,'TRAINING_MANAGE','Gérer les formations'),(34,'SANCTION_MANAGE','Gérer les sanctions'),(35,'REWARD_MANAGE','Gérer les récompenses'),
(36,'PAYROLL_VIEW','Consulter la paie'),(37,'PAYROLL_MANAGE','Gérer la paie'),(38,'DOCUMENT_SELF_DOWNLOAD','Télécharger ses documents'),
(39,'NOTIFICATION_VIEW','Consulter les notifications'),(40,'PASSWORD_CHANGE','Modifier son mot de passe');

INSERT IGNORE INTO role_permissions(id_role,id_permission)
SELECT 1,id_permission FROM permissions;
INSERT IGNORE INTO role_permissions(id_role,id_permission)
SELECT 2,id_permission FROM permissions WHERE code IN ('DASHBOARD_RH','STATS_RH','REPORT_ADMIN','ORG_VIEW','REFERENCE_VIEW','AGENT_VIEW_ALL','AGENT_MANAGE','CAREER_MANAGE','LEAVE_MANAGE','LEAVE_APPROVE','PRESENCE_VIEW_SERVICE','EVALUATION_MANAGE','TRAINING_MANAGE','SANCTION_MANAGE','REWARD_MANAGE','PAYROLL_VIEW','PAYROLL_MANAGE','AUDIT_VIEW');
INSERT IGNORE INTO role_permissions(id_role,id_permission)
SELECT 3,id_permission FROM permissions WHERE code IN ('DASHBOARD_SERVICE','AGENT_VIEW_SERVICE','LEAVE_APPROVE','PRESENCE_VALIDATE','PRESENCE_VIEW_SERVICE','EVALUATION_SERVICE','STATS_RH','NOTIFICATION_VIEW','REFERENCE_VIEW');
INSERT IGNORE INTO role_permissions(id_role,id_permission)
SELECT 4,id_permission FROM permissions WHERE code IN ('DASHBOARD_PERSONAL','AGENT_VIEW_SELF','AGENT_SELF_EDIT','CAREER_VIEW_SELF','LEAVE_REQUEST','LEAVE_VIEW_SELF','DOCUMENT_SELF_DOWNLOAD','NOTIFICATION_VIEW','PASSWORD_CHANGE','REFERENCE_VIEW');

-- Mot de passe en clair réservé à la démonstration locale
INSERT IGNORE INTO utilisateurs(id_utilisateur,username,email,mot_de_passe,actif,date_creation,id_agent,id_service) VALUES
(101,'admin','admin@sgrh.gov.mg','Admin@123',1,'2026-01-05 08:00:00',NULL,NULL),
(102,'rh.central','rh.central@sgrh.gov.mg','Demo@2026',1,'2026-01-06 08:15:00',NULL,NULL),
(103,'chef.carrieres','chef.carrieres@sgrh.gov.mg','Demo@2026',1,'2026-01-07 09:00:00',NULL,2),
(104,'andry.rabemananjara','andry.rabemananjara@fonctionpublique.gov.mg','Demo@2026',1,'2026-01-08 09:00:00',1,NULL),
(105,'feno.rakotomalala','feno.rakotomalala@sante.gov.mg','Demo@2026',1,'2026-01-08 09:10:00',2,NULL),
(106,'harijaona.andrianarivo','harijaona.andrianarivo@education.gov.mg','Demo@2026',1,'2026-01-08 09:20:00',3,NULL),
(107,'hasina.razafindrakoto','hasina.razafindrakoto@numerique.gov.mg','Demo@2026',1,'2026-01-08 09:30:00',4,NULL);
INSERT IGNORE INTO utilisateur_roles(id_utilisateur,id_role)
SELECT u.id_utilisateur,r.id_role FROM utilisateurs u JOIN roles r ON r.code='ADMIN_CENTRAL' WHERE u.username='admin';
INSERT IGNORE INTO utilisateur_roles(id_utilisateur,id_role)
SELECT u.id_utilisateur,r.id_role FROM utilisateurs u JOIN roles r ON r.code='RESPONSABLE_RH' WHERE u.username='rh.central';
INSERT IGNORE INTO utilisateur_roles(id_utilisateur,id_role)
SELECT u.id_utilisateur,r.id_role FROM utilisateurs u JOIN roles r ON r.code='CHEF_SERVICE' WHERE u.username='chef.carrieres';
INSERT IGNORE INTO utilisateur_roles(id_utilisateur,id_role)
SELECT u.id_utilisateur,r.id_role FROM utilisateurs u JOIN roles r ON r.code='AGENT_PUBLIC' WHERE u.username IN ('andry.rabemananjara','feno.rakotomalala','harijaona.andrianarivo','hasina.razafindrakoto');

-- 8-12. Organisation administrative
INSERT IGNORE INTO ministeres(id_ministere,code,nom) VALUES
(1,'MTEFPLS','Ministère du Travail, de l’Emploi et de la Fonction Publique'),
(2,'MSANP','Ministère de la Santé Publique'),(3,'MEN','Ministère de l’Éducation Nationale'),
(4,'MDN','Ministère du Développement Numérique');
INSERT IGNORE INTO directions(id_direction,id_ministere,code,nom) VALUES
(1,1,'DRH','Direction des Ressources Humaines'),(2,1,'DSI','Direction des Systèmes d’Information'),
(3,2,'DRSP','Direction Régionale de la Santé Publique'),(4,3,'DGEFA','Direction Générale de l’Éducation Fondamentale'),
(5,4,'DTRANSFO','Direction de la Transformation Numérique');
INSERT IGNORE INTO services(id_service,id_direction,code,nom) VALUES
(1,1,'SRV-RECRUT','Service du Recrutement'),(2,1,'SRV-CARR','Service des Carrières'),
(3,2,'SRV-SI','Service des Applications RH'),(4,3,'SRV-SOINS','Service de Coordination des Soins'),
(5,4,'SRV-SCOL','Service de l’Administration Scolaire'),(6,5,'SRV-INNOV','Service Innovation et Gouvernance Numérique');
INSERT IGNORE INTO bureaux(id_bureau,id_service,nom) VALUES
(1,1,'Bureau des concours administratifs'),(2,1,'Bureau d’intégration'),(3,2,'Bureau des avancements'),
(4,2,'Bureau des affectations'),(5,3,'Bureau assistance applicative'),(6,4,'Bureau du personnel médical'),
(7,5,'Bureau de gestion des enseignants'),(8,6,'Bureau des projets numériques');
INSERT IGNORE INTO categories(id_categorie,code,libelle) VALUES
(1,'A','Cadres supérieurs de la fonction publique'),(2,'B','Cadres intermédiaires'),(3,'C','Agents d’exécution');
INSERT IGNORE INTO corps(id_corps,code,libelle) VALUES
(1,'ADM-CIV','Administrateurs civils'),(2,'MED-PUB','Médecins de santé publique'),
(3,'ENS-SEC','Enseignants du secondaire'),(4,'ING-ETAT','Ingénieurs de l’État');
INSERT IGNORE INTO grades(id_grade,id_corps,id_categorie,code,libelle) VALUES
(1,1,1,'ADM-A2','Administrateur civil de 2e classe'),(2,1,1,'ADM-A1','Administrateur civil de 1re classe'),
(3,2,1,'MED-2','Médecin principal'),(4,2,1,'MED-1','Médecin chef'),
(5,3,2,'ENS-2','Professeur certifié'),(6,3,1,'ENS-1','Professeur principal'),
(7,4,1,'ING-2','Ingénieur d’études'),(8,4,1,'ING-1','Ingénieur principal');
INSERT IGNORE INTO echelles_salariales(id_echelle,id_grade,indice_min,indice_max,salaire_base) VALUES
(1,1,600,850,720000),(2,2,800,1100,960000),(3,3,750,1050,1050000),(4,4,1000,1350,1450000),
(5,5,550,780,680000),(6,6,750,980,890000),(7,7,700,950,920000),(8,8,900,1250,1280000);
INSERT IGNORE INTO postes(id_poste,code,intitule,description) VALUES
(1,'DIR-RH','Directeur des Ressources Humaines','Pilote la politique nationale de gestion des ressources humaines.'),
(2,'CHEF-CARR','Chef du Service des Carrières','Coordonne les promotions, mutations et affectations.'),
(3,'MED-REF','Médecin référent','Assure la coordination médicale et la continuité des soins.'),
(4,'PROF-MATH','Professeur de mathématiques','Assure les enseignements et le suivi pédagogique.'),
(5,'ING-SI','Ingénieur systèmes d’information','Conçoit et sécurise les services numériques publics.'),
(6,'GEST-RH','Gestionnaire de dossiers RH','Instruit et met à jour les dossiers administratifs.');

-- 13-16. Agents et dossiers numériques
INSERT IGNORE INTO agents(id_agent,matricule,nom,prenom,date_naissance,lieu_naissance,adresse,telephone,email,id_sexe,id_statut_agent,date_recrutement,id_grade) VALUES
(1,'FN-729103','RABEMANANJARA','Andry','1978-05-14','Antananarivo','Ambohibao, Antananarivo','+261 34 56 123 45','andry.rabemananjara@fonctionpublique.gov.mg',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='SEXE' AND v.code='H' LIMIT 1),(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_AGENT' AND v.code='TITULAIRE' LIMIT 1),'2008-01-15',2),
(2,'FN-108293','RAKOTOMALALA','Feno','1983-09-22','Fianarantsoa','Isotry, Antananarivo','+261 32 44 231 09','feno.rakotomalala@sante.gov.mg',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='SEXE' AND v.code='F' LIMIT 1),(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_AGENT' AND v.code='TITULAIRE' LIMIT 1),'2012-04-10',4),
(3,'FN-910482','ANDRIANARIVO','Harijaona','1990-11-04','Toamasina','Tanambao, Toamasina','+261 33 15 888 77','harijaona.andrianarivo@education.gov.mg',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='SEXE' AND v.code='H' LIMIT 1),(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_AGENT' AND v.code='TITULAIRE' LIMIT 1),'2018-10-01',6),
(4,'FN-382910','RAZAFINDRAKOTO','Hasina','1994-02-18','Mahajanga','Ankorondrano, Antananarivo','+261 34 89 777 55','hasina.razafindrakoto@numerique.gov.mg',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='SEXE' AND v.code='F' LIMIT 1),(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_AGENT' AND v.code='CONTRACTUEL' LIMIT 1),'2021-03-01',8),
(5,'FN-564812','RAKOTOARISOA','Mialy','1988-07-09','Antsirabe','Mahazoarivo, Antsirabe','+261 32 60 102 11','mialy.rakotoarisoa@fonctionpublique.gov.mg',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='SEXE' AND v.code='F' LIMIT 1),(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_AGENT' AND v.code='TITULAIRE' LIMIT 1),'2015-09-14',1),
(6,'FN-775421','RAZAFIMBELO','Toky','1992-12-21','Toliara','Besarety, Antananarivo','+261 33 72 440 18','toky.razafimbelo@fonctionpublique.gov.mg',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='SEXE' AND v.code='H' LIMIT 1),(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_AGENT' AND v.code='STAGIAIRE' LIMIT 1),'2024-02-01',7);
INSERT IGNORE INTO dossiers_agents(id_dossier,id_agent,date_ouverture,observations) VALUES
(1,1,'2008-01-15','Dossier complet, dernière mise à jour en janvier 2026.'),(2,2,'2012-04-10','Titularisation et spécialisation médicale enregistrées.'),
(3,3,'2018-10-01','Affectation pédagogique active.'),(4,4,'2021-03-01','Contrat renouvelé pour la période 2026-2028.'),
(5,5,'2015-09-14','Dossier administratif conforme.'),(6,6,'2024-02-01','Stage probatoire en cours.');
INSERT IGNORE INTO contacts_urgence(id_contact,id_agent,nom,telephone,lien_parente) VALUES
(1,1,'RABEMANANJARA Voahangy','+261 34 11 223 34','Conjointe'),(2,2,'RAKOTOMALALA Hery','+261 32 19 883 20','Frère'),
(3,3,'ANDRIANARIVO Lalao','+261 33 47 220 10','Mère'),(4,4,'RAZAFINDRAKOTO Tahina','+261 34 80 775 12','Sœur'),
(5,5,'RAKOTOARISOA Fanja','+261 32 66 510 09','Conjoint'),(6,6,'RAZAFIMBELO Solo','+261 33 22 701 44','Père');
INSERT IGNORE INTO documents_agents(id_document,id_agent,id_type_document,fichier,date_ajout) VALUES
(1,1,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='TYPE_DOCUMENT' AND v.code='ARRETE' LIMIT 1),'arrete_nomination_FN-729103.pdf','2026-01-10 09:00:00'),
(2,1,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='TYPE_DOCUMENT' AND v.code='CIN' LIMIT 1),'cin_FN-729103.pdf','2026-01-10 09:05:00'),
(3,2,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='TYPE_DOCUMENT' AND v.code='DIPLOME' LIMIT 1),'diplome_medecine_FN-108293.pdf','2026-01-11 10:00:00'),
(4,3,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='TYPE_DOCUMENT' AND v.code='CERTIFICAT' LIMIT 1),'certificat_prise_service_FN-910482.pdf','2026-01-12 11:00:00'),
(5,4,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='TYPE_DOCUMENT' AND v.code='DIPLOME' LIMIT 1),'diplome_ingenieur_FN-382910.pdf','2026-01-13 08:30:00'),
(6,5,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='TYPE_DOCUMENT' AND v.code='ARRETE' LIMIT 1),'arrete_integration_FN-564812.pdf','2026-01-14 14:00:00');

-- 17-20. Carrières
INSERT IGNORE INTO affectations(id_affectation,id_agent,id_poste,id_service,date_debut,date_fin) VALUES
(1,1,2,2,'2021-01-01',NULL),(2,2,3,4,'2020-06-01',NULL),(3,3,4,5,'2018-10-01',NULL),
(4,4,5,6,'2022-01-15',NULL),(5,5,6,1,'2019-03-01',NULL),(6,6,5,3,'2024-02-01',NULL);
INSERT IGNORE INTO promotions(id_promotion,id_agent,ancien_grade,nouveau_grade,date_promotion) VALUES
(1,1,1,2,'2021-01-01'),(2,2,3,4,'2020-06-01'),(3,3,5,6,'2025-01-01'),(4,4,7,8,'2025-07-01');
INSERT IGNORE INTO mutations(id_mutation,id_agent,service_source,service_destination,date_mutation) VALUES
(1,1,1,2,'2021-01-01'),(2,4,3,6,'2022-01-15'),(3,5,2,1,'2019-03-01');
INSERT IGNORE INTO sanctions(id_sanction,id_agent,motif,date_sanction) VALUES
(1,6,'Avertissement écrit pour retards répétés, suivi administratif engagé.','2025-11-18'),
(2,3,'Rappel à l’obligation de transmission des rapports pédagogiques dans les délais.','2024-06-12');

-- 21. Présences
INSERT IGNORE INTO presences(id_presence,id_agent,date_presence,heure_arrivee,heure_depart,id_statut_presence) VALUES
(1,1,'2026-07-15','07:52:00','16:35:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='PRESENT' LIMIT 1)),
(2,2,'2026-07-15','08:04:00','17:02:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='PRESENT' LIMIT 1)),
(3,3,'2026-07-15','08:27:00','16:40:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='RETARD' LIMIT 1)),
(4,4,'2026-07-15',NULL,NULL,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='ABSENT_J' LIMIT 1)),
(5,5,'2026-07-15','07:45:00','16:20:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='PRESENT' LIMIT 1)),
(6,6,'2026-07-15','08:10:00','16:30:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='PRESENT' LIMIT 1)),
(7,1,'2026-07-16','07:50:00','16:30:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='PRESENT' LIMIT 1)),
(8,2,'2026-07-16','07:58:00','17:00:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='PRESENT' LIMIT 1)),
(9,3,'2026-07-16',NULL,NULL,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='ABSENT_NJ' LIMIT 1)),
(10,4,'2026-07-16','08:03:00','16:45:00',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_PRESENCE' AND v.code='PRESENT' LIMIT 1));

-- 22-23. Congés
INSERT IGNORE INTO types_conges(id_type_conge,code,libelle,nb_jours) VALUES
(1,'ANNUEL','Congé annuel',30),(2,'MALADIE','Congé de maladie',15),(3,'MATERNITE','Congé de maternité',98),
(4,'PATERNITE','Congé de paternité',15),(5,'EXCEPTIONNEL','Permission exceptionnelle',10);
INSERT IGNORE INTO demandes_conges(id_conge,id_agent,id_type_conge,date_debut,date_fin,id_statut_conge) VALUES
(1,1,1,'2026-08-03','2026-08-14',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_CONGE' AND v.code='VALIDE' LIMIT 1)),
(2,2,1,'2026-09-07','2026-09-18',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_CONGE' AND v.code='ATTENTE' LIMIT 1)),
(3,3,2,'2026-07-16','2026-07-20',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_CONGE' AND v.code='VALIDE' LIMIT 1)),
(4,4,5,'2026-08-24','2026-08-25',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_CONGE' AND v.code='REJETE' LIMIT 1)),
(5,5,1,'2026-10-05','2026-10-16',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_CONGE' AND v.code='ATTENTE' LIMIT 1)),
(6,6,4,'2026-11-02','2026-11-06',(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='STATUT_CONGE' AND v.code='ATTENTE' LIMIT 1));

-- 24-27. Évaluations
INSERT IGNORE INTO campagnes_evaluation(id_campagne,annee,libelle) VALUES
(1,2025,'Évaluation annuelle des agents publics 2025'),(2,2026,'Évaluation annuelle des agents publics 2026');
INSERT IGNORE INTO criteres_evaluation(id_critere,libelle,coefficient) VALUES
(1,'Qualité du travail accompli',3),(2,'Assiduité et ponctualité',2),(3,'Esprit d’initiative',2),
(4,'Respect des obligations professionnelles',2),(5,'Capacité de collaboration',1);
INSERT IGNORE INTO evaluations(id_evaluation,id_agent,id_campagne,date_evaluation) VALUES
(1,1,1,'2025-12-10'),(2,2,1,'2025-12-11'),(3,3,1,'2025-12-12'),(4,4,1,'2025-12-15'),
(5,5,1,'2025-12-16'),(6,6,1,'2025-12-17');
INSERT IGNORE INTO notes_evaluation(id_evaluation,id_critere,note) VALUES
(1,1,17.5),(1,2,18),(1,3,16),(1,4,18),(1,5,17),(2,1,18),(2,2,17),(2,3,18.5),(2,4,17),(2,5,18),
(3,1,15.5),(3,2,14),(3,3,16),(3,4,15),(3,5,17),(4,1,18),(4,2,17.5),(4,3,19),(4,4,18),(4,5,18.5),
(5,1,16),(5,2,17),(5,3,15.5),(5,4,17),(5,5,16.5),(6,1,14),(6,2,13),(6,3,16),(6,4,14.5),(6,5,15);

-- 28-31. Formations
INSERT IGNORE INTO formations(id_formation,titre,description) VALUES
(1,'Administration publique numérique','Dématérialisation, procédures administratives et sécurité des données.'),
(2,'Management des équipes publiques','Pilotage d’équipe, communication et gestion des objectifs.'),
(3,'Protection des données personnelles','Bonnes pratiques de confidentialité et maîtrise des accès.'),
(4,'Gestion budgétaire et comptable','Principes de gestion des crédits et contrôle des dépenses publiques.');
INSERT IGNORE INTO sessions_formation(id_session,id_formation,date_debut,date_fin) VALUES
(1,1,'2026-03-02','2026-03-06'),(2,2,'2026-04-13','2026-04-15'),(3,3,'2026-06-08','2026-06-10'),(4,4,'2026-09-14','2026-09-18');
INSERT IGNORE INTO inscriptions_formations(id_agent,id_session) VALUES
(1,2),(1,3),(2,2),(2,4),(3,1),(3,3),(4,1),(4,3),(5,1),(5,4),(6,1),(6,3);
INSERT IGNORE INTO competences(id_competence,libelle) VALUES
(1,'Gestion administrative'),(2,'Management d’équipe'),(3,'Outils numériques'),(4,'Sécurité de l’information'),(5,'Gestion budgétaire');
INSERT IGNORE INTO agent_competences(id_agent,id_competence,id_niveau) VALUES
(1,1,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='EXPERT' LIMIT 1)),
(1,2,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='AVANCE' LIMIT 1)),
(2,1,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='AVANCE' LIMIT 1)),
(2,2,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='AVANCE' LIMIT 1)),
(3,3,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='AVANCE' LIMIT 1)),
(3,1,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='INTERMEDIAIRE' LIMIT 1)),
(4,3,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='EXPERT' LIMIT 1)),
(4,4,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='EXPERT' LIMIT 1)),
(5,1,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='AVANCE' LIMIT 1)),
(5,5,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='INTERMEDIAIRE' LIMIT 1)),
(6,3,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='AVANCE' LIMIT 1)),
(6,4,(SELECT v.id_valeur_reference FROM valeurs_reference v JOIN types_reference t ON t.id_type_reference=v.id_type_reference WHERE t.code='NIVEAU_COMPETENCE' AND v.code='INTERMEDIAIRE' LIMIT 1));

-- 32-34. Paie en Ariary malgache
INSERT IGNORE INTO primes(id_prime,libelle,montant) VALUES
(1,'Indemnité de logement',120000),(2,'Prime d’ancienneté',85000),(3,'Indemnité de responsabilité',180000),
(4,'Indemnité de transport',60000),(5,'Prime de technicité',150000);
INSERT IGNORE INTO retenues(id_retenue,libelle,montant) VALUES
(1,'Cotisation retraite',72000),(2,'Cotisation santé',36000),(3,'Impôt sur les revenus salariaux',95000),(4,'Mutuelle des agents publics',25000);
INSERT IGNORE INTO bulletins_paie(id_bulletin,id_agent,mois,annee,salaire_base,salaire_net) VALUES
(1,1,6,2026,960000,1128000),(2,2,6,2026,1450000,1597000),(3,3,6,2026,890000,963000),
(4,4,6,2026,1280000,1412000),(5,5,6,2026,720000,783000),(6,6,6,2026,920000,1002000),
(7,1,7,2026,960000,1128000),(8,2,7,2026,1450000,1597000),(9,3,7,2026,890000,963000),
(10,4,7,2026,1280000,1412000),(11,5,7,2026,720000,783000),(12,6,7,2026,920000,1002000);

-- 35-36. Notifications et audit
INSERT IGNORE INTO notifications(id_notification,id_utilisateur,titre,message,date_notification) VALUES
(1,(SELECT id_utilisateur FROM utilisateurs WHERE username='andry.rabemananjara'),'Congé validé','Votre demande de congé annuel du 3 au 14 août 2026 a été validée.','2026-07-10 10:15:00'),
(2,(SELECT id_utilisateur FROM utilisateurs WHERE username='feno.rakotomalala'),'Demande en attente','Votre demande de congé est en cours de validation hiérarchique.','2026-07-12 14:30:00'),
(3,(SELECT id_utilisateur FROM utilisateurs WHERE username='chef.carrieres'),'Présence à valider','Trois relevés de présence de votre service nécessitent une validation.','2026-07-16 08:10:00'),
(4,(SELECT id_utilisateur FROM utilisateurs WHERE username='rh.central'),'Campagne d’évaluation','La campagne annuelle 2026 sera ouverte le 1er novembre.','2026-07-17 09:00:00'),
(5,(SELECT id_utilisateur FROM utilisateurs WHERE username='hasina.razafindrakoto'),'Document ajouté','Un nouveau certificat a été ajouté à votre dossier RH.','2026-07-18 11:45:00');
INSERT IGNORE INTO journal_audit(id_audit,id_utilisateur,table_concernee,action_effectuee,date_action) VALUES
(1,(SELECT id_utilisateur FROM utilisateurs WHERE username='admin'),'utilisateurs','CREATE_USER','2026-01-08 09:00:00'),
(2,(SELECT id_utilisateur FROM utilisateurs WHERE username='rh.central'),'agents','UPDATE_DOSSIER','2026-07-10 08:45:00'),
(3,(SELECT id_utilisateur FROM utilisateurs WHERE username='chef.carrieres'),'presences','VALIDATE_PRESENCE','2026-07-15 17:10:00'),
(4,(SELECT id_utilisateur FROM utilisateurs WHERE username='rh.central'),'demandes_conges','APPROVE_LEAVE','2026-07-10 10:15:00'),
(5,(SELECT id_utilisateur FROM utilisateurs WHERE username='admin'),'role_permissions','UPDATE_ROLE','2026-07-11 13:20:00'),
(6,(SELECT id_utilisateur FROM utilisateurs WHERE username='rh.central'),'bulletins_paie','GENERATE_PAYROLL','2026-07-18 15:00:00');

-- Vérification : chaque table doit retourner un nombre strictement positif.
SELECT 'types_reference' table_name,COUNT(*) rows_count FROM types_reference UNION ALL
SELECT 'valeurs_reference',COUNT(*) FROM valeurs_reference UNION ALL SELECT 'roles',COUNT(*) FROM roles UNION ALL
SELECT 'permissions',COUNT(*) FROM permissions UNION ALL SELECT 'role_permissions',COUNT(*) FROM role_permissions UNION ALL
SELECT 'utilisateurs',COUNT(*) FROM utilisateurs UNION ALL SELECT 'utilisateur_roles',COUNT(*) FROM utilisateur_roles UNION ALL
SELECT 'ministeres',COUNT(*) FROM ministeres UNION ALL SELECT 'directions',COUNT(*) FROM directions UNION ALL
SELECT 'services',COUNT(*) FROM services UNION ALL SELECT 'bureaux',COUNT(*) FROM bureaux UNION ALL
SELECT 'categories',COUNT(*) FROM categories UNION ALL SELECT 'corps',COUNT(*) FROM corps UNION ALL
SELECT 'grades',COUNT(*) FROM grades UNION ALL SELECT 'echelles_salariales',COUNT(*) FROM echelles_salariales UNION ALL
SELECT 'postes',COUNT(*) FROM postes UNION ALL SELECT 'agents',COUNT(*) FROM agents UNION ALL
SELECT 'dossiers_agents',COUNT(*) FROM dossiers_agents UNION ALL SELECT 'contacts_urgence',COUNT(*) FROM contacts_urgence UNION ALL
SELECT 'documents_agents',COUNT(*) FROM documents_agents UNION ALL SELECT 'affectations',COUNT(*) FROM affectations UNION ALL
SELECT 'promotions',COUNT(*) FROM promotions UNION ALL SELECT 'mutations',COUNT(*) FROM mutations UNION ALL
SELECT 'sanctions',COUNT(*) FROM sanctions UNION ALL SELECT 'presences',COUNT(*) FROM presences UNION ALL
SELECT 'types_conges',COUNT(*) FROM types_conges UNION ALL SELECT 'demandes_conges',COUNT(*) FROM demandes_conges UNION ALL
SELECT 'campagnes_evaluation',COUNT(*) FROM campagnes_evaluation UNION ALL SELECT 'criteres_evaluation',COUNT(*) FROM criteres_evaluation UNION ALL
SELECT 'evaluations',COUNT(*) FROM evaluations UNION ALL SELECT 'notes_evaluation',COUNT(*) FROM notes_evaluation UNION ALL
SELECT 'formations',COUNT(*) FROM formations UNION ALL SELECT 'sessions_formation',COUNT(*) FROM sessions_formation UNION ALL
SELECT 'inscriptions_formations',COUNT(*) FROM inscriptions_formations UNION ALL SELECT 'competences',COUNT(*) FROM competences UNION ALL
SELECT 'agent_competences',COUNT(*) FROM agent_competences UNION ALL SELECT 'primes',COUNT(*) FROM primes UNION ALL
SELECT 'retenues',COUNT(*) FROM retenues UNION ALL SELECT 'bulletins_paie',COUNT(*) FROM bulletins_paie UNION ALL
SELECT 'notifications',COUNT(*) FROM notifications UNION ALL SELECT 'journal_audit',COUNT(*) FROM journal_audit;
