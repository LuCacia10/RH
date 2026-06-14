package mg.gouv.sgrh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "journal_audit")
@Data
public class JournalAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_audit;

    private Long id_utilisateur; // We can link to Utilisateur later

    @Column(length = 100)
    private String table_concernee;

    @Column(length = 50)
    private String action_effectuee;

    private LocalDateTime date_action;
}
