package dev.elayachi.taskmanager.exception;

import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * Custom exception for validation errors.
 *
 * This exception is thrown when input validation fails
 *
 * @author Abdelmajid El Ayachi
 * @version 1.0
 * @since 1.0
 */
@Getter
public class ValidationException extends RuntimeException {

  /**
   * -- GETTER --
   *  Gets the field-specific validation errors.
   *
   * @return map of field names to their error messages, or null if not available
   */
  private final Map<String, List<String>> fieldErrors;
  /**
   * -- GETTER --
   *  Gets the global validation errors.
   *
   * @return list of global error messages, or null if not available
   */
  private final List<String> globalErrors;

    /**
     * Constructor with a simple error message.
     *
     * @param message the error message
     */
    public ValidationException(String message) {
        super(message);
        this.fieldErrors = null;
        this.globalErrors = null;
    }

    /**
     * Constructor with error message and cause.
     *
     * @param message the error message
     * @param cause the underlying cause
     */
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        this.fieldErrors = null;
        this.globalErrors = null;
    }

    /**
     * Constructor with detailed field errors.
     *
     * @param message the error message
     * @param fieldErrors map of field names to their error messages
     */
    public ValidationException(String message, Map<String, List<String>> fieldErrors) {
        super(message);
        this.fieldErrors = fieldErrors;
        this.globalErrors = null;
    }

    /**
     * Constructor with field errors and global errors.
     *
     * @param message the error message
     * @param fieldErrors map of field names to their error messages
     * @param globalErrors list of global validation errors
     */
    public ValidationException(String message, Map<String, List<String>> fieldErrors, List<String> globalErrors) {
        super(message);
        this.fieldErrors = fieldErrors;
        this.globalErrors = globalErrors;
    }

  /**
     * Checks if this exception has detailed field errors.
     *
     * @return true if field errors are available, false otherwise
     */
    public boolean hasFieldErrors() {
        return fieldErrors != null && !fieldErrors.isEmpty();
    }

    /**
     * Checks if this exception has global errors.
     *
     * @return true if global errors are available, false otherwise
     */
    public boolean hasGlobalErrors() {
        return globalErrors != null && !globalErrors.isEmpty();
    }
}
