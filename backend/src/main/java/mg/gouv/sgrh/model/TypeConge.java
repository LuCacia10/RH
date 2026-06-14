package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "types_conges")
@Data
public class TypeConge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_type_conge;

    @Column(length = 20)
    private String code;

    @Column(length = 100)
    private String libelle;

    private Integer nb_jours;
}
