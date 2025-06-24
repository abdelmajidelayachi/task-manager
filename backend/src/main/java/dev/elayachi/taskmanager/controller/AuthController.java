package dev.elayachi.taskmanager.controller;

import dev.elayachi.taskmanager.domain.dto.request.AuthRequest;
import dev.elayachi.taskmanager.domain.dto.request.RegisterRequest;
import dev.elayachi.taskmanager.domain.dto.response.AuthResponse;
import dev.elayachi.taskmanager.domain.dto.response.SuccessResponse;
import dev.elayachi.taskmanager.security.JwtService;
import dev.elayachi.taskmanager.security.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Endpoint for user registration.
     * @param registerRequest Contains username and password for registration
     * @return A success message upon successful registration
     */
    @PostMapping("/register")
    public ResponseEntity<SuccessResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
       userService.create(registerRequest);
      SuccessResponse response = new SuccessResponse();
      response.setMessage("User registered successfully!");
      response.setTimestamp(LocalDateTime.now());
      response.setStatus(true);
      return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for generating JWT token after successful authentication.
     * @param authRequest Contains username and password for authentication
     * @return The generated JWT token
     * @throws UsernameNotFoundException if authentication fails
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateAndGetToken(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        // If authentication is successful, generate and return the JWT token
        if (authentication.isAuthenticated()) {
            AuthResponse authResponse  = AuthResponse.builder()
                                        .accessToken(jwtService.generateToken(authRequest.getUsername()))
                                        .build();
            return ResponseEntity.ok(authResponse);
        } else {
            // If authentication fails, throw an exception
            throw new UsernameNotFoundException("Invalid user credentials!");
        }
    }
}
