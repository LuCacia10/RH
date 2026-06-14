package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.BulletinPaie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BulletinPaieRepository extends JpaRepository<BulletinPaie, Long> {
}
