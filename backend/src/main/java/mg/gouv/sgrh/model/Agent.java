package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "agents")
@Data
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_agent;

    @Column(unique = true, nullable = false, length = 50)
    private String matricule;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 100)
    private String prenom;

    private LocalDate date_naissance;

    @Column(length = 150)
    private String lieu_naissance;

    @Column(columnDefinition = "TEXT")
    private String adresse;

    @Column(length = 30)
    private String telephone;

    @Column(length = 150)
    private String email;

    @ManyToOne
    @JoinColumn(name = "id_sexe")
    private ValeurReference sexe;

    @ManyToOne
    @JoinColumn(name = "id_statut_agent")
    private ValeurReference statutAgent;

    private LocalDate date_recrutement;

    @ManyToOne
    @JoinColumn(name = "id_grade")
    private Grade grade;
}
