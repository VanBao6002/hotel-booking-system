-- Tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa bảng con trước (phụ thuộc nhiều khóa ngoại)
TRUNCATE TABLE bookingservice;
TRUNCATE TABLE historylogin;
TRUNCATE TABLE notification;
TRUNCATE TABLE message;
TRUNCATE TABLE review;
TRUNCATE TABLE checkin;
TRUNCATE TABLE checkout;
TRUNCATE TABLE receipt;
TRUNCATE TABLE maintenance;
TRUNCATE TABLE report;
TRUNCATE TABLE conversation;
TRUNCATE TABLE roomprice;

-- Xóa bảng trung gian
TRUNCATE TABLE booking;
TRUNCATE TABLE staff;

-- Xóa bảng chính
TRUNCATE TABLE services;
TRUNCATE TABLE room;
TRUNCATE TABLE hotelbranch;
TRUNCATE TABLE users;

-- Xóa bảng danh mục (lookup tables)
TRUNCATE TABLE roles;
TRUNCATE TABLE countries;
TRUNCATE TABLE genders;
TRUNCATE TABLE locations;
TRUNCATE TABLE typeroom;
TRUNCATE TABLE roomstatus;
TRUNCATE TABLE reporttype;
TRUNCATE TABLE notificationstatus;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;