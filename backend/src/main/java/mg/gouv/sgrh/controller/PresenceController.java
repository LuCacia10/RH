package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.Presence;
import mg.gouv.sgrh.repository.PresenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import mg.gouv.sgrh.security.RbacScopeService;

@RestController
@RequestMapping("/api/presences")
public class PresenceController {

    @Autowired
    private PresenceRepository presenceRepository;
    @Autowired private RbacScopeService scope;

    @GetMapping
    @PreAuthorize("hasAuthority('PRESENCE_VIEW_SERVICE')")
    public List<Presence> getAllPresences(Authentication authentication) {
        var ids = scope.visibleAgentIds(authentication);
        return presenceRepository.findAll().stream().filter(item -> ids.contains(item.getAgentId())).toList();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PRESENCE_VALIDATE')")
    public Presence createPresence(@RequestBody Presence presence, Authentication authentication) {
        scope.requireAgent(authentication, presence.getAgentId());
        return presenceRepository.save(presence);
    }
}
