# 🏨 Hotel Booking System

A modern, full-stack hotel booking MVP built with Spring Boot, static HTML/CSS/JavaScript, and MySQL. The project is currently in setup and core API development stage.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/team/hotel-booking)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.11-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-blue.svg)](#frontend)

## ✨ Features

### Core Functionality
- ✅ **Backend Service Running** - Spring Boot app is up and reachable at `/api/hello`
- ✅ **Database Ready** - MySQL schema and seed data are loaded from SQL scripts
- ✅ **Frontend Running** - Static HTML/CSS/JavaScript app is running via `http-server`
- 🔄 **Authentication API** - Register/login endpoints are in progress
- 🔄 **Hotel & Room APIs** - Listing and availability endpoints are in progress
- 🔄 **Booking Flow** - Create/view/cancel booking APIs are in progress

### Technical Features
- 🚀 **REST API Foundation** - Basic Spring Boot REST setup with OpenAPI/Swagger enabled
- 🔒 **Security Baseline** - Spring Security configured for MVP API testing
- 🐳 **Containerized** - Docker Compose setup for frontend, backend, and MySQL
- 📱 **Frontend Foundation** - Static UI modules are ready for API integration
- 🧪 **Backend Testing Support** - Maven test setup is available

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.11
- **Language:** Java 17
- **Security:** Spring Security (JWT flow not implemented yet)
- **Database:** MySQL 8.0
- **ORM:** Spring Data JPA (Hibernate)
- **Validation:** Bean Validation (Hibernate Validator)
- **API Docs:** SpringDoc OpenAPI 3
- **Build Tool:** Maven 3.9
- **Dev Tools:** Spring DevTools, Lombok

### Frontend
- **Architecture:** Static web app (single HTML entry + modular JS)
- **Languages:** HTML5, CSS3, JavaScript (ES Modules)
- **Static Server:** `http-server` (Node 20 container)
- **UI Assets:** Font Awesome 7.2, custom CSS modules
- **Build Step:** Not required for current frontend

### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **Database:** MySQL 8.0
- **Version Control:** Git

## 🚀 Quick Start

### Prerequisites
- **Docker** (v20.10+) & **Docker Compose** (v2.0+)
- **Git**
- *Optional for local development:*
  - Java 17+ (for backend)
  - Node.js 20+ (for frontend)
  - Maven 3.9+ (for backend)

### Installation

#### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/team/hotel-booking.git
   cd hotel-booking-system
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   *(Optional: Edit `.env` with your custom configuration)*

3. **Start all services**
   ```bash
   docker compose up --build
   ```
   
   **First-time setup takes 3-5 minutes** (downloading images, building, initializing database)

4. **Verify services are running**
   ```bash
   docker compose ps
   ```

5. **Access the application**
   - 🌐 **Frontend:** http://localhost:3000
   - 🔧 **Backend API:** http://localhost:8080/api/hello
   - 📚 **API Documentation:** http://localhost:8080/swagger-ui.html
   - 📊 **OpenAPI Spec:** http://localhost:8080/v3/api-docs

#### Option 2: Local Development

**Backend:**
```bash
# Run this from project root first
docker compose up mysql -d

# Then go to backend
cd backend

# Run Spring Boot application
./mvnw spring-boot:run

# Or for Windows
mvnw.cmd spring-boot:run
```

**Frontend:**
```bash
cd frontend

# Option A: Run with Python static server
python3 -m http.server 3000

# Option B: Run with Node (without global install)
npx http-server . -p 3000
```

## 📁 Project Structure

```
hotel-booking-system/
├── backend/                      # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hotel/booking/
│   │   │   │   ├── HotelBookingApplication.java
│   │   │   │   ├── controller/   # REST Controllers
│   │   │   │   ├── service/      # Business Logic
│   │   │   │   ├── model/        # JPA Entities
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   └── repository/   # Database Repositories
│   │   │   └── resources/
│   │   │       ├── application.yaml
│   │   │       └── static/
│   │   └── test/                 # Unit & Integration Tests
│   ├── Dockerfile
│   ├── .dockerignore
│   └── pom.xml                   # Maven Configuration
│
├── frontend/                     # Static Frontend
│   ├── index.html                # Main UI entry point
│   ├── css/                      # Stylesheets
│   ├── js/                       # JavaScript modules
│   │   └── components/           # UI component scripts
│   ├── assets/                   # Images, fonts, icons
│   ├── Dockerfile
│   ├── .dockerignore
│   └── node_modules/             # Local static server dependencies
│
├── database/                     # Database Scripts
│   ├── init.sql                  # Schema Definition
│   └── seed.sql                  # Sample Data
│
├── docs/                         # Documentation
│   └── API.md                    # API Documentation
│
├── .env.example                  # Environment Template
├── .gitignore
├── .gitattributes
├── docker-compose.yml            # Docker Services
└── readme.md
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_NAME=hotel_booking
DB_USER=hotel_user
DB_PASS=hotel_pass
DB_ROOT_PASSWORD=rootpass

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production-min-256-bits
JWT_EXPIRATION=86400000

# API Configuration
API_BASE_URL=http://localhost:8080
```

### Application Configuration

**Backend:** `backend/src/main/resources/application.yaml`
- Database connection
- JPA/Hibernate settings
- Server port
- Logging levels

**Frontend:** `frontend/index.html`, `frontend/css/`, `frontend/js/`
- Static markup and layout structure
- Styles and component-level UI behavior
- Client-side module wiring

## 🗄️ Database Schema

The system uses MySQL with the following main tables:

- **users** - User accounts and authentication
- **hotels** - Hotel information and details
- **rooms** - Room types, pricing, and availability
- **bookings** - Reservation records and status

See `database/init.sql` for complete schema definition.

### Sample Data

The database is initialized with sample data:
- 3 test users (password: `password123`)
- 5 hotels across different cities
- 20+ rooms with various types and prices
- Sample bookings for demonstration

## 📝 API Documentation

For complete API endpoint documentation, request/response examples, and authentication details, see [docs/API.md](docs/API.md).

For interactive API testing, visit the **Swagger UI** at http://localhost:8080/swagger-ui.html or the **OpenAPI spec** at http://localhost:8080/v3/api-docs

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report

# Run specific test
./mvnw test -Dtest=TestClassName
```

### Frontend Tests
```bash
cd frontend

# Run static frontend locally
python3 -m http.server 3000

# Then open http://localhost:3000 and verify UI interactions manually
```

## 🚢 Deployment

### MVP Docker Deployment (Local)

```bash
# Current deployment target (MVP local environment)
docker compose up --build -d
docker compose ps
docker compose logs -f
```

### Environment-Specific Deployment

1. Update `.env` with secure credentials
2. Set `JWT_SECRET` to a strong random value
3. Configure external MySQL if needed
4. Add HTTPS/SSL when moving to production
5. Add logging and monitoring in a later stage

## 🐛 Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Check what's using the port
sudo lsof -i :8080  # For backend
sudo lsof -i :3000  # For frontend
sudo lsof -i :3307  # For MySQL (host)

# Stop conflicting services or change ports in docker-compose.yml
```

**2. Database connection failed**
```bash
# Ensure MySQL container is healthy
docker compose ps

# Check MySQL logs
docker compose logs mysql

# Restart MySQL
docker compose restart mysql
```

**3. Frontend can't connect to backend**
- Check frontend API integration code (if added) points to `http://localhost:8080`
- Verify backend is running: http://localhost:8080/api/hello
- Check CORS configuration in backend

**4. Line ending warnings (Windows)**
```bash
# Apply line ending normalization
git add --renormalize .
git commit -m "Normalize line endings"
```

**5. Build fails in Docker**
```bash
# Clean and rebuild
docker compose down -v
docker compose build --no-cache
docker compose up
```

### Health Checks

```bash
# Check container health
docker compose ps

# Backend health
curl http://localhost:8080/api/hello

# Database connection
docker compose exec mysql mysql -uhotel_user -photel_pass -e "SELECT 1"
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch (default)
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Code Style
- **Java:** Follow Google Java Style Guide
- **Frontend (HTML/CSS/JS):** Follow clean modular structure and naming conventions
- Use a formatter/linter as the frontend grows (optional in current MVP stage)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- Open-source frontend tooling community (Font Awesome, normalize.css, http-server)
- All contributors who help improve this project

## 📞 Support

For issues, questions, or suggestions:
- 📧 Email: support@hotel-booking.com
- 🐛 Issues: [GitHub Issues](https://github.com/team/hotel-booking/issues)
- 📖 Documentation: [Wiki](https://github.com/team/hotel-booking/wiki)

## 🗺️ Roadmap

- [ ] Email notifications for bookings
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Review and rating system
- [ ] Advanced analytics
- [ ] Loyalty program

---
