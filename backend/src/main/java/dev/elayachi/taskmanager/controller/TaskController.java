package dev.elayachi.taskmanager.controller;

import dev.elayachi.taskmanager.domain.dto.request.TaskRequest;
import dev.elayachi.taskmanager.domain.dto.response.TaskResponse;
import dev.elayachi.taskmanager.exception.ResourceNotFoundException;
import dev.elayachi.taskmanager.exception.ValidationException;
import dev.elayachi.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Task operations.
 *
 * This controller provides endpoints for CRUD operations on tasks including:
 * - Creating new tasks
 * - Retrieving all tasks
 *
 * Base URL: /api/v1/tasks
 *
 * @author Abdelmajid El Ayachi
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

  private final TaskService taskService;

  @Autowired
  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }

/**
 * Creates a new task.
 *
 * This endpoint accepts a TaskRequest object containing task details
 * and creates a new task in the system. The request body is validated
 * using Bean Validation annotations.
 *
 * @param taskRequest the task data to create (validated)
 * @return ResponseEntity containing the created TaskResponse with HTTP 201 Created
 *
 * @throws ValidationException if the request data is invalid
 */
 @PostMapping
  public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest) {
   TaskResponse createdTask = taskService.createTask(taskRequest);
   return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
  }

  /**
   * Retrieving all tasks ordered by the last created task
   * @return ResponseEntity containing list of TaskResponse with status 200 OK
   */
  @GetMapping()
  public ResponseEntity<List<TaskResponse>> getTasks() {
    return  ResponseEntity.ok(taskService.getAllTasks());
  }


  /**
   * Retrieving task by id
   * @param id task identifier
   * @return ResponseEntity containing TaskResponse
   * @throws ResourceNotFoundException if task is not found
   */
  @GetMapping("/{id}")
  public ResponseEntity<TaskResponse> getTaskById(@PathVariable("id") Long id) {
    return ResponseEntity.ok(taskService.getTaskById(id));
  }



}
