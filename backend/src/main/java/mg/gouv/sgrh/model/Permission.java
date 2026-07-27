package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "permissions")
@Data
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_permission;

    @Column(unique = true, nullable = false, length = 100)
    private String code;

    @Column(nullable = false, length = 150)
    private String nom;
}
