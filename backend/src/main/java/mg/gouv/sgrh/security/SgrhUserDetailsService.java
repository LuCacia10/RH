package mg.gouv.sgrh.security;
import mg.gouv.sgrh.model.Utilisateur;
import mg.gouv.sgrh.repository.UtilisateurRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
@Service
public class SgrhUserDetailsService implements UserDetailsService {
    private final UtilisateurRepository utilisateurs;
    public SgrhUserDetailsService(UtilisateurRepository utilisateurs) { this.utilisateurs=utilisateurs; }
    public UserDetails loadUserByUsername(String username) {
        Utilisateur u=utilisateurs.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("Utilisateur introuvable"));
        return User.withUsername(u.getUsername()).password(u.getMot_de_passe()).disabled(!Boolean.TRUE.equals(u.getActif()))
            .authorities(u.getRoles().stream().map(r->new SimpleGrantedAuthority("ROLE_"+r.getCode())).toList()).build();
    }
}
