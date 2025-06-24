package dev.elayachi.taskmanager.domain.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {

    @NotBlank(message = "Username is required")
    @NotNull(message = "Username not set")
    private String username;
  @NotBlank(message = "Password is required")
  @NotNull(message = "Password not set")
    private String password;

}
