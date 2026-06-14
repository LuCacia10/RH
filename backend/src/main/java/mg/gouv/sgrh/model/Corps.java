package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "corps")
@Data
public class Corps {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_corps;

    @Column(length = 20)
    private String code;

    @Column(length = 150)
    private String libelle;
}
