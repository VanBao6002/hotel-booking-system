# Hotel Booking System Roadmap

## Scope Strategy

- Primary goal: ship a complete MVP(minimum viable product) first.
- Secondary goal: move MVP toward production readiness in controlled steps.
- Rule: no new advanced feature until the previous milestone is tested and stable.

## Current Baseline (Done)

- Docker Compose stack runs (`frontend`, `backend`, `mysql`).
- Backend is reachable (`GET /api/hello`).
- MySQL schema and seed scripts are loaded.
- Architecture and README docs exist.

## Phase 1: Core Domain and API Foundation (Week 1-2)

### Target Outcomes

- Entity models finalized: `User`, `Hotel`, `Room`, `Booking`.
- Repository layer implemented for core entities.
- Service layer created with clear business boundaries.
- Basic validation and consistent error response format.

### Deliverables

- `model/`, `repository/`, `service/` classes for all core entities.
- Global exception handler and validation error mapping.
- Basic unit tests for service methods.

### Exit Criteria

- Entities map cleanly to DB schema.
- Core service tests pass.
- No business logic in controllers.

## Phase 2: Authentication and Authorization (Week 3)

### Target Outcomes

- Register and login API endpoints work.
- Password hashing (BCrypt) in place.
- Protected route policy defined and enforced.

### Deliverables

- `POST /api/auth/register`
- `POST /api/auth/login`
- Security config with public vs protected routes.
- Auth-focused tests for success/failure flows.

### Exit Criteria

- Unauthorized requests return proper `401/403`.
- Auth endpoints are documented and manually tested.

## Phase 3: Hotel and Room Discovery (Week 4)

### Target Outcomes

- Users can browse hotels and inspect room availability.

### Deliverables

- `GET /api/hotels`
- `GET /api/hotels/{id}`
- `GET /api/rooms/available`
- Filtering by city/date/capacity (minimum MVP fields).

### Exit Criteria

- API returns expected hotel/room payloads.
- Validation for invalid dates and parameters is enforced.

## Phase 4: Booking Workflow (Week 5)

### Target Outcomes

- Authenticated users can create and cancel bookings safely.

### Deliverables

- `POST /api/bookings`
- `GET /api/bookings/my`
- `DELETE /api/bookings/{id}`
- Booking status and overlap validation logic.

### Exit Criteria

- Double booking is prevented.
- Ownership checks prevent users from canceling others' bookings.

## Phase 5: Frontend Integration (Week 6)

### Target Outcomes

- Frontend uses real backend APIs for core user journey.

### Deliverables

- Pages: Login/Register, Hotel List, Room Search, My Bookings.
- API service layer in frontend (`axios` wrappers).
- Error and loading states for all core screens.

### Exit Criteria

- Demo flow works end-to-end from browser:
  - Login
  - Search room
  - Create booking
  - View and cancel booking

## Phase 6: MVP Stabilization and QA (Week 7)

### Target Outcomes

- MVP is stable, testable, and demo-ready.

### Deliverables

- Integration tests for auth + booking flow.
- Bug fixes from manual QA pass.
- Documentation sync (`README`, `API`, `architechture`).

### Exit Criteria

- `docker compose up --build` runs without manual recovery.
- Critical flow tests pass.
- Docs match real implementation.

## Phase 7: Production Hardening (Week 8+)

### Target Outcomes

- Improve quality closer to production standards without rewriting architecture.

### Deliverables

- Better config strategy (`dev/staging/prod` profiles).
- Structured logging and basic request tracing.
- Rate limiting and input hardening for critical APIs.
- CI checks (build + test) for pull requests.

### Exit Criteria

- Team can deploy confidently to staging.
- Regressions are caught by automated checks.

## Weekly Quality Checklist

- Feature code merged only with tests.
- API docs updated for each completed endpoint.
- Security checks done for every protected endpoint.
- One refactor item completed per week.
- One retrospective note: what broke and why.

## Prioritization Rules

1. If time is limited, complete Phases 1-6 only.
2. Do not start Phase 7 until MVP flow is complete.
3. Prefer stable simple solutions over advanced patterns.

## Responsibility Split (Learning Mode)

### AI should do

- Review architecture and API contracts.
- Identify design risks and edge cases.
- Propose test cases and code review findings.
- Help debug after you attempt first.

### You should do

- Implement controllers/services/entities.
- Write tests and run them locally.
- Fix bugs before asking for optimization.
- Keep docs and progress board updated.

## Suggested Tracking Board

Use 4 columns in your task board:

- `Backlog`
- `In Progress`
- `Review`
- `Done`

Create tickets directly from the deliverables listed per phase.
