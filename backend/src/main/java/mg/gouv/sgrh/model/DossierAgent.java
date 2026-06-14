package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "dossiers_agents")
@Data
public class DossierAgent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_dossier;

    @OneToOne
    @JoinColumn(name = "id_agent", unique = true)
    private Agent agent;

    private LocalDate date_ouverture;

    @Column(columnDefinition = "TEXT")
    private String observations;
}
