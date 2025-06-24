# Task Manager Application

## Overview
Task Manager is a full-stack web application designed to help users manage their tasks efficiently. It features a secure backend built with Spring Boot and Spring Security (JWT), and a responsive frontend developed with React and TypeScript.

## Features
- **JWT Authentication and Authorization**: Securely verifies user identities and controls access to resources using JSON Web Tokens.
- **User Registration and Login**: Dedicated frontend pages for users to create new accounts and securely log in.
- **Frontend Integration with JWT & Protected Routes**: Seamlessly integrates JWTs into frontend requests, automatically attaching tokens for authenticated access. Key application routes are protected, redirecting unauthenticated users to the login page and restricting access based on user roles.
- **Task Management (CRUD)**: Users can create, retrieve, update, and delete tasks.

## Quick Start with Docker (Recommended)

### Prerequisites
- **Docker**: Version 20.x or higher
- **Docker Compose**: Version 2.x or higher
- **Git**: For cloning the repository

### 1. Clone the Repository
```bash
git clone https://github.com/abdelmajidelayachi/task-manager.git
cd task-manager
```

### 2. Run the Full Application
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8088
- **Database**: localhost:5462 (PostgreSQL)

### 4. Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database data)
docker-compose down -v
```

## Manual Setup (Development)

### Prerequisites
- **Java Development Kit (JDK)**: Version 21 or higher
- **Maven**: Version 3.x or higher
- **Node.js**: Version 18.x or higher
- **pnpm**: Package manager
- **PostgreSQL**: Database server
- **Git**: For cloning the repository

### Backend Setup (Spring Boot)

#### 1. Clone the Repository
```bash
git clone https://github.com/abdelmajidelayachi/task-manager.git
cd task-manager/backend
```

#### 2. Database Configuration

##### Option 1: Using Docker for Database Only
```bash
# Run only the database service
docker-compose up db -d
```

##### Option 2: Manual PostgreSQL Setup
- Ensure your PostgreSQL server is running
- Create a database (e.g., `task_db`)

#### 3. Update Database Connection
Update `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5462/task_db
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: on
```

#### 4. Build and Run the Backend
```bash
mvn clean install
mvn spring-boot:run
```

The backend will run on `http://localhost:8088`.

### Frontend Setup (React/TypeScript)

#### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 2. Install Dependencies
```bash
pnpm install
```

#### 3. Run the Development Server
```bash
pnpm run dev
```

The frontend will run on `http://localhost:5173`.

## Usage & Testing

### With Docker
1. Start the application: `docker-compose up --build`
2. Open your browser to `http://localhost:5173`

### Manual Setup
1. Ensure database, backend, and frontend are running
2. Open your browser to `http://localhost:5173`

### Testing the Application

#### 1. Register a New User
- Navigate to the registration page
- Fill out the form (Username: `testuser`, Password: `password123`, Name: `Test User`)
- Click "Create Account"

#### 2. Login and Test JWT
- Go to the login page
- Log in with your credentials
- You should be redirected to the tasks page
- JWT token will be stored in browser's local storage

#### 3. Test Protected Routes
- Try accessing `/tasks` without logging in
- You should be redirected to `/login`
- All API calls will automatically include the JWT token

## Docker Services

### Service Overview
- **Database (db)**: PostgreSQL 16 on port 5462
- **Backend (backend)**: Spring Boot API on port 8088
- **Frontend (frontend)**: React app served by Nginx on port 5173

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Rebuild a specific service
docker-compose build [service-name]

# Remove everything including volumes
docker-compose down -v --rmi all
```

### Troubleshooting Docker

#### Common Issues

1. **Port conflicts**: Ensure ports 5173, 8088, and 5462 are available
2. **Build failures**: Try `docker-compose build --no-cache`
3. **Database connection issues**: Wait for the database health check to pass
4. **Frontend build errors**: Check that all dependencies are in package.json

#### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## CORS Configuration

The backend is configured to accept requests from both development and production frontend URLs:
- `http://localhost:5173` (Both Vite dev server and Docker/Nginx)

## Technologies Used

### Backend
- Spring Boot 3.x
- Spring Security
- JWT (JSON Web Tokens)
- Spring Data JPA
- PostgreSQL
- Maven
- Docker

### Frontend
- React 18+
- TypeScript
- Vite (for development)
- Axios (for API requests)
- Sass/SCSS (for styling)
- React Router DOM
- Lucide React (for icons)
- Nginx (for production serving)

### Infrastructure
- Docker & Docker Compose
- PostgreSQL
- Nginx
