package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, Long> {
    
    @Query("SELECT a FROM Affectation a WHERE a.agent.id_agent = :agentId AND a.date_fin IS NULL ORDER BY a.date_debut DESC")
    Optional<Affectation> findCurrentAffectationByAgentId(@Param("agentId") Long agentId);
}
