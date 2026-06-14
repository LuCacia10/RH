package mg.gouv.sgrh.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AgentDTO {
    private Long id_agent;
    private String matricule;
    private String nom;
    private String prenom;
    private LocalDate date_naissance;
    private String lieu_naissance;
    private String adresse;
    private String telephone;
    private String email;
    private Long id_sexe;
    private Long id_statut_agent;
    private LocalDate date_recrutement;
    private Long id_grade;
    
    // Flattened hierarchy fields expected by the frontend
    private Long id_ministere;
    private Long id_direction;
    private Long id_service;
    private Long id_poste;
}
