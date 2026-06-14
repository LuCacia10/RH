package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "valeurs_reference")
@Data
public class ValeurReference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_valeur_reference;

    @ManyToOne
    @JoinColumn(name = "id_type_reference", nullable = false)
    private TypeReference typeReference;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean actif;
}
