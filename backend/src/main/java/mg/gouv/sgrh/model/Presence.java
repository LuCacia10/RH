package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "presences")
@Data
public class Presence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_presence;

    @ManyToOne
    @JoinColumn(name = "id_agent")
    private Agent agent;

    private LocalDate date_presence;
    private LocalTime heure_arrivee;
    private LocalTime heure_depart;

    @ManyToOne
    @JoinColumn(name = "id_statut_presence")
    private ValeurReference statutPresence;
}
