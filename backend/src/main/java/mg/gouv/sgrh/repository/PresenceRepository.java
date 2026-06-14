package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.Presence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Long> {
}
