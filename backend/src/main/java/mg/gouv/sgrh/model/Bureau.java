package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bureaux")
@Data
public class Bureau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_bureau;

    @ManyToOne
    @JoinColumn(name = "id_service", nullable = false)
    private Service service;

    @Column(nullable = false, length = 255)
    private String nom;
}
