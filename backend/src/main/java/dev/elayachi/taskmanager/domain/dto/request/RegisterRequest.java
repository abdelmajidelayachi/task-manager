package dev.elayachi.taskmanager.domain.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @NotNull(message = "Name not set")
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Username not set")
    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "Password not set")
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 8 characters")
    private String password;

}
