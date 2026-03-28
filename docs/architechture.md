# Hotel Booking System Architecture (MVP)

## 1. Purpose

This document defines the architecture for the Hotel Booking System MVP and keeps a clear boundary between:

- What is implemented now
- What is planned next

The goal is to ship a usable MVP first, then iterate.

## 2. Architecture Style

- **Pattern:** Layered monolith (single backend service)
- **Frontend:** SPA (React + TypeScript)
- **Backend:** REST API (Spring Boot)
- **Database:** MySQL (single relational DB)
- **Runtime:** Docker Compose for local development

This is intentionally simple for a student MVP and can be evolved later.

## 3. High-Level System Diagram

```text
[ Browser ]
		|
		| HTTP (JSON)
		v
[ Frontend: React/Vite ]  --->  [ Backend: Spring Boot API ]  --->  [ MySQL ]
					 :5173                         :8080                         :3306
```

## 4. Current Implemented State (Verified)

### 4.1 Running Services

- `frontend` container on `http://localhost:5173`
- `backend` container on `http://localhost:8080`
- `mysql` container on `localhost:3306`

### 4.2 Backend Capabilities

- Spring Boot app starts successfully
- DB connection configured to MySQL container
- JPA configured with `ddl-auto: validate`
- One test endpoint implemented: `GET /api/hello`

### 4.3 Database State

- Schema initialized from `database/init.sql`
- Seed data loaded from `database/seed.sql`

## 5. Codebase Structure and Responsibilities

## 5.1 Frontend (`frontend/`)

- `src/` UI logic and pages
- Calls backend via `VITE_API_URL`
- Current focus: foundation and API integration

## 5.2 Backend (`backend/`)

- `controller/` REST endpoints (request/response boundary)
- `service/` business logic and orchestration
- `repository/` data access (Spring Data JPA)
- `model/` entity/domain models
- `dto/` API request/response objects

## 5.3 Database (`database/`)

- `init.sql` table/schema creation
- `seed.sql` baseline data for testing/demo

### Users Table (Current Auth-First Schema)

Purpose: stores account credentials, account status, and user profile basics.

| Column | Type | Null | Default | Key | Description |
|---|---|---|---|---|---|
| id | INT | No | AUTO_INCREMENT | PK | User identifier |
| user_name | VARCHAR(50) | Yes | - | UNIQUE | Optional username |
| email | VARCHAR(255) | No | - | UNIQUE | Login identity |
| password_hash | VARCHAR(255) | No | - | - | BCrypt password hash |
| role_id | INT | No | - | FK | Role reference |
| full_name | VARCHAR(100) | Yes | - | - | Display/full name |
| date_of_birth | DATE | Yes | - | - | Birth date |
| gender_id | INT | Yes | - | FK | Gender reference |
| phone_number | VARCHAR(20) | Yes | - | - | Contact phone |
| current_address | VARCHAR(255) | Yes | - | - | Current address |
| country_id | INT | Yes | - | FK | Country reference |
| is_active | BOOLEAN | No | TRUE | - | Account enabled/disabled |
| failed_login_attempts | INT | No | 0 | - | Failed login counter |
| locked_until | DATETIME | Yes | NULL | - | Account lock expiry |
| last_login_at | DATETIME | Yes | NULL | - | Last successful login |
| created_at | TIMESTAMP | No | CURRENT_TIMESTAMP | - | Creation time |
| updated_at | TIMESTAMP | No | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | - | Last update time |

Relationships:
- `users.role_id -> roles.id`
- `users.gender_id -> genders.id`
- `users.country_id -> countries.id`

Indexes:
- `idx_users_role_id`
- `idx_users_gender_id`
- `idx_users_country_id`

## 5.4 Infrastructure (`docker-compose.yml`)

- Multi-container local environment
- Startup dependency on MySQL health check

## 6. Data and Request Flow

## 6.1 Read Flow (Current)

1. Browser requests frontend page.
2. Frontend calls backend API.
3. Backend controller handles request.
4. Service (when implemented) applies business rules.
5. Repository accesses MySQL.
6. Response returns as JSON/text.

## 6.2 Booking Flow (MVP Target)

1. User searches hotels/rooms.
2. User selects room and dates.
3. Backend validates availability.
4. Backend creates booking record.
5. Frontend shows booking confirmation.

## 7. Security Architecture

## 7.1 Current

- Spring Security dependency/config exists
- Suitable for baseline API protection experiments

## 7.2 MVP Target

- Public endpoints: register, login, hotels list/search
- Protected endpoints: create booking, user bookings, cancel booking
- Passwords stored hashed (BCrypt)
- Token-based authentication (JWT)

## 8. API Architecture

## 8.1 Implemented Endpoint

- `GET /api/hello`

## 8.2 Planned MVP Endpoint Groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/hotels`
- `GET /api/hotels/{id}`
- `GET /api/rooms/available`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `DELETE /api/bookings/{id}`

Keep this section updated only when endpoints are actually implemented.

## 9. Deployment and Environments

## 9.1 Local Development (Current)

- Docker Compose builds and runs all services
- Recommended for team consistency

## 9.2 Future Environments (Post-MVP)

- Staging environment
- Production environment
- CI/CD pipeline

These are out of MVP scope for now.

## 10. Non-Functional Goals (MVP)

- **Reliability:** Services start consistently with Compose
- **Maintainability:** Clear layered backend structure
- **Observability:** Basic logs for backend debugging
- **Simplicity:** Avoid overengineering in MVP phase

## 11. Architecture Decisions

1. **Single backend service first**
	 - Reason: faster delivery, lower complexity for MVP.
2. **MySQL relational model**
	 - Reason: bookings/rooms/users have clear relational structure.
3. **Docker-first local environment**
	 - Reason: reproducible setup across team machines.

## 12. Risks and Mitigations

- **Risk:** Scope creep from advanced features.
	- **Mitigation:** Implement only MVP endpoints first.
- **Risk:** Security partially configured but not fully tested.
	- **Mitigation:** Add auth integration tests before release.
- **Risk:** Inaccurate docs vs real code.
	- **Mitigation:** Update this file after each completed feature.

## 13. Update Log

- `2026-03-08`: Initial MVP architecture document created and aligned with current codebase state.
- `2026-03-24`: Added users table schema dictionary and DB relationship details aligned with `database/init.sql`.

## 14. Delivery Plan

Execution milestones are tracked in `docs/ROADMAP.md`.
