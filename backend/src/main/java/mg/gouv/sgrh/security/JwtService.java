package mg.gouv.sgrh.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
@Service
public class JwtService {
    private final SecretKey key; private final long expirationMs;
    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.expirationMs = expirationMs;
    }
    public String generateToken(String username, Map<String,Object> claims) {
        Date now = new Date();
        return Jwts.builder().claims(claims).subject(username).issuedAt(now)
            .expiration(new Date(now.getTime()+expirationMs)).signWith(key).compact();
    }
    public String extractUsername(String token) { return claims(token).getSubject(); }
    public boolean isValid(String token,String username) {
        Claims claims=claims(token); return username.equals(claims.getSubject()) && claims.getExpiration().after(new Date());
    }
    private Claims claims(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload(); }
}
