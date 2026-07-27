package mg.gouv.sgrh.controller;
import mg.gouv.sgrh.dto.*;
import mg.gouv.sgrh.model.Utilisateur;
import mg.gouv.sgrh.repository.UtilisateurRepository;
import mg.gouv.sgrh.security.JwtService;
import mg.gouv.sgrh.service.EmailOtpService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final AuthenticationManager authentication; private final UtilisateurRepository users; private final JwtService jwt; private final PasswordEncoder encoder; private final EmailOtpService otp;
 public AuthController(AuthenticationManager a,UtilisateurRepository u,JwtService j,PasswordEncoder e,EmailOtpService o){authentication=a;users=u;jwt=j;encoder=e;otp=o;}
 @PostMapping("/login") LoginChallengeResponse login(@RequestBody LoginRequest r){
  var authenticated=authentication.authenticate(new UsernamePasswordAuthenticationToken(r.getUsername(),r.getPassword()));
  Utilisateur u=user(authenticated.getName());
  return otp.create(u.getUsername(),u.getEmail());
 }
 @PostMapping("/verify-otp") AuthResponse verifyOtp(@RequestBody OtpVerificationRequest r){
  Utilisateur u=user(otp.verify(r.getChallengeId(),r.getCode())); Set<String> roles=roles(u); Set<String> permissions=permissions(u);
  return response(u,roles,permissions,jwt.generateToken(u.getUsername(),Map.of("roles",roles,"permissions",permissions)));
 }
 @GetMapping("/me") AuthResponse me(@AuthenticationPrincipal UserDetails p){
  if(p==null)throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); Utilisateur u=user(p.getUsername()); return response(u,roles(u),permissions(u),null);
 }
 @PostMapping("/change-password") void changePassword(@AuthenticationPrincipal UserDetails principal,@RequestBody ChangePasswordRequest request){
  if(principal==null)throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); Utilisateur u=user(principal.getUsername());
  if(!encoder.matches(request.getCurrentPassword(),u.getMot_de_passe()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mot de passe actuel incorrect");
  if(request.getNewPassword()==null||request.getNewPassword().length()<8)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Le nouveau mot de passe doit contenir au moins 8 caractères");
  u.setMot_de_passe(encoder.encode(request.getNewPassword()));users.save(u);
 }
 private Utilisateur user(String n){return users.findByUsername(n).or(()->users.findByEmailIgnoreCase(n)).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));}
 private Set<String> roles(Utilisateur u){return u.getRoles().stream().map(r->r.getCode()).collect(Collectors.toSet());}
 private Set<String> permissions(Utilisateur u){return u.getRoles().stream().flatMap(r->r.getPermissions().stream()).map(p->p.getCode()).collect(Collectors.toSet());}
 private AuthResponse response(Utilisateur u,Set<String> r,Set<String> p,String t){return new AuthResponse(t,u.getId_utilisateur(),u.getUsername(),u.getEmail(),r,p,u.getId_agent(),u.getId_service());}
}
