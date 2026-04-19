INSERT INTO roles (role_name) VALUES ('Admin'), ('Staff'), ('Customer');
INSERT INTO countries (code, country_name) VALUES ('VN', 'Vietnam'), ('US', 'United States');
INSERT INTO genders (gender_name) VALUES ('Male'), ('Female');
INSERT INTO locations (location) VALUES ('Tầng 1'), ('Tầng 2');
INSERT INTO typeroom (type) VALUES ('Standard'), ('Deluxe'), ('Suite');
INSERT INTO roomstatus (status) VALUES ('Available'), ('Booked'), ('Maintenance');
INSERT INTO reporttype (type) VALUES ('Daily'), ('Monthly');
INSERT INTO notificationstatus (status) VALUES ('Unread'), ('Read');



INSERT INTO hotelbranch (address, phone_number) VALUES
('123 Nguyễn Huệ, Quận 1, TP.HCM', '0909123456'),
('45 Lý Thường Kiệt, Hà Nội', '0912345678'),
('88 Trần Phú, Đà Nẵng', '0934567890'),
('12 Pasteur, TP.HCM', '0945678901'),
('22 Hoàng Diệu, Hải Phòng', '0956789012');

INSERT INTO users (user_name, email, password_hash, role_id, full_name, date_of_birth, gender_id, phone_number, current_address, country_id)
VALUES
('admin', 'admin@example.com', 'hash123', 1, 'Admin User', '1990-01-01', 1, '0909000000', 'HCM', 1),
('staff1', 'staff1@example.com', 'hash123', 2, 'Staff One', '1995-05-05', 1, '0909111111', 'HCM', 1),
('customer1', 'customer1@example.com', 'hash123', 3, 'Customer One', '2000-10-10', 2, '0909222222', 'HN', 1);

INSERT INTO services (name, description, price) VALUES
('Spa', 'Massage thư giãn toàn thân', 200000),
('Gym', 'Phòng tập thể hình hiện đại', 150000),
('Breakfast', 'Buffet sáng tại nhà hàng', 100000),
('Airport Pickup', 'Xe đưa đón sân bay', 300000);

INSERT INTO room (area, number_of_bed, description, room_img, hotel_branch_id, type_room_id, location_id, room_status_id)
VALUES
-- Chi nhánh 1 (TP.HCM)
('25m2', 1, 'Phòng đơn view phố', 'room1.jpg', 1, 1, 1, 1),
('35m2', 2, 'Phòng đôi view sông', 'room2.jpg', 1, 2, 2, 1),
('30m2', 1, 'Phòng đơn tiêu chuẩn', 'room3.jpg', 1, 1, 1, 1),
('45m2', 2, 'Phòng đôi cao cấp', 'room4.jpg', 1, 2, 1, 1),
('45m2', 2, 'Phòng đôi cao cấp', 'room99.jpg', 1, 2, 1, 1),
-- Chi nhánh 2 (Hà Nội)
('28m2', 1, 'Phòng đơn view hồ', 'room5.jpg', 2, 1, 2, 1),
('40m2', 2, 'Phòng đôi sang trọng', 'room6.jpg', 2, 2, 2, 1),
('35m2', 1, 'Phòng đơn tiêu chuẩn', 'room7.jpg', 2, 1, 2, 1),
-- Chi nhánh 3 (Đà Nẵng)
('32m2', 1, 'Phòng đơn gần biển', 'room8.jpg', 3, 1, 1, 1),
('45m2', 2, 'Phòng đôi hướng biển', 'room9.jpg', 3, 2, 2, 1),
('50m2', 2, 'Phòng đôi VIP', 'room10.jpg', 3, 2, 1, 1),
-- Chi nhánh 4 (TP.HCM)
('27m2', 1, 'Phòng đơn giá rẻ', 'room11.jpg', 4, 1, 1, 1),
('38m2', 2, 'Phòng đôi tiêu chuẩn', 'room12.jpg', 4, 2, 2, 1),
-- Chi nhánh 5 (Hải Phòng)
('29m2', 1, 'Phòng đơn view cảng', 'room13.jpg', 5, 1, 1, 1),
('42m2', 2, 'Phòng đôi view biển', 'room14.jpg', 5, 2, 2, 1);


INSERT INTO staff (UserID, HotelBranchID) VALUES (2, 1);

-- TP.HCM chi nhánh 1
INSERT INTO booking (check_in_date, check_out_date, room_img, hotel_branch_id, room_id)
VALUES 
('2026-04-20', '2026-04-22', 'room2.jpg', 1, 2),
('2026-04-21', '2026-04-23', 'room4.jpg', 1, 4),
-- Hà Nội chi nhánh 2
('2026-04-19', '2026-04-21', 'room5.jpg', 2, 5),
('2026-04-22', '2026-04-24', 'room6.jpg', 2, 6),
-- Đà Nẵng chi nhánh 3
('2026-04-20', '2026-04-22', 'room9.jpg', 3, 9),
('2026-04-23', '2026-04-25', 'room10.jpg', 3, 10),
-- TP.HCM chi nhánh 4
('2026-04-19', '2026-04-20', 'room11.jpg', 4, 11),
-- Hải Phòng chi nhánh 5
('2026-04-21', '2026-04-22', 'room14.jpg', 5, 14);


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








