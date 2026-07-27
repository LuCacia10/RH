package mg.gouv.sgrh.repository;

import mg.gouv.sgrh.model.Utilisateur;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    Optional<Utilisateur> findByUsername(String username);

    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    Optional<Utilisateur> findByEmailIgnoreCase(String email);

    @Override
    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    java.util.List<Utilisateur> findAll();
}
