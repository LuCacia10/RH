package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.*;
import mg.gouv.sgrh.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import mg.gouv.sgrh.security.RbacScopeService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private mg.gouv.sgrh.service.AgentService agentService;
    @Autowired
    private MinistereRepository ministereRepository;
    @Autowired
    private PresenceRepository presenceRepository;
    @Autowired
    private DemandeCongeRepository demandeCongeRepository;
    @Autowired
    private BulletinPaieRepository bulletinPaieRepository;
    @Autowired
    private JournalAuditRepository journalAuditRepository;
    @Autowired private RbacScopeService scope;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyAuthority('DASHBOARD_NATIONAL','DASHBOARD_RH','DASHBOARD_SERVICE','DASHBOARD_PERSONAL')")
    public Map<String, Object> getDashboardStats(Authentication authentication) {
        Map<String, Object> stats = new HashMap<>();
        var ids = scope.visibleAgentIds(authentication);
        stats.put("agents", agentService.getAllAgents().stream().filter(agent -> ids.contains(agent.getId_agent())).toList());
        stats.put("ministeres", scope.has(authentication, "ORG_VIEW") ? ministereRepository.findAll() : java.util.List.of());
        stats.put("presences", presenceRepository.findAll().stream().filter(item -> ids.contains(item.getAgentId())).toList());
        stats.put("conges", demandeCongeRepository.findAll().stream().filter(item -> ids.contains(item.getAgentId())).toList());
        stats.put("bulletins", scope.hasRole(authentication, "RESPONSABLE_RH") && scope.has(authentication, "PAYROLL_VIEW") ? bulletinPaieRepository.findAll() : java.util.List.of());
        stats.put("audits", scope.has(authentication, "AUDIT_VIEW") ? journalAuditRepository.findAll() : java.util.List.of());
        return stats;
    }
}
