# 🏨 Hotel Booking System - Project Structure Explained
## Bilingual Documentation (English & Vietnamese)

---

## 📋 Table of Contents

1. [Backend Structure](#backend-structure)
2. [Database Layer](#database-layer)
3. [Docker Orchestration](#docker-orchestration)
4. [Documentation](#documentation)
5. [Frontend Structure](#frontend-structure)
6. [Request Flow Diagram](#request-flow-diagram)

---

## Backend Structure

### Overview
**What it does:** Provides REST API endpoints that the frontend calls. Handles all business logic, database operations, and user requests.

**Trách nhiệm:** Cung cấp các API endpoints mà frontend gọi. Xử lý logic business, operations database, và requests từ user.

---

### `backend/Dockerfile`

**English:**
- Containerizes the Spring Boot application
- Specifies how to build a Docker image with Java 17, Maven, and the compiled app
- Used by `docker-compose up --build` to create the backend container

**Tiếng Việt:**
- Đóng gói ứng dụng Spring Boot vào container
- Chỉ định cách build image Docker với Java 17, Maven, và compiled app
- Được sử dụng bởi `docker-compose up --build` để tạo backend container

---

### `backend/pom.xml`

**English:**
- Maven configuration file
- Lists all dependencies (Spring Boot, JPA, MySQL driver, etc.)
- Defines build settings and plugin configurations
- Run `mvnw clean install` to download dependencies and compile

**Tiếng Việt:**
- File cấu hình Maven
- Liệt kê tất cả dependencies (Spring Boot, JPA, MySQL driver, etc.)
- Định nghĩa build settings và plugin configurations
- Chạy `mvnw clean install` để tải dependencies và compile

---

### `backend/mvnw` & `backend/mvnw.cmd`

**English:**
- Maven Wrapper scripts for cross-platform builds
- `mvnw` = Linux/macOS version
- `mvnw.cmd` = Windows version
- No need to install Maven globally; these scripts handle it

**Tiếng Việt:**
- Maven Wrapper scripts cho builds cross-platform
- `mvnw` = phiên bản Linux/macOS
- `mvnw.cmd` = phiên bản Windows
- Không cần cài Maven toàn cục; scripts này xử lý tất cả

---

### `backend/src/main/java/com/hotel/booking/HotelBookingApplication.java`

**English:**
- Entry point of the Spring Boot application
- Contains `public static void main()` that starts the app
- Configures Spring annotations: `@SpringBootApplication`
- Runs on port 8080 by default

**Tiếng Việt:**
- Điểm khởi động của ứng dụng Spring Boot
- Chứa `public static void main()` khởi động app
- Cấu hình Spring annotations: `@SpringBootApplication`
- Chạy trên port 8080 mặc định

---

### `backend/src/main/java/com/hotel/booking/config/SecurityConfig.java`

**English:**
- Configures Spring Security settings
- Defines JWT authentication flow
- Sets up CORS (Cross-Origin Resource Sharing) for frontend communication
- Protects API endpoints with authentication decorators
- Manages password encoding and token validation

**Tiếng Việt:**
- Cấu hình Spring Security settings
- Định nghĩa JWT authentication flow
- Set up CORS (Cross-Origin Resource Sharing) cho frontend communication
- Bảo vệ API endpoints với authentication decorators
- Quản lý password encoding và token validation

---

### `backend/src/main/java/com/hotel/booking/controller/`

**English:**
- HTTP Request Handlers - Receive incoming requests and send responses
- Each controller maps to a URL path (e.g., `/api/hotels`, `/api/bookings`)
- Uses `@RestController` and `@RequestMapping` annotations
- Example: `TestController.java` has `GET /api/hello` endpoint
- Parses request body, calls Service layer, returns JSON responses

**Tiếng Việt:**
- HTTP Request Handlers - Tiếp nhận incoming requests và gửi responses
- Mỗi controller map tới một URL path (ví dụ: `/api/hotels`, `/api/bookings`)
- Sử dụng `@RestController` và `@RequestMapping` annotations
- Ví dụ: `TestController.java` có endpoint `GET /api/hello`
- Phân tích request body, gọi Service layer, trả về JSON responses

---

### `backend/src/main/java/com/hotel/booking/service/`

**English:**
- Business Logic Layer - Contains the "rules" of your application
- Validates input data (e.g., email format, booking dates)
- Performs calculations (e.g., total price, occupancy)
- Checks constraints (e.g., room availability)
- Calls Repository to fetch/save data
- **Concurrency handling:** Where you implement `@Transactional`, `@Version`, locks

**Tiếng Việt:**
- Business Logic Layer - Chứa "rules" của ứng dụng
- Validate input data (ví dụ: email format, booking dates)
- Thực hiện calculations (ví dụ: total price, occupancy)
- Kiểm tra constraints (ví dụ: room availability)
- Gọi Repository để fetch/save data
- **Concurrency handling:** Nơi bạn implement `@Transactional`, `@Version`, locks

---

### `backend/src/main/java/com/hotel/booking/repository/`

**English:**
- Database Access Layer - Executes SQL queries
- Extends `JpaRepository<Entity, ID>` from Spring Data
- Provides built-in methods: `findById()`, `save()`, `delete()`, `findAll()`
- Write custom JPQL queries with `@Query` annotation
- Example: `UserRepository.findByEmail(String email)`
- Returns data from database to Service layer

**Tiếng Việt:**
- Database Access Layer - Thực thi SQL queries
- Extends `JpaRepository<Entity, ID>` từ Spring Data
- Cung cấp built-in methods: `findById()`, `save()`, `delete()`, `findAll()`
- Viết custom JPQL queries với `@Query` annotation
- Ví dụ: `UserRepository.findByEmail(String email)`
- Trả về data từ database tới Service layer

---

### `backend/src/main/java/com/hotel/booking/model/`

**English:**
- JPA Entity classes - Java representations of database tables
- Example entities: `User`, `Hotel`, `Room`, `Booking`
- Annotated with `@Entity`, `@Table`, `@Column`
- Use `@Version` for optimistic locking (concurrency control)
- Define relationships: `@OneToMany`, `@ManyToOne`, `@OneToOne`

**Tiếng Việt:**
- JPA Entity classes - Java representations của database tables
- Example entities: `User`, `Hotel`, `Room`, `Booking`
- Annotated với `@Entity`, `@Table`, `@Column`
- Sử dụng `@Version` cho optimistic locking (concurrency control)
- Định nghĩa relationships: `@OneToMany`, `@ManyToOne`, `@OneToOne`

---

### `backend/src/main/java/com/hotel/booking/dto/`

**English:**
- Data Transfer Objects - Schemas for request/response bodies
- Don't expose internal entity structure to frontend
- Example: `RegisterRequest` (email, password), `HotelDTO` (id, name, city)
- Separates API contract from database structure
- Include validation annotations: `@NotNull`, `@Email`, `@Size`

**Tiếng Việt:**
- Data Transfer Objects - Schemas cho request/response bodies
- Không expose internal entity structure sang frontend
- Ví dụ: `RegisterRequest` (email, password), `HotelDTO` (id, name, city)
- Tách API contract khỏi database structure
- Bao gồm validation annotations: `@NotNull`, `@Email`, `@Size`

---

### `backend/src/main/resources/application.yaml`

**English:**
- Application configuration file
- Database connection: `spring.datasource.url`, `spring.datasource.username`
- Server port: `server.port=8080`
- JPA settings: `spring.jpa.hibernate.ddl-auto=update`
- JWT secret and expiration time
- Logging levels

**Tiếng Việt:**
- Application configuration file
- Database connection: `spring.datasource.url`, `spring.datasource.username`
- Server port: `server.port=8080`
- JPA settings: `spring.jpa.hibernate.ddl-auto=update`
- JWT secret và expiration time
- Logging levels

---

### `backend/src/test/java/`

**English:**
- Unit and integration tests
- Test business logic without running the full app
- Use `@SpringBootTest` for integration tests
- Mock dependencies with `@MockBean`
- Verify expected behavior with assertions

**Tiếng Việt:**
- Unit và integration tests
- Test business logic mà không run full app
- Sử dụng `@SpringBootTest` cho integration tests
- Mock dependencies với `@MockBean`
- Verify expected behavior với assertions

---

### `backend/target/`

**English:** ⚠️ **Auto-generated - Don't Edit**
- Compiled Java bytecode (`.class` files)
- Generated by Maven when you build
- Deleted automatically with `mvn clean`
- Safe to ignore in version control (add to `.gitignore`)

**Tiếng Việt:** ⚠️ **Auto-generated - Không Chỉnh Sửa**
- Compiled Java bytecode (`.class` files)
- Generated bởi Maven khi bạn build
- Deleted tự động với `mvn clean`
- An toàn để ignore trong version control (add vào `.gitignore`)

---

## Database Layer

### `database/init.sql`

**English:**
- Creates database tables when Docker container starts
- Define schema: `CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100), ...)`
- Sets up constraints: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE
- Tables: `users`, `hotels`, `rooms`, `bookings`
- Executed once at container startup

**Tiếng Việt:**
- Tạo database tables khi Docker container starts
- Định nghĩa schema: `CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100), ...)`
- Set up constraints: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE
- Tables: `users`, `hotels`, `rooms`, `bookings`
- Executed một lần tại container startup

---

### `database/seed.sql`

**English:**
- Inserts sample/test data into tables
- Example: 3 test users with password `password123`
- Creates 5 sample hotels in different cities
- Adds 20+ rooms with various types (Single, Double, Suite)
- Provides test bookings for development
- **Only for development** - remove in production

**Tiếng Việt:**
- Inserts sample/test data vào tables
- Ví dụ: 3 test users với password `password123`
- Tạo 5 sample hotels ở các thành phố khác nhau
- Thêm 20+ rooms với various types (Single, Double, Suite)
- Cung cấp test bookings cho development
- **Chỉ cho development** - xoá trong production

---

## Docker Orchestration

### `docker-compose.yml`

**English:**
- Orchestrates 3 services: Backend, Frontend, MySQL
- Defines `backend` service (port 8080, Spring Boot)
- Defines `frontend` service (port 5173, React/Vite)
- Defines `mysql` service (port 3306, database)
- Links services with volume mounts
- Command: `docker compose up --build` starts all 3

**Tiếng Việt:**
- Điều phối 3 services: Backend, Frontend, MySQL
- Định nghĩa `backend` service (port 8080, Spring Boot)
- Định nghĩa `frontend` service (port 5173, React/Vite)
- Định nghĩa `mysql` service (port 3306, database)
- Links services với volume mounts
- Command: `docker compose up --build` starts all 3

---

## Documentation

### `docs/API.md`

**English:**
- Complete REST API reference for developers
- All endpoints: Authentication, Hotels, Rooms, Bookings, Check-in/out
- Request/response examples with JSON bodies
- Status codes and error messages
- Authentication headers (Bearer token, JWT)
- Interactive: Links to Swagger UI and OpenAPI spec

**Tiếng Việt:**
- Complete REST API reference cho developers
- Tất cả endpoints: Authentication, Hotels, Rooms, Bookings, Check-in/out
- Request/response examples với JSON bodies
- Status codes và error messages
- Authentication headers (Bearer token, JWT)
- Interactive: Links tới Swagger UI và OpenAPI spec

---

### `docs/ROADMAP.md`

**English:**
- Phase-based development milestones
- Phase 1: Authentication (Register, Login)
- Phase 2: Hotel & Room APIs
- Phase 3: Booking & Reservations
- Phase 4: Check-in/Check-out
- Phase 5+: Advanced features (payments, analytics)

**Tiếng Việt:**
- Phase-based development milestones
- Phase 1: Authentication (Register, Login)
- Phase 2: Hotel & Room APIs
- Phase 3: Booking & Reservations
- Phase 4: Check-in/Check-out
- Phase 5+: Advanced features (payments, analytics)

---

### `docs/architechture.md`

**English:**
- System design and architecture decisions
- 3-layer pattern: Controller → Service → Repository
- MVP scope and current implementation status
- Security approach (JWT, Spring Security)
- Database design and relationships
- Concurrency control strategy

**Tiếng Việt:**
- System design và architecture decisions
- 3-layer pattern: Controller → Service → Repository
- MVP scope và current implementation status
- Security approach (JWT, Spring Security)
- Database design và relationships
- Concurrency control strategy

---

## Frontend Structure

### Overview
**What it does:** Renders the user interface that users interact with. Calls backend APIs to fetch/save data.

**Trách nhiệm:** Render giao diện user tương tác. Gọi backend APIs để fetch/save data.

---

### `frontend/Dockerfile`

**English:**
- Containerizes the React/Vite application
- Build stage: `npm install` + `npm run build`
- Production stage: Serves compiled files with a web server
- Runs on port 5173 inside container

**Tiếng Việt:**
- Containerizes React/Vite application
- Build stage: `npm install` + `npm run build`
- Production stage: Serves compiled files với web server
- Chạy trên port 5173 bên trong container

---

### `frontend/package.json`

**English:**
- Lists all npm dependencies (React, TypeScript, Axios, etc.)
- Defines build scripts: `npm run dev`, `npm run build`, `npm run lint`
- Scripts run locally and inside Docker container

**Tiếng Việt:**
- Liệt kê tất cả npm dependencies (React, TypeScript, Axios, etc.)
- Định nghĩa build scripts: `npm run dev`, `npm run build`, `npm run lint`
- Scripts chạy locally và bên trong Docker container

---

### `frontend/src/components/`

**English:**
- Reusable React components
- Examples: `Button.tsx`, `Modal.tsx`, `HotelCard.tsx`, `Header.tsx`
- Small, focused components for single-use cases
- Exported as `export default HotelCard`
- Can receive props and emit events

**Tiếng Việt:**
- Reusable React components
- Ví dụ: `Button.tsx`, `Modal.tsx`, `HotelCard.tsx`, `Header.tsx`
- Small, focused components cho single-use cases
- Exported as `export default HotelCard`
- Có thể receive props và emit events

---

### `frontend/src/pages/`

**English:**
- Full page components (not UI elements)
- Examples: `HomePage.tsx`, `HotelsPage.tsx`, `BookingPage.tsx`, `AccountPage.tsx`
- Top-level components that render in Router
- Combine smaller components to form complete pages
- Fetch data from API services

**Tiếng Việt:**
- Full page components (không phải UI elements)
- Ví dụ: `HomePage.tsx`, `HotelsPage.tsx`, `BookingPage.tsx`, `AccountPage.tsx`
- Top-level components render trong Router
- Kết hợp smaller components tạo complete pages
- Fetch data từ API services

---

### `frontend/src/services/`

**English:**
- API integration layer
- Functions to call backend: `api.getHotels()`, `api.bookRoom(data)`, `api.login(credentials)`
- Uses Axios to make HTTP requests
- Handles response transformation and error handling
- Centralized place for all API logic

**Tiếng Việt:**
- API integration layer
- Functions để gọi backend: `api.getHotels()`, `api.bookRoom(data)`, `api.login(credentials)`
- Sử dụng Axios tạo HTTP requests
- Xử lý response transformation và error handling
- Centralized place cho tất cả API logic

---

### `frontend/src/utils/`

**English:**
- Helper functions used across the app
- Examples: `formatDate()`, `validateEmail()`, `calculatePrice()`
- Pure functions with no side effects
- Examples: string formatting, form validation, calculations
- Exported for reuse: `export const formatDate = ...`

**Tiếng Việt:**
- Helper functions sử dụng across app
- Ví dụ: `formatDate()`, `validateEmail()`, `calculatePrice()`
- Pure functions không có side effects
- Ví dụ: string formatting, form validation, calculations
- Exported để reuse: `export const formatDate = ...`

---

### `frontend/src/App.tsx`

**English:**
- Root component of the React app
- Sets up routing using React Router
- Renders layout components (Header, Sidebar, Footer)
- Manages global state if using Context API
- Example: `<Routes>`, `<Route path="/hotels" element={<HotelsPage />}`

**Tiếng Việt:**
- Root component của React app
- Set up routing sử dụng React Router
- Render layout components (Header, Sidebar, Footer)
- Manage global state nếu sử dụng Context API
- Ví dụ: `<Routes>`, `<Route path="/hotels" element={<HotelsPage />}`

---

### `frontend/src/main.tsx`

**English:**
- JavaScript entry point
- Loads React and mounts the app into HTML
- Code: `ReactDOM.createRoot(document.getElementById('root')).render(<App />`
- Runs once when page loads
- Connects `App.tsx` to `index.html`'s `<div id="root">`

**Tiếng Việt:**
- JavaScript entry point
- Loads React và mounts app vào HTML
- Code: `ReactDOM.createRoot(document.getElementById('root')).render(<App />`
- Chạy một lần khi page loads
- Kết nối `App.tsx` với `index.html`'s `<div id="root">`

---

### `frontend/src/index.css` & `frontend/src/App.css`

**English:**
- Global and component-specific styles
- `index.css`: Font, colors, reset styles
- `App.css`: Layout styles for main app
- Can use Tailwind CSS classes instead
- Responsive design with `@media` queries

**Tiếng Việt:**
- Global và component-specific styles
- `index.css`: Font, colors, reset styles
- `App.css`: Layout styles cho main app
- Có thể sử dụng Tailwind CSS classes thay thế
- Responsive design với `@media` queries

---

### `frontend/index.html`

**English:**
- HTML entry point
- Contains `<div id="root"></div>` where React mounts
- Links to CSS and JavaScript
- Sets meta tags, favicon, title
- Structure:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hotel Booking System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Tiếng Việt:**
- HTML entry point
- Chứa `<div id="root"></div>` nơi React mounts
- Links tới CSS và JavaScript
- Sets meta tags, favicon, title
- Structure:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hotel Booking System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### `frontend/node_modules/`

**English:** ⚠️ **Auto-generated - Don't Edit**
- Contains 3000+ npm dependency packages
- Downloaded by `npm install`
- Can be deleted safely and regenerated
- Add to `.gitignore` (ignored in version control)
- Very large folder (~500 MB)

**Tiếng Việt:** ⚠️ **Auto-generated - Không Chỉnh Sửa**
- Chứa 3000+ npm dependency packages
- Downloaded bởi `npm install`
- Có thể deleted safely và regenerated
- Add vào `.gitignore` (ignored trong version control)
- Rất lớn folder (~500 MB)

---

### `frontend/public/`

**English:**
- Static assets served as-is (no processing)
- favicon.ico, images, JSON files
- Accessed at root path: `/favicon.ico`, `/assets/image.png`
- Can copy files here for direct access

**Tiếng Việt:**
- Static assets served as-is (không process)
- favicon.ico, images, JSON files
- Accessed ở root path: `/favicon.ico`, `/assets/image.png`
- Có thể copy files ở đây cho direct access

---

## Request Flow Diagram

### How a Booking Request Travels Through the System

```
┌─────────────────────────────────────────────────────────────────┐
│ 1️⃣  FRONTEND (React)                                            │
│ ──────────────────────────────────────────────────────────────  │
│ User clicks "Book Hotel" button in HotelsPage.tsx              │
│ → Calls hotelService.bookRoom(roomId, userId)                  │
│ → Makes HTTP POST request to /api/bookings                      │
│ → Sends JSON: { "roomId": 101, "userId": 5, "dates": [...] }  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP Request
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2️⃣  CONTROLLER (Request Handler)                               │
│ ──────────────────────────────────────────────────────────────  │
│ BookingController receives POST /api/bookings                   │
│ → Extracts request body: BookingDTO                             │
│ → Calls bookingService.createBooking(dto)                       │
│ → Returns response to frontend                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3️⃣  SERVICE (Business Logic)                                   │
│ ──────────────────────────────────────────────────────────────  │
│ BookingService.createBooking(BookingDTO)                        │
│ → Validate: Check email, dates, room availability               │
│ → Check: Does user exist? Is room available?                    │
│ → Calculate: Total price = room.price * nights                  │
│ → Execute: @Transactional to ensure atomicity                   │
│ → Call: roomRepository.findById() + bookingRepository.save()    │
│ → Return: BookingResponse with confirmation number              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4️⃣  REPOSITORY (Database Access)                               │
│ ──────────────────────────────────────────────────────────────  │
│ BookingRepository.save(booking)                                 │
│ → Executes SQL: INSERT INTO bookings VALUES (...)               │
│ → RoomRepository.updateAvailability(roomId, -1)                │
│ → Executes SQL: UPDATE rooms SET available_count = available... │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Database Updated
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5️⃣  DATABASE (MySQL)                                           │
│ ──────────────────────────────────────────────────────────────  │
│ ✅ Booking inserted into `bookings` table                       │
│ ✅ Room availability updated in `rooms` table                   │
│ → Returns success status to Repository                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Response Object
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ RESPONSE RETURNS (Step 2→1)                                      │
│ ──────────────────────────────────────────────────────────────  │
│ Controller returns JSON:                                         │
│ {                                                                │
│   "bookingId": 12345,                                            │
│   "status": "CONFIRMED",                                         │
│   "totalPrice": 299.99,                                          │
│   "confirmationNumber": "HB-2026-0123456"                        │
│ }                                                                │
│ → HTTP 200 OK response sent to Frontend                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP Response
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6️⃣  FRONTEND DISPLAYS RESULT                                    │
│ ──────────────────────────────────────────────────────────────  │
│ React component receives response                               │
│ → Shows success message: "Booking confirmed!"                   │
│ → Displays confirmation number to user                          │
│ → Redirects to confirmation page                                │
│ → User sees booking details                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibility Summary Table

| Component | Responsibility | Responds To | Returns |
|-----------|---|---|---|
| **Controller** | Parse HTTP request | Frontend HTTP request | JSON response + HTTP status |
| **Service** | Business logic | Controller | Processed data/result |
| **Repository** | Database queries | Service | Database records |
| **Model** | Data structure | Repository | JPA Entity object |
| **DTO** | Data transfer format | Controller/Service | Request/Response shape |
| **Frontend Page** | Render UI | User interaction | HTML/React DOM |
| **Frontend Service** | API calls | Page component | HTTP response data |
| **Frontend Component** | Single UI element | Parent component | Rendered JSX |

---

## Key Takeaways

### Backend (Java)
- ✅ Receives HTTP requests from frontend
- ✅ Validates data (Service layer)
- ✅ Fetches/saves to database (Repository)
- ✅ Returns JSON responses
- ✅ Handles concurrency with `@Transactional`, `@Version`

### Frontend (React)
- ✅ Renders user interface
- ✅ Calls backend API for data
- ✅ Displays responses to users
- ✅ Handles form submissions
- ✅ Manages local state

### Database (MySQL)
- ✅ Stores data permanently
- ✅ Enforces constraints (PRIMARY KEY, FOREIGN KEY)
- ✅ Executes SQL queries from Repository
- ✅ Maintains data integrity

---

**Created:** March 2026  
**For:** Hotel Booking System MVP  
**Language:** Bilingual (English & Tiếng Việt)
