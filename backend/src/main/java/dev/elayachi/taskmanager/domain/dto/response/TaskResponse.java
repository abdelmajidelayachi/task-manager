package dev.elayachi.taskmanager.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.elayachi.taskmanager.domain.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Task response DTO for returning task data to clients.
 * Contains all task information including timestamps.
 *
 * @author Abdelmajid El Ayachi
 * @version 1.0
 * @since 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Task.TaskStatus status;
    private String statusDisplayName;
    private Task.TaskPriority priority;
    private String priorityDisplayName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
