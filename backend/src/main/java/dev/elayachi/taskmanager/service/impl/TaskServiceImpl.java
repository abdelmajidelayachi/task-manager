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
    @Override
    public TaskResponse updateTask(Long id, TaskRequest taskRequest) {
      // Check if the task exists
      Task existingTask = taskRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
          String.format("Task not found with id: %s", id)));

      // Update the existing task fields
      existingTask.setTitle(taskRequest.getTitle());
      existingTask.setDescription(taskRequest.getDescription());
      existingTask.setStatus(taskRequest.getStatus());
      existingTask.setPriority(taskRequest.getPriority());

      // Save the updated task
      Task updatedTask = taskRepository.save(existingTask);
      return taskMapper.toResponse(updatedTask);
    }

  @Override
  public void deleteTask(Long id) {
    Task task = taskRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException(
        String.format("Task not found with id: %s", id)));
    taskRepository.delete(task);
  }

  @Override
  public TaskResponse updateTaskStatus(Long id, String status) {
    Task.TaskStatus taskStatus = getAndValidateStatus(status);
    Task task  = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Task not found with id: %s", id)));
    task.setStatus(taskStatus);
    Task updatedTask = taskRepository.save(task);
    return taskMapper.toResponse(updatedTask);
  }

  private Task.TaskStatus getAndValidateStatus(String status) {
    try {
      return Task.TaskStatus.valueOf(status);
    } catch (IllegalArgumentException e) {
      throw new ResourceNotFoundException(String.format("Invalid status: %s", status));
    }
  }


}
