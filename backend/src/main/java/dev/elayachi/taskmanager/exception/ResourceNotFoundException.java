package dev.elayachi.taskmanager.exception;

import lombok.Getter;

/**
 * Custom exception for when a requested resource is not found.
 *
 * @author Abdelmajid El Ayachi
 * @version 1.0
 * @since 1.0
 */
@Getter
public class ResourceNotFoundException extends RuntimeException {

    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    /**
     * Constructor with a simple error message.
     *
     * @param message the error message
     */
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceName = null;
        this.fieldName = null;
        this.fieldValue = null;
    }

    /**
     * Constructor with error message and cause.
     *
     * @param message the error message
     * @param cause the underlying cause
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
        this.resourceName = null;
        this.fieldName = null;
        this.fieldValue = null;
    }

    /**
     * Constructor with resource details.
     *
     * @param resourceName the name of the resource that was not found
     * @param fieldName the field name used to search for the resource
     * @param fieldValue the field value used to search for the resource
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    /**
     * Constructor with custom message and resource details.
     *
     * @param message the custom error message
     * @param resourceName the name of the resource that was not found
     * @param fieldName the field name used to search for the resource
     * @param fieldValue the field value used to search for the resource
     */
    public ResourceNotFoundException(String message, String resourceName, String fieldName, Object fieldValue) {
        super(message);
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    /**
     * Checks if this exception has resource details.
     *
     * @return true if resource details are available, false otherwise
     */
    public boolean hasResourceDetails() {
        return resourceName != null && fieldName != null && fieldValue != null;
    }

    /**
     * Returns a formatted string with resource details.
     *
     * @return formatted resource details or null if not available
     */
    public String getResourceDetails() {
        if (hasResourceDetails()) {
            return String.format("Resource: %s, Field: %s, Value: %s", resourceName, fieldName, fieldValue);
        }
        return null;
    }

    @Override
    public String toString() {
        return "ResourceNotFoundException{" +
                "message='" + getMessage() + '\'' +
                ", resourceName='" + resourceName + '\'' +
                ", fieldName='" + fieldName + '\'' +
                ", fieldValue=" + fieldValue +
                '}';
    }
}
