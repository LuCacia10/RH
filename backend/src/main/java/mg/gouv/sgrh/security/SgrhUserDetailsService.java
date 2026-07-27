package mg.gouv.sgrh.security;
import mg.gouv.sgrh.model.Utilisateur;
import mg.gouv.sgrh.repository.UtilisateurRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.stream.Stream;
@Service
public class SgrhUserDetailsService implements UserDetailsService {
    private final UtilisateurRepository utilisateurs;
    public SgrhUserDetailsService(UtilisateurRepository utilisateurs) { this.utilisateurs=utilisateurs; }
    public UserDetails loadUserByUsername(String identifier) {
        Utilisateur u=utilisateurs.findByUsername(identifier)
            .or(()->utilisateurs.findByEmailIgnoreCase(identifier))
            .orElseThrow(()->new UsernameNotFoundException("Utilisateur introuvable"));
        var roleAuthorities = u.getRoles().stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r.getCode()));
        var permissionAuthorities = u.getRoles().stream().flatMap(r -> r.getPermissions().stream())
            .map(p -> new SimpleGrantedAuthority(p.getCode()));
        return User.withUsername(u.getUsername()).password(u.getMot_de_passe()).disabled(!Boolean.TRUE.equals(u.getActif()))
            .authorities(Stream.concat(roleAuthorities, permissionAuthorities).distinct().toList()).build();
    }
}
