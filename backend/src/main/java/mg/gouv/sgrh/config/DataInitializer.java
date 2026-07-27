package mg.gouv.sgrh.config;

import mg.gouv.sgrh.model.TypeReference;
import mg.gouv.sgrh.model.ValeurReference;
import mg.gouv.sgrh.repository.TypeReferenceRepository;
import mg.gouv.sgrh.repository.ValeurReferenceRepository;
import mg.gouv.sgrh.model.Role;
import mg.gouv.sgrh.model.Utilisateur;
import mg.gouv.sgrh.repository.RoleRepository;
import mg.gouv.sgrh.repository.UtilisateurRepository;
import mg.gouv.sgrh.repository.TypeCongeRepository;
import mg.gouv.sgrh.repository.PermissionRepository;
import mg.gouv.sgrh.repository.AgentRepository;
import mg.gouv.sgrh.model.Permission;
import mg.gouv.sgrh.model.Agent;
import mg.gouv.sgrh.model.TypeConge;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Set;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.HashSet;
import java.util.stream.Collectors;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class DataInitializer {
    @Value("${app.admin.username}") private String adminUsername;
    @Value("${app.admin.password}") private String adminPassword;
    @Value("${app.admin.email}") private String adminEmail;

    @Bean
    CommandLineRunner initDatabase(TypeReferenceRepository typeRepo, ValeurReferenceRepository valRepo) {
        return args -> {
            if (typeRepo.count() == 0) {
                // Simplified seeding for demo
                TypeReference sexe = new TypeReference();
                sexe.setCode("SEXE");
                sexe.setLibelle("Genre");
                typeRepo.save(sexe);

                ValeurReference homme = new ValeurReference();
                homme.setTypeReference(sexe);
                homme.setCode("H");
                homme.setLibelle("Homme");
                homme.setActif(true);
                valRepo.save(homme);
                
                ValeurReference femme = new ValeurReference();
                femme.setTypeReference(sexe);
                femme.setCode("F");
                femme.setLibelle("Femme");
                femme.setActif(true);
                valRepo.save(femme);
                
                System.out.println("Base de données initialisée avec les références par défaut.");
            }
        };
    }

    @Bean
    @Order(1)
    CommandLineRunner initRbac(RoleRepository roles, PermissionRepository permissions, UtilisateurRepository users,
                               PasswordEncoder encoder) {
        return args -> {
            Map<String, String> definitions = new LinkedHashMap<>();
            definitions.put("DASHBOARD_NATIONAL", "Tableau de bord national"); definitions.put("DASHBOARD_RH", "Tableau de bord RH");
            definitions.put("DASHBOARD_SERVICE", "Tableau de bord du service"); definitions.put("DASHBOARD_PERSONAL", "Tableau de bord personnel");
            definitions.put("USER_MANAGE", "Gérer les utilisateurs"); definitions.put("ROLE_MANAGE", "Gérer les rôles");
            definitions.put("PERMISSION_MANAGE", "Gérer les permissions"); definitions.put("SYSTEM_MANAGE", "Gérer les paramètres système");
            definitions.put("BACKUP_MANAGE", "Gérer les sauvegardes"); definitions.put("AUDIT_VIEW", "Consulter le journal d'audit");
            definitions.put("REPORT_NATIONAL", "Générer les rapports nationaux"); definitions.put("REPORT_ADMIN", "Générer les rapports administratifs");
            definitions.put("STATS_RH", "Consulter les statistiques RH"); definitions.put("ORG_VIEW", "Consulter l'organisation");
            definitions.put("ORG_MANAGE", "Gérer l'organisation administrative"); definitions.put("REFERENCE_VIEW", "Consulter les référentiels");
            definitions.put("AGENT_VIEW_ALL", "Consulter tous les agents"); definitions.put("AGENT_VIEW_SERVICE", "Consulter les agents de son service");
            definitions.put("AGENT_VIEW_SELF", "Consulter son dossier personnel"); definitions.put("AGENT_MANAGE", "Gérer les dossiers agents");
            definitions.put("AGENT_DELETE", "Supprimer un agent"); definitions.put("AGENT_SELF_EDIT", "Modifier ses informations personnelles");
            definitions.put("CAREER_MANAGE", "Gérer les carrières et affectations"); definitions.put("CAREER_VIEW_SELF", "Consulter sa carrière");
            definitions.put("LEAVE_MANAGE", "Gérer les congés"); definitions.put("LEAVE_APPROVE", "Approuver ou refuser les congés");
            definitions.put("LEAVE_REQUEST", "Demander un congé"); definitions.put("LEAVE_VIEW_SELF", "Consulter ses congés");
            definitions.put("PRESENCE_VALIDATE", "Valider les présences"); definitions.put("PRESENCE_VIEW_SERVICE", "Consulter les présences du service");
            definitions.put("EVALUATION_MANAGE", "Gérer les évaluations"); definitions.put("EVALUATION_SERVICE", "Évaluer les agents du service");
            definitions.put("TRAINING_MANAGE", "Gérer les formations"); definitions.put("SANCTION_MANAGE", "Gérer les sanctions");
            definitions.put("REWARD_MANAGE", "Gérer les récompenses"); definitions.put("PAYROLL_VIEW", "Consulter la paie");
            definitions.put("PAYROLL_MANAGE", "Gérer la paie"); definitions.put("DOCUMENT_SELF_DOWNLOAD", "Télécharger ses documents");
            definitions.put("NOTIFICATION_VIEW", "Consulter les notifications"); definitions.put("PASSWORD_CHANGE", "Modifier son mot de passe");

            Map<String, Permission> saved = definitions.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, entry ->
                permissions.findByCode(entry.getKey()).orElseGet(() -> { Permission p = new Permission(); p.setCode(entry.getKey()); p.setNom(entry.getValue()); return permissions.save(p); })
            ));
            Set<String> operationalRhPermissions = Set.of(
                "AGENT_VIEW_ALL", "AGENT_VIEW_SERVICE", "AGENT_VIEW_SELF", "AGENT_MANAGE", "AGENT_DELETE", "AGENT_SELF_EDIT",
                "LEAVE_MANAGE", "LEAVE_APPROVE", "LEAVE_REQUEST", "LEAVE_VIEW_SELF",
                "PAYROLL_VIEW", "PAYROLL_MANAGE"
            );
            Role admin = role(roles, "ADMIN_CENTRAL", "Administrateur Central RH", saved.entrySet().stream()
                .filter(entry -> !operationalRhPermissions.contains(entry.getKey()))
                .map(Map.Entry::getValue).collect(Collectors.toSet()));
            role(roles, "RESPONSABLE_RH", "Responsable RH", permissionSet(saved,
                "DASHBOARD_RH","STATS_RH","REPORT_ADMIN","ORG_VIEW","REFERENCE_VIEW","AGENT_VIEW_ALL","AGENT_MANAGE","CAREER_MANAGE",
                "LEAVE_APPROVE","PRESENCE_VIEW_SERVICE","EVALUATION_MANAGE","TRAINING_MANAGE","SANCTION_MANAGE","REWARD_MANAGE","PAYROLL_VIEW","PAYROLL_MANAGE","AUDIT_VIEW"));
            role(roles, "CHEF_SERVICE", "Chef de Service", permissionSet(saved,
                "DASHBOARD_SERVICE","AGENT_VIEW_SERVICE","LEAVE_MANAGE","PRESENCE_VALIDATE","PRESENCE_VIEW_SERVICE","EVALUATION_SERVICE","STATS_RH","NOTIFICATION_VIEW","REFERENCE_VIEW"));
            role(roles, "AGENT_PUBLIC", "Agent Public", permissionSet(saved,
                "DASHBOARD_PERSONAL","AGENT_VIEW_SELF","AGENT_SELF_EDIT","CAREER_VIEW_SELF","LEAVE_REQUEST","LEAVE_VIEW_SELF","DOCUMENT_SELF_DOWNLOAD","NOTIFICATION_VIEW","PASSWORD_CHANGE","REFERENCE_VIEW"));

            Utilisateur user = users.findByUsername(adminUsername).orElseGet(Utilisateur::new);
            boolean newAdmin = user.getId_utilisateur() == null;
            user.setUsername(adminUsername); user.setEmail(adminEmail);
            if (user.getMot_de_passe() == null || user.getMot_de_passe().isBlank()) user.setMot_de_passe(encoder.encode(adminPassword));
            user.setActif(true); if (user.getDate_creation() == null) user.setDate_creation(LocalDateTime.now());
            if (newAdmin || user.getRoles() == null || user.getRoles().isEmpty()) user.setRoles(new HashSet<>(Set.of(admin)));
            users.save(user);
        };
    }

    private Role role(RoleRepository repository, String code, String name, Set<Permission> permissions) {
        Role role = repository.findByCode(code).orElseGet(Role::new); boolean newRole = role.getId_role() == null;
        role.setCode(code); role.setNom(name);
        role.setPermissions(new HashSet<>(permissions));
        return repository.save(role);
    }
    private Set<Permission> permissionSet(Map<String, Permission> permissions, String... codes) {
        return java.util.Arrays.stream(codes).map(permissions::get).collect(Collectors.toSet());
    }

    @Bean
    @Order(2)
    CommandLineRunner initMobileReferences(TypeReferenceRepository types, ValeurReferenceRepository values,
                                           TypeCongeRepository conges, AgentRepository agents, UtilisateurRepository users,
                                           RoleRepository roles, PasswordEncoder encoder) {
        return args -> {
            TypeReference sexe = type(types, 1L, "SEXE", "Genre");
            TypeReference statutAgent = type(types, 2L, "STATUT_AGENT", "Statut agent");
            TypeReference presence = type(types, 3L, "STATUT_PRESENCE", "Statut présence");
            TypeReference conge = type(types, 4L, "STATUT_CONGE", "Statut congé");
            value(values, 101L, sexe, "H", "Homme"); value(values, 102L, sexe, "F", "Femme");
            value(values, 201L, statutAgent, "TITULAIRE", "Fonctionnaire titulaire");
            value(values, 202L, statutAgent, "STAGIAIRE", "Stagiaire");
            value(values, 203L, statutAgent, "CONTRACTUEL", "Contractuel");
            value(values, 301L, presence, "PRESENT", "Présent"); value(values, 302L, presence, "RETARD", "En retard");
            value(values, 303L, presence, "ABSENT_N_J", "Absent non justifié"); value(values, 304L, presence, "ABSENT_J", "Absent justifié");
            value(values, 401L, conge, "ATTENTE", "En attente"); value(values, 402L, conge, "VALIDE", "Validé");
            value(values, 403L, conge, "REJETE", "Rejeté");
            if (conges.findById(1L).isEmpty()) {
                TypeConge annuel = new TypeConge(); annuel.setId_type_conge(1L); annuel.setCode("ANNUEL");
                annuel.setLibelle("Congé annuel"); annuel.setNb_jours(30); conges.save(annuel);
            }
            ValeurReference homme = values.findById(101L).orElse(null), femme = values.findById(102L).orElse(null);
            ValeurReference titulaire = values.findById(201L).orElse(null), contractuel = values.findById(203L).orElse(null);
            Role agentRole = roles.findByCode("AGENT_PUBLIC").orElseThrow();
            Agent andry = seedAgent(agents, "FN-729103", "RABEMANANJARA", "Andry", "Antananarivo", "+261 34 56 123 45", "andry.rabemananjara@fonctionpublique.gov.mg", LocalDate.of(2008,1,15), homme, titulaire);
            Agent feno = seedAgent(agents, "FN-108293", "RAKOTOMALALA", "Feno", "Fianarantsoa", "+261 32 44 231 09", "feno.rakotomalala@sante.gov.mg", LocalDate.of(2012,4,10), femme, titulaire);
            Agent harijaona = seedAgent(agents, "FN-910482", "ANDRIANARIVO", "Harijaona", "Toamasina", "+261 33 15 888 77", "harijaona.andrianarivo@education.gov.mg", LocalDate.of(2018,10,1), homme, titulaire);
            Agent hasina = seedAgent(agents, "FN-382910", "RAZAFINDRAKOTO", "Hasina", "Mahajanga", "+261 34 89 777 55", "hasina.razafindrakoto@numerique.gov.mg", LocalDate.of(2021,3,1), femme, contractuel);
            seedAgentUser(users, encoder, agentRole, "andry.rabemananjara", andry);
            seedAgentUser(users, encoder, agentRole, "feno.rakotomalala", feno);
            seedAgentUser(users, encoder, agentRole, "harijaona.andrianarivo", harijaona);
            seedAgentUser(users, encoder, agentRole, "hasina.razafindrakoto", hasina);
        };
    }

    private Agent seedAgent(AgentRepository repository, String matricule, String nom, String prenom, String lieu,
                           String telephone, String email, LocalDate recrutement, ValeurReference sexe, ValeurReference statut) {
        var existing = repository.findByMatricule(matricule); if (existing.isPresent()) return existing.get();
        Agent agent = new Agent(); agent.setMatricule(matricule); agent.setNom(nom); agent.setPrenom(prenom);
        agent.setLieu_naissance(lieu); agent.setTelephone(telephone); agent.setEmail(email); agent.setDate_recrutement(recrutement);
        agent.setSexe(sexe); agent.setStatutAgent(statut); return repository.save(agent);
    }

    private void seedAgentUser(UtilisateurRepository repository, PasswordEncoder encoder, Role role, String username, Agent agent) {
        if (repository.findByUsername(username).isPresent()) return;
        Utilisateur user = new Utilisateur(); user.setUsername(username); user.setEmail(agent.getEmail());
        user.setMot_de_passe(encoder.encode("Demo@2026")); user.setActif(true);
        user.setDate_creation(LocalDateTime.now()); user.setId_agent(agent.getId_agent()); user.setRoles(Set.of(role)); repository.save(user);
    }

    private TypeReference type(TypeReferenceRepository repository, Long id, String code, String label) {
        return repository.findById(id).orElseGet(() -> { TypeReference value = new TypeReference();
            value.setId_type_reference(id); value.setCode(code); value.setLibelle(label); return repository.save(value); });
    }
    private void value(ValeurReferenceRepository repository, Long id, TypeReference type, String code, String label) {
        boolean exists = repository.findAll().stream().anyMatch(value -> value.getTypeReference() != null
                && value.getTypeReference().getId_type_reference().equals(type.getId_type_reference())
                && value.getCode().equals(code));
        if (!exists && repository.findById(id).isEmpty()) { ValeurReference value = new ValeurReference(); value.setId_valeur_reference(id);
            value.setTypeReference(type); value.setCode(code); value.setLibelle(label); value.setActif(true); repository.save(value); }
    }
}
