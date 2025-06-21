package dev.elayachi.taskmanager.mapper;

import dev.elayachi.taskmanager.domain.dto.request.TaskRequest;
import dev.elayachi.taskmanager.domain.dto.response.TaskResponse;
import dev.elayachi.taskmanager.domain.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct mapper for conversion between Task entity and DTOs.
 * This interface defines mapping methods for Task.
 *
 * @author Abdelmajid EL AYACHI
 * @version 1.0
 * @since 1.0
 */

@Mapper(componentModel = "spring")
public interface TaskMapper {


  List<TaskResponse> toTasksResponse(List<Task> tasks);

  Task toEntity(TaskRequest taskRequest);

  @Mapping(target = "statusDisplayName", expression = "java(task.getStatus() != null ? task.getStatus().getDisplayName() : null)")
  @Mapping(target = "priorityDisplayName", expression = "java(task.getPriority() != null ? task.getPriority().getDisplayName() : null)")
  TaskResponse toResponse(Task task);
}
