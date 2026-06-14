package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.DemandeConge;
import mg.gouv.sgrh.repository.DemandeCongeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conges")
public class CongeController {

    @Autowired
    private DemandeCongeRepository demandeCongeRepository;

    @GetMapping
    public List<DemandeConge> getAllConges() {
        return demandeCongeRepository.findAll();
    }

    @PostMapping
    public DemandeConge createDemande(@RequestBody DemandeConge demande) {
        return demandeCongeRepository.save(demande);
    }
    
    @PutMapping("/{id}")
    public DemandeConge updateDemande(@PathVariable Long id, @RequestBody DemandeConge details) {
        return demandeCongeRepository.findById(id).map(d -> {
            d.setStatutConge(details.getStatutConge());
            return demandeCongeRepository.save(d);
        }).orElse(null);
    }
}
