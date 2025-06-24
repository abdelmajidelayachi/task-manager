package dev.elayachi.taskmanager.security;

import dev.elayachi.taskmanager.security.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Custom JWT authentication filter that extends OncePerRequestFilter to ensure
 * it is executed only once per request. This filter intercepts incoming requests,
 * extracts and validates JWT tokens from the Authorization header, and sets the
 * authentication in the Spring Security context.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService; // Service for JWT token operations (validate, extract)

    @Autowired
    private UserService userService; // Service to load user details by username

    /**
     * Performs the actual filtering logic.
     * @param request The current HTTP request.
     * @param response The current HTTP response.
     * @param filterChain The filter chain to proceed with.
     * @throws ServletException if a servlet-specific error occurs.
     * @throws IOException if an I/O error occurs.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization"); // Get the Authorization header
        String token = null;
        String username = null;

        // Check if the Authorization header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Extract the token (remove "Bearer " prefix)
            username = jwtService.extractUsername(token); // Extract the username from the token
        }

        // If username is extracted and no authentication is currently set in the SecurityContext
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userService.loadUserByUsername(username); // Load UserDetails by username

            // Validate the token against the loaded UserDetails
            if (jwtService.validateToken(token, userDetails)) {
                // Create an authentication token if validation succeeds
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                // Set additional details for the authentication token (e.g., remote address, session ID)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Set the authentication object in the SecurityContextHolder
                // This marks the user as authenticated for the current request
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // Continue with the filter chain (pass the request to the next filter or servlet)
        filterChain.doFilter(request, response);
    }
}
