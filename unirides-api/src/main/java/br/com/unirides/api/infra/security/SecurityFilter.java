package br.com.unirides.api.infra.security;

import br.com.unirides.api.domain.user.User;
import br.com.unirides.api.exceptions.UserNotFoundException;
import br.com.unirides.api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    @Lazy  //evitar o erro de dependências circular na inicialização
    TokenService tokenService;
    @Autowired
    UserRepository userRepository;

    private static final List<String> EXCLUDED_PATHS = Arrays.asList("/auth/login", "/auth/register", "/api/distance");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();

        // Adicionar log para debug
        logger.debug("Requested URI: " + uri);
        logger.debug("Is excluded path: " + EXCLUDED_PATHS.contains(uri));

        // Verificar se a URI começa com algum dos caminhos excluídos
        boolean isExcludedPath = EXCLUDED_PATHS.stream()
                .anyMatch(path -> uri.startsWith(path));

        if (EXCLUDED_PATHS.contains(uri)) {
            // Não aplicar o filtro aos endpoints públicos
            // Adicionar headers CORS aqui para rotas públicas
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
            filterChain.doFilter(request, response);
            return;
        }

        var token = this.recoverToken(request);
        var login = tokenService.validateToken(token);

        if(login != null){
            User user = userRepository.findByEmail(login).orElseThrow(() -> new UserNotFoundException("User Not Found"));
            var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
            var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}