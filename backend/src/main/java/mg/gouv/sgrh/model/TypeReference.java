package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "types_reference")
@Data
public class TypeReference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_type_reference;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;
}
