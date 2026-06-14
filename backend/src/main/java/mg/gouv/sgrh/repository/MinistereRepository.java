package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.Ministere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MinistereRepository extends JpaRepository<Ministere, Long> {
}
