package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.dto.LeaveBeneficiaryResponse;
import mg.gouv.sgrh.repository.AgentRepository;
import mg.gouv.sgrh.repository.UtilisateurRepository;
import mg.gouv.sgrh.security.RbacScopeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/directory")
public class UserDirectoryController {
    private final UtilisateurRepository users;
    private final AgentRepository agents;
    private final RbacScopeService scope;
    public UserDirectoryController(UtilisateurRepository users, AgentRepository agents, RbacScopeService scope) {
        this.users = users; this.agents = agents; this.scope = scope;
    }

    @GetMapping("/leave-beneficiaries")
    @PreAuthorize("hasAnyAuthority('LEAVE_MANAGE','LEAVE_APPROVE','LEAVE_REQUEST')")
    public List<LeaveBeneficiaryResponse> leaveBeneficiaries(Authentication authentication) {
        var visibleIds = scope.visibleAgentIds(authentication);
        return users.findAll().stream()
            .filter(user -> Boolean.TRUE.equals(user.getActif()) && user.getId_agent() != null && visibleIds.contains(user.getId_agent()))
            .map(user -> agents.findById(user.getId_agent()).map(agent -> new LeaveBeneficiaryResponse(
                user.getId_utilisateur(), user.getUsername(), user.getEmail(), agent.getId_agent(), agent.getMatricule(),
                (agent.getNom() + " " + (agent.getPrenom() == null ? "" : agent.getPrenom())).trim()
            )).orElse(null)).filter(java.util.Objects::nonNull).toList();
    }
}
