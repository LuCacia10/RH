package mg.gouv.sgrh.controller;

import mg.gouv.sgrh.dto.*;
import mg.gouv.sgrh.model.*;
import mg.gouv.sgrh.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/rbac")
@PreAuthorize("hasAnyAuthority('USER_MANAGE','ROLE_MANAGE','PERMISSION_MANAGE')")
public class RbacAdminController {
    private final UtilisateurRepository users;
    private final RoleRepository roles;
    private final PermissionRepository permissions;
    private final PasswordEncoder encoder;

    public RbacAdminController(UtilisateurRepository users, RoleRepository roles, PermissionRepository permissions, PasswordEncoder encoder) {
        this.users = users; this.roles = roles; this.permissions = permissions; this.encoder = encoder;
    }

    @GetMapping("/users") @PreAuthorize("hasAuthority('USER_MANAGE')")
    public List<UserAdminResponse> users() { return users.findAll().stream().map(this::response).toList(); }

    @PostMapping("/users") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasAuthority('USER_MANAGE')")
    public UserAdminResponse create(@RequestBody UserAdminRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank() || request.getPassword() == null || request.getPassword().length() < 8)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nom d'utilisateur et mot de passe de 8 caractères minimum requis");
        if (users.findByUsername(request.getUsername()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT, "Nom d'utilisateur déjà utilisé");
        Utilisateur user = new Utilisateur(); user.setDate_creation(LocalDateTime.now());
        apply(user, request, true); return response(users.save(user));
    }

    @PutMapping("/users/{id}") @PreAuthorize("hasAuthority('USER_MANAGE')")
    public UserAdminResponse update(@PathVariable Long id, @RequestBody UserAdminRequest request) {
        Utilisateur user = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        apply(user, request, false); return response(users.save(user));
    }

    @PatchMapping("/users/{id}/active") @PreAuthorize("hasAuthority('USER_MANAGE')")
    public UserAdminResponse active(@PathVariable Long id, @RequestParam boolean value, Authentication authentication) {
        Utilisateur user = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (user.getUsername().equals(authentication.getName()) && !value) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous ne pouvez pas désactiver votre propre compte");
        user.setActif(value); return response(users.save(user));
    }

    @DeleteMapping("/users/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @PreAuthorize("hasAuthority('USER_MANAGE')")
    public void delete(@PathVariable Long id, Authentication authentication) {
        Utilisateur user = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (user.getUsername().equals(authentication.getName())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous ne pouvez pas supprimer votre propre compte");
        users.delete(user);
    }

    @GetMapping("/roles")
    public List<Role> roles() { return roles.findAll(); }

    @GetMapping("/permissions")
    public List<Permission> permissions() { return permissions.findAll(); }

    @PutMapping("/roles/{id}") @PreAuthorize("hasAuthority('PERMISSION_MANAGE')")
    public Role updateRole(@PathVariable Long id, @RequestBody RolePermissionsRequest request) {
        Role role = roles.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (request.getNom() != null && !request.getNom().isBlank()) role.setNom(request.getNom());
        if (request.getPermissionCodes() != null) role.setPermissions(request.getPermissionCodes().stream()
            .map(code -> permissions.findByCode(code).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Permission inconnue: " + code)))
            .collect(Collectors.toSet()));
        return roles.save(role);
    }

    private void apply(Utilisateur user, UserAdminRequest request, boolean creating) {
        if (request.getUsername() != null) user.setUsername(request.getUsername().trim());
        if (request.getEmail() != null) user.setEmail(request.getEmail().trim());
        if (request.getPassword() != null && !request.getPassword().isBlank()) user.setMot_de_passe(encoder.encode(request.getPassword()));
        else if (creating) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe requis");
        user.setActif(request.getActif() == null || request.getActif()); user.setId_agent(request.getAgentId()); user.setId_service(request.getServiceId());
        if (request.getRoleCodes() != null) user.setRoles(request.getRoleCodes().stream()
            .map(code -> roles.findByCode(code).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rôle inconnu: " + code)))
            .collect(Collectors.toSet()));
        if (user.getRoles() == null || user.getRoles().isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Au moins un rôle est requis");
    }

    private UserAdminResponse response(Utilisateur user) {
        Set<String> roleCodes = user.getRoles().stream().map(Role::getCode).collect(Collectors.toSet());
        Set<String> permissionCodes = user.getRoles().stream().flatMap(role -> role.getPermissions().stream()).map(Permission::getCode).collect(Collectors.toSet());
        return new UserAdminResponse(user.getId_utilisateur(), user.getUsername(), user.getEmail(), user.getActif(), user.getDate_creation(), roleCodes, permissionCodes, user.getId_agent(), user.getId_service());
    }
}
