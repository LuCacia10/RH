package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "demandes_conges")
@Data
public class DemandeConge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_conge;

    @ManyToOne
    @JoinColumn(name = "id_agent")
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "id_type_conge")
    private TypeConge typeConge;

    private LocalDate date_debut;
    private LocalDate date_fin;

    @ManyToOne
    @JoinColumn(name = "id_statut_conge")
    private ValeurReference statutConge;
}
