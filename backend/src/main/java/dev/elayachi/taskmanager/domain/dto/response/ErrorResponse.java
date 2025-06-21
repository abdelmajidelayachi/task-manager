package dev.elayachi.taskmanager.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Standardized error response DTO.
 *
 * This class provides a consistent structure for error responses
 * across the entire API, including validation errors, not found errors,
 * and general server errors.
 *
 * @author Abdelmajid El Ayachi
 * @version 1.0
 * @since 1.0
 */

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private String path;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private Map<String, List<String>> fieldErrors;
    private List<String> globalErrors;

    /**
     * Default constructor.
     */
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Constructor for simple error responses.
     *
     * @param status HTTP status code
     * @param error error type
     * @param message error message
     * @param path request path
     */
    public ErrorResponse(int status, String error, String message, String path) {
        this();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    /**
     * Constructor for validation error responses.
     *
     * @param status HTTP status code
     * @param error error type
     * @param message error message
     * @param path request path
     * @param fieldErrors field-specific validation errors
     */
    public ErrorResponse(int status, String error, String message, String path,
                         Map<String, List<String>> fieldErrors) {
        this(status, error, message, path);
        this.fieldErrors = fieldErrors;
    }

    /**
     * Constructor for validation error responses with global errors.
     *
     * @param status HTTP status code
     * @param error error type
     * @param message error message
     * @param path request path
     * @param fieldErrors field-specific validation errors
     * @param globalErrors global validation errors
     */
    public ErrorResponse(int status, String error, String message, String path,
                         Map<String, List<String>> fieldErrors, List<String> globalErrors) {
        this(status, error, message, path, fieldErrors);
        this.globalErrors = globalErrors;
    }

    @Override
    public String toString() {
        return "ErrorResponse{" +
                "status=" + status +
                ", error='" + error + '\'' +
                ", message='" + message + '\'' +
                ", path='" + path + '\'' +
                ", timestamp=" + timestamp +
                ", fieldErrors=" + fieldErrors +
                ", globalErrors=" + globalErrors +
                '}';
    }
}
