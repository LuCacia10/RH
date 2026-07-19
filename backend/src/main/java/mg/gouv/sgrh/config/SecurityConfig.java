package mg.gouv.sgrh.config;
import mg.gouv.sgrh.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
public class SecurityConfig {
 @Bean SecurityFilterChain chain(HttpSecurity http,JwtAuthenticationFilter jwt) throws Exception { return http.csrf(c->c.disable()).cors(c->{})
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/api/auth/login","/error").permitAll().anyRequest().authenticated())
   .addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class).build(); }
 @Bean PasswordEncoder passwordEncoder(){
  return new PasswordEncoder() {
   public String encode(CharSequence rawPassword){return rawPassword.toString();}
   public boolean matches(CharSequence rawPassword,String storedPassword){return rawPassword.toString().equals(storedPassword);}
  };
 }
 @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c)throws Exception{return c.getAuthenticationManager();}
}
