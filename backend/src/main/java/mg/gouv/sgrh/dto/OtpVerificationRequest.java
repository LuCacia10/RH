package mg.gouv.sgrh.dto;

import lombok.Data;

@Data
public class OtpVerificationRequest {
    private String challengeId;
    private String code;
}
