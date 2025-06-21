package dev.elayachi.taskmanager.service;

import dev.elayachi.taskmanager.domain.dto.request.TaskRequest;
import dev.elayachi.taskmanager.domain.dto.response.TaskResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * Interface task methods
 */
public interface TaskService {

  /**
   * list of all tasks mapped to dto response
   * @return List<TaskResponse>
   */
  List<TaskResponse> getAllTasks();

  /**
   * create a task method
   * @param taskRequest task request dto
   * @return saved task mapped to response dto
   */
  TaskResponse createTask(TaskRequest taskRequest);
}
