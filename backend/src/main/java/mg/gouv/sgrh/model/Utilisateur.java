package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "utilisateurs")
@Data
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_utilisateur;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @Column(unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    @JsonIgnore
    private String mot_de_passe;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean actif;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime date_creation;

    @ManyToMany
    @JoinTable(
        name = "utilisateur_roles",
        joinColumns = @JoinColumn(name = "id_utilisateur"),
        inverseJoinColumns = @JoinColumn(name = "id_role")
    )
    private Set<Role> roles;

    @Column(name = "id_agent")
    private Long id_agent;

    @Column(name = "id_service")
    private Long id_service;
}
