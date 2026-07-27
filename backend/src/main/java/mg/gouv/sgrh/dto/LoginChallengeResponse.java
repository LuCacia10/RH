package mg.gouv.sgrh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginChallengeResponse {
    private String challengeId;
    private String emailMasked;
    private long expiresInSeconds;
}
