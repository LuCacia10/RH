package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.Agent;
import mg.gouv.sgrh.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import mg.gouv.sgrh.security.RbacScopeService;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private mg.gouv.sgrh.service.AgentService agentService;
    @Autowired private RbacScopeService scope;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('AGENT_VIEW_ALL','AGENT_VIEW_SERVICE','AGENT_VIEW_SELF')")
    public List<mg.gouv.sgrh.dto.AgentDTO> getAllAgents(Authentication authentication) {
        var ids = scope.visibleAgentIds(authentication);
        return agentService.getAllAgents().stream().filter(agent -> ids.contains(agent.getId_agent())).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('RESPONSABLE_RH') and hasAuthority('AGENT_MANAGE')")
    public Agent createAgent(@RequestBody Agent agent) {
        return agentRepository.save(agent);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('AGENT_VIEW_ALL','AGENT_VIEW_SERVICE','AGENT_VIEW_SELF')")
    public Agent getAgentById(@PathVariable Long id, Authentication authentication) {
        scope.requireAgent(authentication, id);
        return agentRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('AGENT_MANAGE','AGENT_SELF_EDIT')")
    public Agent updateAgent(@PathVariable Long id, @RequestBody Agent agentDetails, Authentication authentication) {
        scope.requireAgent(authentication, id);
        Agent agent = agentRepository.findById(id).orElse(null);
        if (agent != null) {
            agent.setNom(agentDetails.getNom());
            agent.setPrenom(agentDetails.getPrenom());
            agent.setEmail(agentDetails.getEmail());
            agent.setTelephone(agentDetails.getTelephone());
            agent.setAdresse(agentDetails.getAdresse());
            return agentRepository.save(agent);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('AGENT_DELETE')")
    public void deleteAgent(@PathVariable Long id) {
        agentRepository.deleteById(id);
    }
}
