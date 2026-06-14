package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class Categorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_categorie;

    @Column(length = 20)
    private String code;

    @Column(length = 100)
    private String libelle;
}
