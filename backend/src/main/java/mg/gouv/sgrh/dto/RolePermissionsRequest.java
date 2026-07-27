package mg.gouv.sgrh.dto;

import lombok.Data;
import java.util.Set;

@Data
public class RolePermissionsRequest {
    private String nom;
    private Set<String> permissionCodes;
}
