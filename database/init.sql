CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS genders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender_id INT,
    phone_number VARCHAR(20),
    current_address VARCHAR(255),
    country_id INT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    last_login_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_users_gender FOREIGN KEY (gender_id) REFERENCES genders(id),
    CONSTRAINT fk_users_country FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_gender_id ON users(gender_id);
CREATE INDEX idx_users_country_id ON users(country_id);

-- Ensure hotel_user has correct password and permissions
DROP USER IF EXISTS 'hotel_user'@'%';
DROP USER IF EXISTS 'hotel_user'@'localhost';
CREATE USER 'hotel_user'@'%' IDENTIFIED WITH mysql_native_password BY 'hotel_pass';
CREATE USER 'hotel_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'hotel_pass';
GRANT ALL PRIVILEGES ON hotel_booking.* TO 'hotel_user'@'%';
GRANT ALL PRIVILEGES ON hotel_booking.* TO 'hotel_user'@'localhost';
FLUSH PRIVILEGES;

