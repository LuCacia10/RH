package mg.gouv.sgrh.config;
import mg.gouv.sgrh.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.beans.factory.annotation.Value;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
 @Bean SecurityFilterChain chain(HttpSecurity http,JwtAuthenticationFilter jwt) throws Exception { return http.csrf(c->c.disable()).cors(c->{})
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/api/auth/login","/api/auth/verify-otp","/error").permitAll().anyRequest().authenticated())
   .addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class).build(); }
 @Bean PasswordEncoder passwordEncoder(@Value("${app.security.password-storage:bcrypt}") String storage){
  boolean plaintext = "plaintext".equalsIgnoreCase(storage);
  if (plaintext) return new PasswordEncoder() {
   public String encode(CharSequence rawPassword){ return rawPassword.toString(); }
   public boolean matches(CharSequence rawPassword,String storedPassword){
    if (storedPassword == null) return false;
    return MessageDigest.isEqual(rawPassword.toString().getBytes(StandardCharsets.UTF_8), storedPassword.getBytes(StandardCharsets.UTF_8));
   }
  };
  return new BCryptPasswordEncoder(12);
 }
 @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c)throws Exception{return c.getAuthenticationManager();}
}
