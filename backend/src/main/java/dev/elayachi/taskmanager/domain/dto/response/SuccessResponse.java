package dev.elayachi.taskmanager.domain.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SuccessResponse {
  private String message;
  private LocalDateTime timestamp;
  private boolean status;

}
