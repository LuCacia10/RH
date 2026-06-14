package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "roles")
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_role;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String nom;
}
