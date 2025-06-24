# Task Manager Application

## Overview
Task Manager is a full-stack web application designed to help users manage their tasks efficiently. It features a secure backend built with Spring Boot and Spring Security (JWT), and a responsive frontend developed with React and TypeScript.

## Features
- **JWT Authentication and Authorization**: Securely verifies user identities and controls access to resources using JSON Web Tokens.
- **User Registration and Login**: Dedicated frontend pages for users to create new accounts and securely log in.
- **Frontend Integration with JWT & Protected Routes**: Seamlessly integrates JWTs into frontend requests, automatically attaching tokens for authenticated access. Key application routes are protected, redirecting unauthenticated users to the login page and restricting access based on user roles.
- **Task Management (CRUD)**: Users can create, retrieve, update, and delete tasks.

## Prerequisites
Before you begin, ensure you have the following installed:

### Backend Prerequisites
- **Java Development Kit (JDK)**: Version 21 or higher.
- **Maven**: Version 3.x or higher.
- **PostgreSQL**: Database server (use docker compose to run the database service inside a container)
- **Git**: For cloning the repository.

### Frontend Prerequisites
- **Node.js**: Version 18.x or higher (includes pnpm).
- **npm or pnpm**: Package manager (pnpm comes with Node.js).
- **Git**: For cloning the repository.

## Backend Setup (Spring Boot)

### 1. Clone the Repository:
```bash
git clone https://github.com/abdelmajidelayachi/task-manager.git
cd backend
```

### 2. Database Configuration:

#### Option 1: Using Docker (Recommended)
If you have Docker installed, you can easily run PostgreSQL using Docker Compose:

```bash
cd backend
docker compose up -d
```

This will start a PostgreSQL container using the following `docker-compose.yml` configuration:

```yaml
services:
  db:
    container_name: task-manager-db
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: task_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5462:5432"
    healthcheck:   # check the health of the db
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

#### Option 2: Manual PostgreSQL Setup
- Ensure your PostgreSQL server is running.
- Create a database (e.g., `task_db`).

#### Database Connection Properties
Update the database connection properties in `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5462/task_db # Adjust port/database name if needed
    username: postgres
    password: postgres # Your PostgreSQL password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update # Automatically update schema (for development)
    show-sql: on
```

### 3. CORS Configuration:
The backend is configured to accept requests from `http://localhost:5173`. If your frontend runs on a different port, update the `SecurityConfig.java` file:

```java
// In src/main/java/dev/elayachi/taskmanager/configuration/SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:5173")); // <--- Update this if your frontend port changes
    // ... other configurations
    return source;
}
```

### 4. Build and Run the Backend:
```bash
mvn clean install # Build the project and download dependencies
mvn spring-boot:run # Run the Spring Boot application
```

The backend will typically run on `http://localhost:8088`.

## Frontend Setup (React/TypeScript)

### 1. Navigate to the Frontend Directory:
```bash
cd ../frontend
```

### 2. Install Dependencies:
```bash
pnpm install
```

### 3. Run the Frontend Development Server:
```bash
pnpm run dev
```

The frontend will typically run on `http://localhost:5173`.

## Usage & Testing

1. Ensure both backend and frontend are running.

2. **Register a New User**:
  - Open your browser to `http://localhost:5173/register`.
  - Fill out the registration form (e.g., Username: `testuser`, Password: `password123`, Name: `Test User`).
  - Click "Create Account". You should see a success message (or be redirected to login).

3. **Login and Obtain JWT**:
  - Go to `http://localhost:5173/login`.
  - Log in with the registered user's credentials (`testuser`, `password123`).
  - Upon successful login, you should be redirected to the `/tasks` page, and a JWT token will be stored in your browser's local storage (you can inspect this in DevTools under Application -> Local Storage).

4. **Test Protected Routes and API Calls**:
  - Once logged in, you can interact with the task management features. All API calls (e.g., fetching, creating, updating tasks) will automatically include the JWT token in the Authorization header, handled by the apiClient.
  - Try accessing a protected route without logging in (e.g., clear local storage and try to go to `/tasks` directly) – you should be redirected to `/login`.

## Technologies Used

### Backend:
- Spring Boot 3.x
- Spring Security
- JWT (JSON Web Tokens)
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend:
- React 18+
- TypeScript
- Vite (for development server)
- Axios (for API requests)
- Sass/SCSS (for styling)
- React Router DOM
- Lucide React (for icons)
