package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.*;
import mg.gouv.sgrh.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("agents", agentService.getAllAgents());
        stats.put("ministeres", ministereRepository.findAll());
        stats.put("presences", presenceRepository.findAll());
        stats.put("conges", demandeCongeRepository.findAll());
        stats.put("bulletins", bulletinPaieRepository.findAll());
        stats.put("audits", journalAuditRepository.findAll());
        return stats;
    }
}
