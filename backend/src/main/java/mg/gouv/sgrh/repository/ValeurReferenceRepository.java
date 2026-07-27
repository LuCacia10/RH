package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.ValeurReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ValeurReferenceRepository extends JpaRepository<ValeurReference, Long> {
    Optional<ValeurReference> findFirstByCodeAndTypeReference_Code(String code, String typeCode);
}
