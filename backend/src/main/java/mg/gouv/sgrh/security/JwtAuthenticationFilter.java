package mg.gouv.sgrh.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwt; private final SgrhUserDetailsService users;
    public JwtAuthenticationFilter(JwtService jwt,SgrhUserDetailsService users){this.jwt=jwt;this.users=users;}
    protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain) throws ServletException,IOException {
        String auth=req.getHeader("Authorization");
        if(auth!=null&&auth.startsWith("Bearer ")&&SecurityContextHolder.getContext().getAuthentication()==null){
            try { String token=auth.substring(7); UserDetails user=users.loadUserByUsername(jwt.extractUsername(token));
                if(jwt.isValid(token,user.getUsername())) SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities()));
            } catch(Exception ignored) { }
        }
        chain.doFilter(req,res);
    }
}
