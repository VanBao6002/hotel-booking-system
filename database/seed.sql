SET NAMES utf8mb4;

INSERT INTO roles (id, role_name) VALUES(1, 'USER'),(2, 'ADMIN'),(3, 'STAFF');
INSERT INTO countries (code, country_name) VALUES ('VN', 'Vietnam'), ('US', 'United States');
INSERT INTO genders (gender_name) VALUES ('Male'), ('Female');
INSERT INTO roomstatus (status) VALUES ('Available'), ('Booked'), ('Maintenance');
INSERT INTO reporttype (type) VALUES ('Daily'), ('Monthly');
INSERT INTO notificationstatus (status) VALUES ('Unread'), ('Read');
INSERT INTO location (name) VALUES
('Thanh Khê'),
('Cẩm Lệ'),
('Ngũ Hành Sơn'),
('Hai Phong');
INSERT INTO typeroom (code, name, description) VALUES
('SINGLE', 'Single Room', 'Phòng đơn dành cho 1 người, 1 giường đơn'),
('DOUBLE', 'Double Room', 'Phòng đôi dành cho 2 người, 1 giường đôi hoặc 2 giường đơn'),
('SUITE', 'Suite Room', 'Phòng cao cấp với nhiều tiện nghi hơn');



INSERT INTO hotelbranch (address, phone_number, location_id) VALUES
('123 Nguyễn Huệ, Quận 1, TP.HCM', '0909123456', 1),
('45 Lý Thường Kiệt, Hà Nội', '0912345678', 2),
('88 Trần Phú, Đà Nẵng', '0934567890', 3),
('12 Pasteur, TP.HCM', '0945678901', 1),
('22 Hoàng Diệu, Hải Phòng', '0956789012', 4);

INSERT INTO hotelratingsummary (hotel_branch_id, one_star, two_star, three_star, four_star, five_star, average_star)
VALUES
(1, 2, 3, 5, 10, 20, 4.08),
(2, 1, 2, 4, 8, 15, 4.11),
(3, 0, 1, 3, 6, 12, 4.35),
(4, 3, 2, 6, 9, 10, 3.65),
(5, 1, 1, 2, 5, 8, 4.00);


INSERT INTO users (email, password_hash, role_id, full_name, date_of_birth, gender_id, phone_number, current_address, country_id)
VALUES
('user@example.com', 'hash123', 1, 'Customer User', '1990-01-01', 1, '0909000000', 'HCM', 1),
('admin@example.com', 'hash123', 2, 'Admin User', '1995-05-05', 1, '0909111111', 'HCM', 1),
('staff@example.com', 'hash123', 3, 'Staff User', '2000-10-10', 2, '0909222222', 'HN', 1);

INSERT INTO services (name, description) VALUES
('Breakfast Buffet', 'Daily breakfast buffet at the hotel restaurant'),
('Airport Pickup', 'Pickup service from airport to hotel'),
('Spa Package', 'Relaxing spa treatment for guests'),
('Room Cleaning', 'Daily room cleaning service'),
('Laundry Service', 'Laundry and ironing service');

-- Dịch vụ chung: Buffet sáng cho khách sạn 1
INSERT INTO hotel_services (hotel_id, service_id) VALUES 
(1, 4),
(2, 5),
(3, 4),
(4, 5),
(5, 4);
-- Dịch vụ riêng: Spa chỉ dành cho Suite
INSERT INTO room_type_services (room_type_id, service_id) VALUES 
(1, 3),
(1, 2),
(1, 1),
(2, 3),
(2, 2),
(2, 1);


