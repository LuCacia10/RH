package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ministeres")
@Data
public class Ministere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_ministere;

    @Column(unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 255)
    private String nom;
}
