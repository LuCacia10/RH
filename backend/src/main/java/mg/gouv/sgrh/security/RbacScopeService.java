package mg.gouv.sgrh.security;

import mg.gouv.sgrh.dto.AgentDTO;
import mg.gouv.sgrh.model.Utilisateur;
import mg.gouv.sgrh.repository.UtilisateurRepository;
import mg.gouv.sgrh.service.AgentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RbacScopeService {
    private final UtilisateurRepository users;
    private final AgentService agents;
    public RbacScopeService(UtilisateurRepository users, AgentService agents) { this.users = users; this.agents = agents; }

    public Utilisateur user(Authentication authentication) {
        if (authentication == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return users.findByUsername(authentication.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
    public boolean has(Authentication authentication, String authority) {
        return authentication != null && authentication.getAuthorities().stream().anyMatch(item -> item.getAuthority().equals(authority));
    }
    public boolean hasRole(Authentication authentication, String role) {
        return has(authentication, "ROLE_" + role);
    }
    public Set<Long> visibleAgentIds(Authentication authentication) {
        if (has(authentication, "AGENT_VIEW_ALL") || has(authentication, "DASHBOARD_NATIONAL") || has(authentication, "DASHBOARD_RH") || has(authentication, "PAYROLL_VIEW"))
            return agents.getAllAgents().stream().map(AgentDTO::getId_agent).collect(Collectors.toSet());
        Utilisateur user = user(authentication);
        if (has(authentication, "AGENT_VIEW_SERVICE") || has(authentication, "PRESENCE_VIEW_SERVICE") || has(authentication, "LEAVE_APPROVE") || has(authentication, "LEAVE_MANAGE")) {
            if (user.getId_service() == null) return Set.of();
            return agents.getAllAgents().stream().filter(agent -> user.getId_service().equals(agent.getId_service())).map(AgentDTO::getId_agent).collect(Collectors.toSet());
        }
        return user.getId_agent() == null ? Set.of() : Set.of(user.getId_agent());
    }
    public void requireAgent(Authentication authentication, Long agentId) {
        if (agentId == null || !visibleAgentIds(authentication).contains(agentId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès hors de votre périmètre");
    }
}
