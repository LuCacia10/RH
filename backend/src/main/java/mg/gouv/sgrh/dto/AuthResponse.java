package mg.gouv.sgrh.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Set;
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token; private Long id; private String username; private String email; private Set<String> roles;
    private Set<String> permissions; private Long agentId; private Long serviceId;
}
