package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "services")
@Data
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_service;

    @ManyToOne
    @JoinColumn(name = "id_direction", nullable = false)
    private Direction direction;

    @Column(length = 30)
    private String code;

    @Column(nullable = false, length = 255)
    private String nom;
}
