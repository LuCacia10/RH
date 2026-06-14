package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.model.BulletinPaie;
import mg.gouv.sgrh.repository.BulletinPaieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paie")
public class PaieController {

    @Autowired
    private BulletinPaieRepository bulletinPaieRepository;

    @GetMapping("/bulletins")
    public List<BulletinPaie> getAllBulletins() {
        return bulletinPaieRepository.findAll();
    }

    @PostMapping("/bulletins")
    public BulletinPaie createBulletin(@RequestBody BulletinPaie bulletin) {
        return bulletinPaieRepository.save(bulletin);
    }
}
