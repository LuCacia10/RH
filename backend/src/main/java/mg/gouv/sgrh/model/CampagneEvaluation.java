package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "campagnes_evaluation")
@Data
public class CampagneEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_campagne;

    @Column(columnDefinition = "YEAR")
    private Integer annee;

    @Column(length = 150)
    private String libelle;
}
