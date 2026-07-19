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
import mg.gouv.sgrh.model.TypeConge;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
    CommandLineRunner initAdmin(RoleRepository roles, UtilisateurRepository users) {
        return args -> {
            Role role = roles.findByCode("ADMIN").orElseGet(() -> {
                Role value = new Role(); value.setCode("ADMIN"); value.setNom("Administrateur SGRH"); return roles.save(value);
            });
            Utilisateur user = users.findByUsername(adminUsername).orElseGet(Utilisateur::new);
            user.setUsername(adminUsername); user.setEmail(adminEmail); user.setMot_de_passe(adminPassword);
            user.setActif(true); if (user.getDate_creation() == null) user.setDate_creation(LocalDateTime.now());
            user.setRoles(Set.of(role)); users.save(user);
        };
    }

    @Bean
    CommandLineRunner initMobileReferences(TypeReferenceRepository types, ValeurReferenceRepository values,
                                           TypeCongeRepository conges) {
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
        };
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
