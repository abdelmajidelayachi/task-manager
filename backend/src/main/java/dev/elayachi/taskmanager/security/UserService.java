package dev.elayachi.taskmanager.security;

import dev.elayachi.taskmanager.domain.dto.request.RegisterRequest;
import dev.elayachi.taskmanager.domain.entity.User;
import dev.elayachi.taskmanager.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo; // Corrected injection from UserRepository to UserRepo

    /**
     * Loads user-specific data by username. This method is called by Spring Security
     * during the authentication process.
     * @param username The username of the user to load.
     * @return UserDetails object containing user information.
     * @throws UsernameNotFoundException if the user is not found in the database.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Retrieves user details by username from the database
        // It's crucial to throw UsernameNotFoundException if the user is not found,
        // as per the UserDetailsService contract.
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    /**
     * Creates a new user in the system.
     * @param registerRequest The registration request containing username, password, and name.
     */
    public void create(RegisterRequest registerRequest) {
        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(new BCryptPasswordEncoder().encode(registerRequest.getPassword())) // Encrypts the password
                .name(registerRequest.getName())
                .enabled(true)
                .authorities("student") // Assigns default authority (e.g., "student" or "user")
                .build();

        // Saves the new user to the database
        userRepo.save(user);
    }
}
