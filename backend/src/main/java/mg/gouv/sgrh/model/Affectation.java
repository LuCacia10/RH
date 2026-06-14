package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "affectations")
@Data
public class Affectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_affectation;

    @ManyToOne
    @JoinColumn(name = "id_agent")
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "id_poste")
    private Poste poste;

    @ManyToOne
    @JoinColumn(name = "id_service")
    private Service service;

    private LocalDate date_debut;
    private LocalDate date_fin;
}
