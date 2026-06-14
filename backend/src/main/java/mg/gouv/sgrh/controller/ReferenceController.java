package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.ValeurReference;
import mg.gouv.sgrh.model.TypeReference;
import mg.gouv.sgrh.repository.ValeurReferenceRepository;
import mg.gouv.sgrh.repository.TypeReferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/references")
public class ReferenceController {

    @Autowired
    private ValeurReferenceRepository valeurReferenceRepository;
    
    @Autowired
    private TypeReferenceRepository typeReferenceRepository;

    @GetMapping("/valeurs")
    public List<ValeurReference> getAllValeurs() {
        return valeurReferenceRepository.findAll();
    }

    @GetMapping("/types")
    public List<TypeReference> getAllTypes() {
        return typeReferenceRepository.findAll();
    }
}
