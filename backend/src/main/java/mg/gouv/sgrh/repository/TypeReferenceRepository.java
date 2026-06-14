package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.TypeReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeReferenceRepository extends JpaRepository<TypeReference, Long> {
}
