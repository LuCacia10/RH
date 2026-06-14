package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.DemandeConge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DemandeCongeRepository extends JpaRepository<DemandeConge, Long> {
}
