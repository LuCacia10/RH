package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.JournalAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalAuditRepository extends JpaRepository<JournalAudit, Long> {
}
