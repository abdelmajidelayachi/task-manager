package dev.elayachi.taskmanager.configuration;

import dev.elayachi.taskmanager.security.JwtAuthFilter;
import dev.elayachi.taskmanager.security.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired
  private UserService userService; // Service to load user details

  @Autowired
  private JwtAuthFilter jwtAuthFilter; // Custom JWT authentication filter

  /**
   * Configures the AuthenticationProvider to use the custom UserService and PasswordEncoder.
   * @return the configured DaoAuthenticationProvider
   */
  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userService); // Set our custom UserDetailsService
    provider.setPasswordEncoder(passwordEncoder()); // Set the password encoder
    return provider;
  }

  /**
   * Configures the SecurityFilterChain for HTTP security.
   * This method defines access rules, session management, and adds the JWT filter.
   * @param httpSecurity HttpSecurity object to configure
   * @return the built SecurityFilterChain
   * @throws Exception if an error occurs during configuration
   */
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity
      // Disable CSRF protection as JWT is stateless and token-based (not session-based)
      .csrf(AbstractHttpConfigurer::disable)
      // Configure authorization rules for different endpoints
      .authorizeHttpRequests(authorizeRequest -> authorizeRequest
        // Public endpoints that do not require authentication
        .requestMatchers("/auth/**").permitAll()
        // All other requests must be authenticated
        .anyRequest().authenticated()
      )
      // Configure session management to be stateless, crucial for JWT
      .sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      // Set the custom authentication provider
      .authenticationProvider(authenticationProvider())
      // Add the JWT authentication filter before Spring Security's default UsernamePasswordAuthenticationFilter
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return httpSecurity.build();
  }

  /**
   * Provides a BCryptPasswordEncoder bean for password hashing.
   * @return the BCryptPasswordEncoder instance
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * Exposes the AuthenticationManager bean, which is used to perform authentication.
   * @param config AuthenticationConfiguration for building the manager
   * @return the AuthenticationManager instance
   * @throws Exception if an error occurs during configuration
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}
