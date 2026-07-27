package mg.gouv.sgrh.service;

import mg.gouv.sgrh.dto.LoginChallengeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailOtpService {
    private static final int MAX_ATTEMPTS = 5;
    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Challenge> challenges = new ConcurrentHashMap<>();
    private final long expirationSeconds;
    private final String from;

    public EmailOtpService(JavaMailSender mailSender,
                           @Value("${app.auth.otp.expiration-seconds:300}") long expirationSeconds,
                           @Value("${app.auth.otp.from}") String from) {
        this.mailSender = mailSender;
        this.expirationSeconds = expirationSeconds;
        this.from = from;
    }

    public LoginChallengeResponse create(String username, String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucune adresse e-mail n'est associée à ce compte");
        }
        removeChallengesFor(username);
        String challengeId = UUID.randomUUID().toString();
        String code = "%06d".formatted(random.nextInt(1_000_000));
        Instant expiresAt = Instant.now().plusSeconds(expirationSeconds);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(email);
        message.setSubject("Votre code de connexion SGRH");
        message.setText("Votre code de vérification SGRH est : " + code
            + "\n\nIl expire dans " + Math.max(1, expirationSeconds / 60) + " minute(s)."
            + "\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.");
        mailSender.send(message);

        challenges.put(challengeId, new Challenge(username, hash(challengeId, code), expiresAt, 0));
        return new LoginChallengeResponse(challengeId, mask(email), expirationSeconds);
    }

    public synchronized String verify(String challengeId, String code) {
        if (challengeId == null || code == null || !code.matches("\\d{6}")) {
            throw invalidCode();
        }
        Challenge challenge = challenges.get(challengeId);
        if (challenge == null || Instant.now().isAfter(challenge.expiresAt())) {
            challenges.remove(challengeId);
            throw invalidCode();
        }
        if (!MessageDigest.isEqual(
            challenge.codeHash().getBytes(StandardCharsets.US_ASCII),
            hash(challengeId, code).getBytes(StandardCharsets.US_ASCII))) {
            int attempts = challenge.attempts() + 1;
            if (attempts >= MAX_ATTEMPTS) challenges.remove(challengeId);
            else challenges.put(challengeId, new Challenge(challenge.username(), challenge.codeHash(),
                challenge.expiresAt(), attempts));
            throw invalidCode();
        }
        challenges.remove(challengeId);
        return challenge.username();
    }

    private void removeChallengesFor(String username) {
        challenges.entrySet().removeIf(entry ->
            entry.getValue().username().equals(username) || Instant.now().isAfter(entry.getValue().expiresAt()));
    }

    private String hash(String challengeId, String code) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest((challengeId + ":" + code).getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(exception);
        }
    }

    private String mask(String email) {
        int at = email.indexOf('@');
        if (at <= 1) return "***" + (at >= 0 ? email.substring(at) : "");
        return email.substring(0, 1) + "***" + email.substring(at);
    }

    private ResponseStatusException invalidCode() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Code invalide ou expiré");
    }

    private record Challenge(String username, String codeHash, Instant expiresAt, int attempts) {}
}
