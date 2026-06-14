package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "postes")
@Data
public class Poste {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_poste;

    @Column(length = 30)
    private String code;

    @Column(nullable = false, length = 200)
    private String intitule;

    @Column(columnDefinition = "TEXT")
    private String description;
}
