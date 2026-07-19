package mg.gouv.sgrh.controller;
import mg.gouv.sgrh.dto.*;
import mg.gouv.sgrh.model.Utilisateur;
import mg.gouv.sgrh.repository.UtilisateurRepository;
import mg.gouv.sgrh.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthenticationManager authentication; private final UtilisateurRepository users; private final JwtService jwt;
 public AuthController(AuthenticationManager a,UtilisateurRepository u,JwtService j){authentication=a;users=u;jwt=j;}
 @PostMapping("/login") AuthResponse login(@RequestBody LoginRequest r){
  authentication.authenticate(new UsernamePasswordAuthenticationToken(r.getUsername(),r.getPassword()));
  Utilisateur u=user(r.getUsername()); Set<String> roles=roles(u);
  return response(u,roles,jwt.generateToken(u.getUsername(),Map.of("roles",roles)));
 }
 @GetMapping("/me") AuthResponse me(@AuthenticationPrincipal UserDetails p){
  if(p==null)throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); Utilisateur u=user(p.getUsername()); return response(u,roles(u),null);
 }
 private Utilisateur user(String n){return users.findByUsername(n).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));}
 private Set<String> roles(Utilisateur u){return u.getRoles().stream().map(r->r.getCode()).collect(Collectors.toSet());}
 private AuthResponse response(Utilisateur u,Set<String> r,String t){return new AuthResponse(t,u.getId_utilisateur(),u.getUsername(),u.getEmail(),r);}
}
