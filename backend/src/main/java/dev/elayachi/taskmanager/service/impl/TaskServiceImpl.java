package dev.elayachi.taskmanager.service.impl;

import dev.elayachi.taskmanager.domain.dto.request.TaskRequest;
import dev.elayachi.taskmanager.domain.dto.response.TaskResponse;
import dev.elayachi.taskmanager.domain.entity.Task;
import dev.elayachi.taskmanager.domain.repository.TaskRepository;
import dev.elayachi.taskmanager.exception.ResourceNotFoundException;
import dev.elayachi.taskmanager.mapper.TaskMapper;
import dev.elayachi.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * task business logic
 */

@Service
public class TaskServiceImpl implements TaskService {

  private final TaskRepository taskRepository;
  private final TaskMapper taskMapper;

  @Autowired
  public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
    this.taskRepository = taskRepository;
    this.taskMapper = taskMapper;
  }

  @Override
  public List<TaskResponse> getAllTasks() {
    return taskMapper.toTasksResponse(taskRepository.getAllTasks());
  }

  @Override
  public TaskResponse createTask(TaskRequest taskRequest) {
    Task task = taskMapper.toEntity(taskRequest);
    Task savedTask = taskRepository.save(task);
    return taskMapper.toResponse(savedTask);
  }

    @Override
    public TaskResponse getTaskById(Long id) {
      Optional<Task> task = taskRepository.findById(id);
      if (task.isPresent()) {
        return taskMapper.toResponse(task.get());
      }
      throw new ResourceNotFoundException(String.format("No task found by id of [%s]", id));
    }

}
