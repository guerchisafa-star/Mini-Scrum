# Mini-Scrum

A lightweight Scrum project management application built with **Spring Boot** (backend) and **React** (frontend).

---

## Branches

| Branch     | Content              |
|------------|----------------------|
| `main`     | Backend (Spring Boot)|
| `frontend` | Frontend (React)     |

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.3
- Spring Security + JWT (JJWT 0.12.6)
- Spring Data JPA + Hibernate
- PostgreSQL
- Lombok

### Frontend
- React 18
- React Router DOM v6
- Vite 5
- @dnd-kit (drag & drop)

---

## Features

- Authentication (Register / Login) with JWT
- Project management
- Sprint planning
- Backlog management
- Kanban board with drag & drop
- Team management
- Dashboard with project overview

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Create a PostgreSQL database named `Database_ScrumApp`
2. Configure credentials in `src/main/resources/application.properties` or set environment variables:
   ```
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The API will be available at `http://localhost:8086`

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

---

## API Base URL

```
http://localhost:8086
```

## Author

**Guerchi Safa** — [GitHub](https://github.com/guerchisafa-star)
