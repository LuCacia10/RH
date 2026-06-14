package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.ValeurReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ValeurReferenceRepository extends JpaRepository<ValeurReference, Long> {
}
