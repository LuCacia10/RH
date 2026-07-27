package mg.gouv.sgrh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaveBeneficiaryResponse {
    private Long userId;
    private String username;
    private String email;
    private Long agentId;
    private String matricule;
    private String nomComplet;
}
