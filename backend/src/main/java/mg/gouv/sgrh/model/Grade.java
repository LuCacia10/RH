package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "grades")
@Data
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_grade;

    @ManyToOne
    @JoinColumn(name = "id_corps")
    private Corps corps;

    @ManyToOne
    @JoinColumn(name = "id_categorie")
    private Categorie categorie;

    @Column(length = 20)
    private String code;

    @Column(length = 150)
    private String libelle;
}