INSERT INTO room (area,room_number, number_of_bed,price, description, room_img, hotel_branch_id, type_room_id, floor, room_status_id)
VALUES
-- Chi nhánh 1 (TP.HCM)
('25m2',101, 1,200000, 'Phòng đơn view phố', 'room1.jpg', 1, 1, 1, 1),
('35m2',201, 2,200000, 'Phòng đôi view sông', 'room2.jpg', 1, 2, 2, 1),
('30m2',102, 1,200000, 'Phòng đơn tiêu chuẩn', 'room3.jpg', 1, 1, 1, 1),
('45m2',103, 2,200000, 'Phòng đôi cao cấp', 'room4.jpg', 1, 2, 1, 1),
('45m2',104, 2,200000, 'Phòng đôi cao cấp', 'room99.jpg', 1, 2, 1, 1),
-- Chi nhánh 2 (Hà Nội)
('28m2',202, 1,200000, 'Phòng đơn view hồ', 'room5.jpg', 2, 1, 2, 1),
('40m2',203, 2,200000, 'Phòng đôi sang trọng', 'room6.jpg', 2, 2, 2, 1),
('35m2',204, 1,200000, 'Phòng đơn tiêu chuẩn', 'room7.jpg', 2, 1, 2, 1),
-- Chi nhánh 3 (Đà Nẵng)
('32m2',105, 1,200000, 'Phòng đơn gần biển', 'room8.jpg', 3, 1, 1, 1),
('45m2',205, 2,200000, 'Phòng đôi hướng biển', 'room9.jpg', 3, 2, 2, 1),
('50m2',106, 2,200000, 'Phòng đôi VIP', 'room10.jpg', 3, 2, 1, 1),
-- Chi nhánh 4 (TP.HCM)
('27m2',107, 1,200000, 'Phòng đơn giá rẻ', 'room11.jpg', 4, 1, 1, 1),
('38m2',206, 2,200000, 'Phòng đôi tiêu chuẩn', 'room12.jpg', 4, 2, 2, 1),
-- Chi nhánh 5 (Hải Phòng)
('29m2',108, 1,200000, 'Phòng đơn view cảng', 'room13.jpg', 5, 1, 1, 1),
('42m2',207, 2,200000, 'Phòng đôi view biển', 'room14.jpg', 5, 2, 2, 1);


INSERT INTO staff (UserID, HotelBranchID) VALUES (2, 1);

-- TP.HCM chi nhánh 1
INSERT INTO booking (
    check_in_date, check_out_date, room_img,
    hotel_branch_id, room_id, user_id, booking_price
)
VALUES 
('2026-04-20', '2026-04-22', 'room2.jpg', 1, 2, 1, 500000),
('2026-04-21', '2026-04-23', 'room4.jpg', 1, 4, 2, 700000),
-- Hà Nội chi nhánh 2
('2026-04-19', '2026-04-21', 'room5.jpg', 2, 5, 3, 600000),
('2026-04-22', '2026-04-24', 'room6.jpg', 2, 6, 1, 800000),
-- Đà Nẵng chi nhánh 3
('2026-04-20', '2026-04-22', 'room9.jpg', 3, 9, 2, 550000),
('2026-04-23', '2026-04-25', 'room10.jpg', 3, 10, 3, 750000),
-- TP.HCM chi nhánh 4
('2026-04-19', '2026-04-20', 'room11.jpg', 4, 11, 1, 400000),
-- Hải Phòng chi nhánh 5
('2026-04-21', '2026-04-22', 'room14.jpg', 5, 14, 2, 650000);



INSERT INTO bookingservice ( Type_roomID, ServiceID)
VALUES ( 1, 1),
       ( 1, 3);

INSERT INTO notification (message, createAt, isBroadcast, UserID, NotificationStatusID)
VALUES ('Chào mừng bạn đến khách sạn', NOW(), FALSE, 3, 1);

INSERT INTO conversation (createAt, status, CustomerID, HotelBranchID)
VALUES (NOW(), 'Open', 3, 1);

INSERT INTO message (content, ConversationID, SenderID)
VALUES ('Xin chào, tôi muốn hỏi về phòng.', 1, 3);

INSERT INTO review (comment, rating, createAt, CustomerID, BookingID)
VALUES ('Phòng sạch sẽ, dịch vụ tốt', 5, NOW(), 3, 1);

INSERT INTO receipt (paymentMethod, amount, paymentDate, BookingID)
VALUES ('Cash', 400000, '2026-04-05', 1);








