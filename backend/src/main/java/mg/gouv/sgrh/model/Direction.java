package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "directions")
@Data
public class Direction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_direction;

    @ManyToOne
    @JoinColumn(name = "id_ministere", nullable = false)
    private Ministere ministere;

    @Column(length = 30)
    private String code;

    @Column(nullable = false, length = 255)
    private String nom;
}
