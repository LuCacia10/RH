package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.Agent;
import mg.gouv.sgrh.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private mg.gouv.sgrh.service.AgentService agentService;

    @GetMapping
    public List<mg.gouv.sgrh.dto.AgentDTO> getAllAgents() {
        return agentService.getAllAgents();
    }

    @PostMapping
    public Agent createAgent(@RequestBody Agent agent) {
        return agentRepository.save(agent);
    }

    @GetMapping("/{id}")
    public Agent getAgentById(@PathVariable Long id) {
        return agentRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Agent updateAgent(@PathVariable Long id, @RequestBody Agent agentDetails) {
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
    public void deleteAgent(@PathVariable Long id) {
        agentRepository.deleteById(id);
    }
}
