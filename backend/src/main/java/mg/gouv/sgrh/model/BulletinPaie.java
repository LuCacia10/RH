package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "bulletins_paie")
@Data
public class BulletinPaie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_bulletin;

    @ManyToOne
    @JoinColumn(name = "id_agent")
    private Agent agent;

    private Integer mois;
    
    @Column(columnDefinition = "YEAR")
    private Integer annee;
    private BigDecimal salaire_base;
    private BigDecimal salaire_net;
}
