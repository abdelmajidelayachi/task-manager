package dev.elayachi.taskmanager.exception;

import dev.elayachi.taskmanager.domain.dto.response.ErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import java.util.*;

/**
 * Global exception handler for the entire application.
 *
 * This class handles all exceptions thrown by controllers and provides
 * standardized error responses. It ensures consistent error formatting
 * and proper HTTP status codes across the API.
 *
 * @author Abdelmajid El Ayachi
 * @version 1.0
 * @since 1.0
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);


  /**
   * Handles custom ResourceNotFoundException thrown by the application.
   *
   * @param ex the ResourceNotFoundException
   * @param request the HTTP request
   * @return ResponseEntity with error details and HTTP 404 Not Found
   */
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex,
                                                                       HttpServletRequest request) {
    logger.warn("Resource not found: {}", ex.getMessage());

    ErrorResponse errorResponse = new ErrorResponse(
      HttpStatus.NOT_FOUND.value(),
      "Resource Not Found",
      ex.getMessage(),
      request.getRequestURI()
    );

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

    /**
     * Handles ValidationException thrown by the application.
     *
     * @param ex the ValidationException
     * @param request the HTTP request
     * @return ResponseEntity with error details and HTTP 400 Bad Request
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex,
                                                                  HttpServletRequest request) {
        logger.warn("Validation error: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                ex.getMessage(),
                request.getRequestURI(),
                ex.getFieldErrors(),
                ex.getGlobalErrors()
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Handles JSON parsing errors including invalid enum values.
     * This catches cases where invalid values are sent for enum fields.
     *
     * @param ex the HttpMessageNotReadableException
     * @param request the HTTP request
     * @return ResponseEntity with error details and HTTP 400 Bad Request
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex,
                                                                              HttpServletRequest request) {
        logger.warn("JSON parsing error: {}", ex.getMessage());

        Map<String, List<String>> fieldErrors = new HashMap<>();
        String message = "Invalid JSON format or invalid field values";

        // Check if it's an InvalidFormatException (enum parsing error)
        if (ex.getCause() instanceof InvalidFormatException) {
            InvalidFormatException formatEx = (InvalidFormatException) ex.getCause();

            // Extract field name from the path
            String fieldName = "unknown";
            if (!formatEx.getPath().isEmpty()) {
                fieldName = formatEx.getPath().get(formatEx.getPath().size() - 1).getFieldName();
            }

            // Create user-friendly error message based on field type
            String errorMessage;
            if (fieldName.equals("status")) {
                errorMessage = String.format("Invalid status value '%s'. Valid values are: PENDING, IN_PROGRESS, COMPLETED", //TODO: make this dynamic
                                            formatEx.getValue());
            } else if (fieldName.equals("priority")) {
                errorMessage = String.format("Invalid priority value '%s'. Valid values are: LOW, MEDIUM, HIGH",
                                            formatEx.getValue()); // TODO: make this dynamic
            } else {
                errorMessage = String.format("Invalid value '%s' for field '%s'",
                                            formatEx.getValue(), fieldName);
            }

            fieldErrors.put(fieldName, Arrays.asList(errorMessage));
            message = "Invalid field values provided";
        }

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid Request Format",
                message,
                request.getRequestURI(),
                fieldErrors.isEmpty() ? null : fieldErrors
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Handles EntityNotFoundException thrown by the application.
     *
     * @param ex the EntityNotFoundException
     * @param request the HTTP request
     * @return ResponseEntity with error details and HTTP 404 Not Found
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex,
                                                                      HttpServletRequest request) {
        logger.warn("Entity not found: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Handles MethodArgumentNotValidException thrown by Spring validation.
     *
     * @param ex the MethodArgumentNotValidException
     * @param request the HTTP request
     * @return ResponseEntity with validation errors and HTTP 400 Bad Request
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex,
                                                                              HttpServletRequest request) {
        logger.warn("Method argument validation failed: {}", ex.getMessage());

        Map<String, List<String>> fieldErrors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();

            fieldErrors.computeIfAbsent(fieldName, k -> new ArrayList<>()).add(errorMessage);
        }

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "Request validation failed",
                request.getRequestURI(),
                fieldErrors
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Handles ConstraintViolationException thrown by Bean Validation.
     *
     * @param ex the ConstraintViolationException
     * @param request the HTTP request
     * @return ResponseEntity with validation errors and HTTP 400 Bad Request
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex,
                                                                           HttpServletRequest request) {
        logger.warn("Constraint validation failed: {}", ex.getMessage());

        Map<String, List<String>> fieldErrors = new HashMap<>();

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();

            fieldErrors.computeIfAbsent(fieldName, k -> new ArrayList<>()).add(errorMessage);
        }

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "Constraint validation failed",
                request.getRequestURI(),
                fieldErrors
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Handles MethodArgumentTypeMismatchException for invalid path variables.
     *
     * @param ex the MethodArgumentTypeMismatchException
     * @param request the HTTP request
     * @return ResponseEntity with error details and HTTP 400 Bad Request
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex,
                                                                                   HttpServletRequest request) {
        logger.warn("Method argument type mismatch: {}", ex.getMessage());

        String message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                ex.getValue(), ex.getName(), ex.getRequiredType().getSimpleName());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                message,
                request.getRequestURI()
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

  /**
   * Handles UsernameNotFoundException for authentication failures when a user is not found.
   *
   * @param ex the UsernameNotFoundException
   * @param request the HTTP request
   * @return ResponseEntity with error details and HTTP 401 Unauthorized
   */
  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException ex,
                                                                       HttpServletRequest request) {
    logger.warn("Authentication failed: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(), // Use 401 Unauthorized
                "Authentication Failed",
                ex.getMessage(), // The message from the exception (e.g., "Invalid user credentials!")
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    /**
     * Handles BadCredentialsException for authentication failures due to incorrect password.
     *
     * @param ex the BadCredentialsException
     * @param request the HTTP request
     * @return ResponseEntity with error details and HTTP 401 Unauthorized
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex,
                                                                       HttpServletRequest request) {
        logger.warn("Authentication failed: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(), // Use 401 Unauthorized
                "Authentication Failed",
                "Invalid username or password.", // A more generic message for security
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    /**
     * Handles all other unexpected exceptions.
     *
     * @param ex the Exception
     * @param request the HTTP request
     * @return ResponseEntity with error details and HTTP 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex,
                                                               HttpServletRequest request) {
        logger.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected error occurred. Please try again later.",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
