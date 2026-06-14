package mg.gouv.sgrh.config;

import mg.gouv.sgrh.model.TypeReference;
import mg.gouv.sgrh.model.ValeurReference;
import mg.gouv.sgrh.repository.TypeReferenceRepository;
import mg.gouv.sgrh.repository.ValeurReferenceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

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
}
