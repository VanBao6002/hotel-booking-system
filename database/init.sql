SET NAMES utf8mb4;
ALTER DATABASE hotel_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS location (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(30) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(3) NOT NULL UNIQUE,
    country_name VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS typeroom (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS genders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    gender_name VARCHAR(20) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roomstatus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(30) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reporttype (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(30) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notificationstatus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(30) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hotelbranch (
    id INT PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    location_id INT,
    CONSTRAINT fk_hotelbranch_location FOREIGN KEY (location_id)
        REFERENCES location(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hotelreview (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_branch_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATE DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_hotelreview_hotel FOREIGN KEY (hotel_branch_id)
        REFERENCES hotelbranch(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hotelratingsummary (
    hotel_branch_id INT PRIMARY KEY,
    one_star INT DEFAULT 0,
    two_star INT DEFAULT 0,
    three_star INT DEFAULT 0,
    four_star INT DEFAULT 0,
    five_star INT DEFAULT 0,
    average_star DECIMAL(3,2) DEFAULT 0,
    CONSTRAINT fk_hotelratingsummary_hotel FOREIGN KEY (hotel_branch_id)
        REFERENCES hotelbranch(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    description TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS room_type_services (
    room_type_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (room_type_id, service_id),
    CONSTRAINT fk_room_type_services_type FOREIGN KEY (room_type_id)
        REFERENCES typeroom(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_room_type_services_service FOREIGN KEY (service_id)
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hotel_services (
    hotel_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (hotel_id, service_id),
    CONSTRAINT fk_hotel_services_hotel FOREIGN KEY (hotel_id)
        REFERENCES hotelbranch(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_hotel_services_service FOREIGN KEY (service_id)
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookingservice (
    Type_roomID INT,
    ServiceID INT,
    CONSTRAINT fk_bookingservice_type FOREIGN KEY (Type_roomID)
        REFERENCES typeroom(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_bookingservice_service FOREIGN KEY (ServiceID)
        REFERENCES services(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS room (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number INT NOT NULL,
    floor INT NOT NULL,
    area VARCHAR(30) NOT NULL,
    number_of_bed INT NOT NULL,
    price BIGINT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    room_img TEXT NOT NULL,
    hotel_branch_id INT,
    type_room_id INT,
    room_status_id INT,
    CONSTRAINT fk_room_hotelbranch FOREIGN KEY (hotel_branch_id)
        REFERENCES hotelbranch(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_room_typeroom FOREIGN KEY (type_room_id)
        REFERENCES typeroom(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_room_roomstatus FOREIGN KEY (room_status_id)
        REFERENCES roomstatus(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL UNIQUE,
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
    lock_reason VARCHAR(255) NULL,
    last_login_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id)
        REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_users_gender FOREIGN KEY (gender_id)
        REFERENCES genders(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_users_country FOREIGN KEY (country_id)
        REFERENCES countries(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    room_img TEXT NOT NULL,
    booking_price BIGINT NOT NULL DEFAULT 0,
    reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INT,
    hotel_branch_id INT,
    room_id INT,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_booking_hotelbranch_id FOREIGN KEY (hotel_branch_id) REFERENCES hotelbranch(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_booking_room_id FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_otps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    attempts INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_password_otps_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff(
    id INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL UNIQUE,
    HotelBranchID INT,
    CONSTRAINT fk_staff_user FOREIGN KEY (UserID)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_staff_branch FOREIGN KEY (HotelBranchID)
        REFERENCES hotelbranch(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historylogin(
    id INT PRIMARY KEY AUTO_INCREMENT,
    timeLogin TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UserID INT NOT NULL,
    CONSTRAINT fk_historylogin_user FOREIGN KEY (UserID)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roomprice(
    id INT PRIMARY KEY AUTO_INCREMENT,
    dateStart DATE NOT NULL,
    dateEnd DATE NOT NULL,
    price BIGINT NOT NULL,
    HotelBranchID INT,
    RoomID INT,
    CONSTRAINT fk_roomprice_hotelbranch FOREIGN KEY (HotelBranchID)
        REFERENCES hotelbranch(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_roomprice_room FOREIGN KEY (RoomID)
        REFERENCES room(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_room (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    room_id INT NOT NULL,
    CONSTRAINT fk_booking_room_booking FOREIGN KEY (booking_id)
        REFERENCES booking(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_booking_room_room FOREIGN KEY (room_id)
        REFERENCES room(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    createAt DATETIME NOT NULL,
    isBroadcast BOOLEAN NOT NULL,
    UserID INT NOT NULL,
    NotificationStatusID INT,
    CONSTRAINT fk_notification_user FOREIGN KEY (UserID)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_notification_status FOREIGN KEY (NotificationStatusID)
        REFERENCES notificationstatus(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conversation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL,
    CustomerID INT NOT NULL,
    HotelBranchID INT,
    CONSTRAINT fk_conversation_customer FOREIGN KEY (CustomerID)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_conversation_hotelbranch FOREIGN KEY (HotelBranchID)
        REFERENCES hotelbranch(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS report (
    id INT PRIMARY KEY AUTO_INCREMENT,
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    periodStart DATE NOT NULL,
    periodEnd DATE NOT NULL,
    createBy INT NOT NULL,
    HotelBranchID INT,
    reportTypeID INT,
    CONSTRAINT fk_report_user FOREIGN KEY (createBy)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_report_hotelbranch FOREIGN KEY (HotelBranchID)
        REFERENCES hotelbranch(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_report_reporttype FOREIGN KEY (reportTypeID)
        REFERENCES reporttype(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS maintenance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    RoomID INT NOT NULL UNIQUE,
    HotelBranchID INT,
    StaffID INT NOT NULL,
    CONSTRAINT fk_maintenance_room FOREIGN KEY (RoomID)
        REFERENCES room(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_maintenance_hotelbranch FOREIGN KEY (HotelBranchID)
        REFERENCES hotelbranch(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_maintenance_staff FOREIGN KEY (StaffID)
        REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS review (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment TEXT,
    rating INT NOT NULL,
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CustomerID INT NOT NULL,
    BookingID INT,
    CONSTRAINT fk_review_customer FOREIGN KEY (CustomerID)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_review_booking FOREIGN KEY (BookingID)
        REFERENCES booking(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS checkin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    checkInTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    StaffID INT NOT NULL,
    BookingID INT,
    CONSTRAINT fk_checkin_staff FOREIGN KEY (StaffID)
        REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_checkin_booking FOREIGN KEY (BookingID)
        REFERENCES booking(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS checkout (
    id INT PRIMARY KEY AUTO_INCREMENT,
    checkOutTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    StaffID INT NOT NULL,
    BookingID INT,
    CONSTRAINT fk_checkout_staff FOREIGN KEY (StaffID)
        REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_checkout_booking FOREIGN KEY (BookingID)
        REFERENCES booking(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS receipt (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paymentMethod VARCHAR(30) NOT NULL,
    amount BIGINT NOT NULL,
    paymentDate DATE NOT NULL,
    BookingID INT,
    CONSTRAINT fk_receipt_booking FOREIGN KEY (BookingID)
        REFERENCES booking(id) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS message (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    sentAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ConversationID INT,
    SenderID INT NOT NULL,
    CONSTRAINT fk_message_conversation FOREIGN KEY (ConversationID)
        REFERENCES conversation(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (SenderID)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
