package mg.gouv.sgrh.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserAdminRequest {
    private String username;
    private String email;
    private String password;
    private Boolean actif;
    private Set<String> roleCodes;
    private Long agentId;
    private Long serviceId;
}
