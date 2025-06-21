package dev.elayachi.taskmanager.service;

import dev.elayachi.taskmanager.domain.dto.request.TaskRequest;
import dev.elayachi.taskmanager.domain.dto.response.TaskResponse;

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

  /**
   * Get task by id
   * @param id task id
   * @return TaskResponse
   */
  TaskResponse getTaskById(Long id);

  /**
   * update the task details
   * @param taskRequest updated task details
   * @param id updated task id
   * @return TaskResponse
   */
  TaskResponse updateTask(Long id, TaskRequest taskRequest);
}
