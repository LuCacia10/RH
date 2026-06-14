package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.Presence;
import mg.gouv.sgrh.repository.PresenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presences")
public class PresenceController {

    @Autowired
    private PresenceRepository presenceRepository;

    @GetMapping
    public List<Presence> getAllPresences() {
        return presenceRepository.findAll();
    }

    @PostMapping
    public Presence createPresence(@RequestBody Presence presence) {
        return presenceRepository.save(presence);
    }
}
