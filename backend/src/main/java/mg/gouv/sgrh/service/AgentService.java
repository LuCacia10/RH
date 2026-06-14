package mg.gouv.sgrh.service;

import mg.gouv.sgrh.dto.AgentDTO;
import mg.gouv.sgrh.model.Agent;
import mg.gouv.sgrh.model.Affectation;
import mg.gouv.sgrh.repository.AgentRepository;
import mg.gouv.sgrh.repository.AffectationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentService {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private AffectationRepository affectationRepository;

    public List<AgentDTO> getAllAgents() {
        return agentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AgentDTO convertToDTO(Agent agent) {
        AgentDTO dto = new AgentDTO();
        dto.setId_agent(agent.getId_agent());
        dto.setMatricule(agent.getMatricule());
        dto.setNom(agent.getNom());
        dto.setPrenom(agent.getPrenom());
        dto.setDate_naissance(agent.getDate_naissance());
        dto.setLieu_naissance(agent.getLieu_naissance());
        dto.setAdresse(agent.getAdresse());
        dto.setTelephone(agent.getTelephone());
        dto.setEmail(agent.getEmail());
        dto.setId_sexe(agent.getSexe() != null ? agent.getSexe().getId_valeur_reference() : null);
        dto.setId_statut_agent(agent.getStatutAgent() != null ? agent.getStatutAgent().getId_valeur_reference() : null);
        dto.setDate_recrutement(agent.getDate_recrutement());
        dto.setId_grade(agent.getGrade() != null ? agent.getGrade().getId_grade() : null);

        // Fetch hierarchy from current affectation
        affectationRepository.findCurrentAffectationByAgentId(agent.getId_agent()).ifPresent(aff -> {
            if (aff.getPoste() != null) dto.setId_poste(aff.getPoste().getId_poste());
            if (aff.getService() != null) {
                dto.setId_service(aff.getService().getId_service());
                if (aff.getService().getDirection() != null) {
                    dto.setId_direction(aff.getService().getDirection().getId_direction());
                    if (aff.getService().getDirection().getMinistere() != null) {
                        dto.setId_ministere(aff.getService().getDirection().getMinistere().getId_ministere());
                    }
                }
            }
        });

        return dto;
    }
}
