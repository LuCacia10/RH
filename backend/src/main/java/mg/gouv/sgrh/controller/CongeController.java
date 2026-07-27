package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.DemandeConge;
import mg.gouv.sgrh.repository.DemandeCongeRepository;
import mg.gouv.sgrh.repository.ValeurReferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import mg.gouv.sgrh.security.RbacScopeService;

@RestController
@RequestMapping("/api/conges")
public class CongeController {

    @Autowired
    private DemandeCongeRepository demandeCongeRepository;
    @Autowired private RbacScopeService scope;
    @Autowired private ValeurReferenceRepository valeursReference;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('LEAVE_MANAGE','LEAVE_APPROVE','LEAVE_VIEW_SELF')")
    public List<DemandeConge> getAllConges(Authentication authentication) {
        var ids = scope.visibleAgentIds(authentication);
        return demandeCongeRepository.findAll().stream().filter(item -> ids.contains(item.getAgentId())).toList();
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('LEAVE_MANAGE','LEAVE_REQUEST')")
    public DemandeConge createDemande(@RequestBody DemandeConge demande, Authentication authentication) {
        demande.setId_conge(null);
        if (scope.has(authentication, "LEAVE_REQUEST") && !scope.has(authentication, "LEAVE_MANAGE")) demande.setAgentId(scope.user(authentication).getId_agent());
        scope.requireAgent(authentication, demande.getAgentId());
        demande.setStatutConge(valeursReference.findFirstByCodeAndTypeReference_Code("ATTENTE", "STATUT_CONGE")
            .orElseThrow(() -> new IllegalStateException("Le statut de congé ATTENTE est absent des références")));
        return demandeCongeRepository.save(demande);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESPONSABLE_RH') and hasAuthority('LEAVE_APPROVE')")
    public DemandeConge updateDemande(@PathVariable Long id, @RequestBody DemandeConge details, Authentication authentication) {
        return demandeCongeRepository.findById(id).map(d -> {
            scope.requireAgent(authentication, d.getAgentId());
            d.setStatutConge(details.getStatutConge());
            return demandeCongeRepository.save(d);
        }).orElse(null);
    }
}
