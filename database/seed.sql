SET NAMES utf8mb4;

INSERT INTO roles (id, role_name) VALUES(1, 'USER'),(2, 'ADMIN'),(3, 'STAFF');
INSERT INTO countries (code, country_name) VALUES ('VN', 'Vietnam'), ('US', 'United States');
INSERT INTO genders (gender_name) VALUES ('Male'), ('Female');
INSERT INTO roomstatus (status) VALUES ('Available'), ('Booked'), ('Maintenance');
INSERT INTO reporttype (type) VALUES ('Daily'), ('Monthly');
INSERT INTO notificationstatus (status) VALUES ('Unread'), ('Read');
INSERT INTO location (name) VALUES
('Hải Châu'),
('Thanh Khê'),
('Liên Chiểu'),
('Sơn Trà'),
('Ngũ Hành Sơn'),
('Cẩm Lệ');

INSERT INTO typeroom (code, name, description) VALUES
('SINGLE', 'Single Room', 'Phòng đơn dành cho 1 người, 1 giường đơn'),
('DOUBLE', 'Double Room', 'Phòng đôi dành cho 2 người, 1 giường đôi hoặc 2 giường đơn'),
('SUITE', 'Suite Room', 'Phòng cao cấp với nhiều tiện nghi hơn');



INSERT INTO hotelbranch (address, phone_number, location_id) VALUES
-- Hải Châu (location_id = 1)
('01 Lê Lợi, Hải Châu, Đà Nẵng', '0909000001', 1),
('02 Bạch Đằng, Hải Châu, Đà Nẵng', '0909000002', 1),

-- Thanh Khê (location_id = 2)
('10 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng', '0909000003', 2),
('20 Điện Biên Phủ, Thanh Khê, Đà Nẵng', '0909000004', 2),

-- Liên Chiểu (location_id = 3)
('30 Tôn Đức Thắng, Liên Chiểu, Đà Nẵng', '0909000005', 3),
('40 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng', '0909000006', 3),

-- Sơn Trà (location_id = 4)
('50 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', '0909000007', 4),
('60 Phạm Văn Đồng, Sơn Trà, Đà Nẵng', '0909000008', 4),

-- Ngũ Hành Sơn (location_id = 5)
('70 Trần Đại Nghĩa, Ngũ Hành Sơn, Đà Nẵng', '0909000009', 5),
('80 Hồ Xuân Hương, Ngũ Hành Sơn, Đà Nẵng', '0909000010', 5),

-- Cẩm Lệ (location_id = 6)
('90 Cách Mạng Tháng 8, Cẩm Lệ, Đà Nẵng', '0909000011', 6),
('100 Nguyễn Hữu Thọ, Cẩm Lệ, Đà Nẵng', '0909000012', 6);


INSERT INTO hotelreview (hotel_branch_id, user_id, rating, comment, created_at)
VALUES
-- Branch 1
(1, 1, 4, 'Phòng sạch sẽ, nhân viên thân thiện', '2024-01-15'),
(1, 2, 5, 'Khách sạn tuyệt vời, sẽ quay lại', '2024-02-20'),
(1, 3, 3, 'Ổn nhưng hơi ồn ào', '2024-03-05'),

-- Branch 2
(2, 1, 2, 'Dịch vụ chưa tốt, phòng hơi cũ', '2024-04-10'),
(2, 1, 5, 'Vị trí đẹp, giá hợp lý', '2024-05-01'),
(2, 2, 4, 'Nhân viên thân thiện, phòng sạch', '2024-05-15'),

-- Branch 3
(3, 3, 5, 'View biển tuyệt đẹp', '2024-06-01'),
(3, 1, 4, 'Phòng rộng rãi, thoải mái', '2024-06-10'),
(3, 1, 3, 'Ổn nhưng hơi xa trung tâm', '2024-06-20'),

-- Branch 4
(4, 1, 4, 'Phòng sạch sẽ, giá hợp lý', '2024-07-05'),
(4, 2, 5, 'Khách sạn sang trọng, dịch vụ tốt', '2024-07-15'),
(4, 3, 3, 'Ổn nhưng hơi ồn', '2024-07-25'),

-- Branch 5
(5, 1, 2, 'Phòng hơi nhỏ', '2024-08-05'),
(5, 2, 4, 'Nhân viên nhiệt tình', '2024-08-15'),
(5, 2, 5, 'Khách sạn tuyệt vời', '2024-08-25'),

-- Branch 6
(6, 2, 3, 'Ổn nhưng xa trung tâm', '2024-09-05'),
(6, 3, 4, 'Phòng sạch sẽ, thoải mái', '2024-09-15'),
(6, 2, 5, 'Dịch vụ xuất sắc', '2024-09-25'),

-- Branch 7
(7, 2, 4, 'Phòng rộng rãi', '2024-10-05'),
(7, 2, 5, 'Khách sạn sang trọng', '2024-10-15'),
(7, 3, 3, 'Ổn nhưng hơi cũ', '2024-10-25'),

-- Branch 8
(8, 2, 2, 'Phòng hơi nhỏ', '2024-11-05'),
(8, 2, 4, 'Nhân viên thân thiện', '2024-11-15'),
(8, 3, 5, 'Khách sạn tuyệt vời', '2024-11-25'),

-- Branch 9
(9, 1, 3, 'Ổn nhưng hơi xa', '2024-12-05'),
(9, 3, 4, 'Phòng sạch sẽ', '2024-12-15'),
(9, 3, 5, 'Dịch vụ tốt', '2024-12-25'),

-- Branch 10
(10, 3, 4, 'Phòng thoải mái', '2025-01-05'),
(10, 1, 5, 'Khách sạn sang trọng', '2025-01-15'),
(10, 1, 3, 'Ổn nhưng hơi ồn', '2025-01-25'),

-- Branch 11
(11, 2, 2, 'Phòng hơi nhỏ', '2025-02-05'),
(11, 3, 4, 'Nhân viên nhiệt tình', '2025-02-15'),
(11, 3, 5, 'Khách sạn tuyệt vời', '2025-02-25'),

-- Branch 12
(12, 1, 3, 'Ổn nhưng xa trung tâm', '2025-03-05'),
(12, 1, 4, 'Phòng sạch sẽ', '2025-03-15'),
(12, 2, 5, 'Dịch vụ xuất sắc', '2025-03-25');


INSERT INTO hotelratingsummary (hotel_branch_id, one_star, two_star, three_star, four_star, five_star, average_star)
VALUES
(1,0,0,1,1,1,4.00),
(2,0,1,0,1,1,3.67),
(3,0,0,1,1,1,4.00),
(4,0,0,1,1,1,4.00),
(5,0,1,0,1,1,3.67),
(6,0,0,1,1,1,4.00),
(7,0,0,1,1,1,4.00),
(8,0,1,0,1,1,3.67),
(9,0,0,1,1,1,4.00),
(10,0,0,1,1,1,4.00),
(11,0,1,0,1,1,3.67),
(12,0,0,1,1,1,4.00);




INSERT INTO users (user_name, email, password_hash, role_id, full_name, date_of_birth, gender_id, phone_number, current_address, country_id)
VALUES
('user', 'user@example.com', '$2a$10$6J3x2JglipdE/PZ5.KJC3uypDdE6eF323soctbNixZjq8lY5mxT7G', 1, 'Customer User', '1990-01-01', 1, '0909000000', 'HCM', 1),
('admin', 'admin@example.com', '$2a$10$6J3x2JglipdE/PZ5.KJC3uypDdE6eF323soctbNixZjq8lY5mxT7G', 2, 'Admin User', '1995-05-05', 1, '0909111111', 'HCM', 1),
('staff', 'staff@example.com', '$2a$10$6J3x2JglipdE/PZ5.KJC3uypDdE6eF323soctbNixZjq8lY5mxT7G', 3, 'Staff User', '2000-10-10', 2, '0909222222', 'HN', 1);

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
(5, 4),
(6, 4),
(7, 5),
(8, 4),
(9, 5),
(10, 4),
(11, 4),
(12, 5);

-- Dịch vụ riêng: Spa chỉ dành cho Suite
INSERT INTO room_type_services (room_type_id, service_id) VALUES 
(1, 3),
(1, 2),
(1, 1),
(2, 3),
(2, 2),
(2, 1);


INSERT INTO room (area, room_number, number_of_bed, price, description, room_img, hotel_branch_id, type_room_id, floor, room_status_id)
VALUES
-- Branch 1
('25m2',101,1,200000,'Phòng đơn view phố','room1.jpg',1,1,1,1),
('35m2',102,2,300000,'Phòng đôi view sông','room2.jpg',1,2,2,1),
('40m2',103,2,400000,'Phòng đôi cao cấp','room3.jpg',1,2,3,1),

-- Branch 2
('28m2',201,1,200000,'Phòng đơn tiêu chuẩn','room4.jpg',2,1,1,1),
('32m2',202,2,300000,'Phòng đôi view hồ','room5.jpg',2,2,2,1),
('45m2',203,2,400000,'Phòng đôi sang trọng','room6.jpg',2,2,3,1),

-- Branch 3
('30m2',301,1,200000,'Phòng đơn gần biển','room7.jpg',3,1,1,1),
('42m2',302,2,350000,'Phòng đôi hướng biển','room8.jpg',3,2,2,1),
('50m2',303,2,500000,'Phòng VIP view biển','room9.jpg',3,2,3,1),

-- Branch 4
('27m2',401,1,200000,'Phòng đơn giá rẻ','room10.jpg',4,1,1,1),
('38m2',402,2,300000,'Phòng đôi tiêu chuẩn','room11.jpg',4,2,2,1),
('45m2',403,2,400000,'Phòng đôi cao cấp','room12.jpg',4,2,3,1),

-- Branch 5
('29m2',501,1,200000,'Phòng đơn view núi','room13.jpg',5,1,1,1),
('40m2',502,2,350000,'Phòng đôi view biển','room14.jpg',5,2,2,1),
('48m2',503,2,450000,'Phòng đôi VIP','room15.jpg',5,2,3,1),

-- Branch 6
('26m2',601,1,200000,'Phòng đơn tiêu chuẩn','room16.jpg',6,1,1,1),
('36m2',602,2,300000,'Phòng đôi view phố','room17.jpg',6,2,2,1),
('44m2',603,2,400000,'Phòng đôi sang trọng','room18.jpg',6,2,3,1),

-- Branch 7
('25m2',701,1,200000,'Phòng đơn view hồ','room19.jpg',7,1,1,1),
('35m2',702,2,300000,'Phòng đôi tiêu chuẩn','room20.jpg',7,2,2,1),
('45m2',703,2,400000,'Phòng đôi cao cấp','room21.jpg',7,2,3,1),

-- Branch 8
('28m2',801,1,200000,'Phòng đơn view phố','room22.jpg',8,1,1,1),
('38m2',802,2,300000,'Phòng đôi view sông','room23.jpg',8,2,2,1),
('50m2',803,2,500000,'Phòng VIP','room24.jpg',8,2,3,1),

-- Branch 9
('30m2',901,1,200000,'Phòng đơn gần biển','room25.jpg',9,1,1,1),
('42m2',902,2,350000,'Phòng đôi hướng biển','room26.jpg',9,2,2,1),
('48m2',903,2,450000,'Phòng đôi VIP','room27.jpg',9,2,3,1),

-- Branch 10
('27m2',1001,1,200000,'Phòng đơn giá rẻ','room28.jpg',10,1,1,1),
('37m2',1002,2,300000,'Phòng đôi tiêu chuẩn','room29.jpg',10,2,2,1),
('45m2',1003,2,400000,'Phòng đôi cao cấp','room30.jpg',10,2,3,1),

-- Branch 11
('29m2',1101,1,200000,'Phòng đơn view núi','room31.jpg',11,1,1,1),
('39m2',1102,2,300000,'Phòng đôi view biển','room32.jpg',11,2,2,1),
('47m2',1103,2,450000,'Phòng đôi VIP','room33.jpg',11,2,3,1),

-- Branch 12
('26m2',1201,1,200000,'Phòng đơn tiêu chuẩn','room34.jpg',12,1,1,1),
('36m2',1202,2,300000,'Phòng đôi view phố','room35.jpg',12,2,2,1),
('46m2',1203,2,400000,'Phòng đôi sang trọng','room36.jpg',12,2,3,1);



INSERT INTO staff (UserID, HotelBranchID) VALUES (2, 1);


INSERT INTO booking (
    check_in_date, check_out_date, room_img,
    hotel_branch_id, room_id, user_id, booking_price
)
VALUES
-- Branch 1
('2026-05-05','2026-05-07','room1.jpg',1,1,1,500000),
('2026-05-08','2026-05-10','room2.jpg',1,2,2,600000),

-- Branch 2
('2026-05-06','2026-05-08','room4.jpg',2,4,3,550000),
('2026-05-09','2026-05-11','room5.jpg',2,5,1,700000),

-- Branch 3
('2026-05-05','2026-05-06','room7.jpg',3,7,2,400000),
('2026-05-07','2026-05-09','room8.jpg',3,8,3,650000),

-- Branch 4
('2026-05-06','2026-05-07','room10.jpg',4,10,1,450000),
('2026-05-08','2026-05-09','room11.jpg',4,11,2,600000),

-- Branch 5
('2026-05-05','2026-05-07','room13.jpg',5,13,3,500000),
('2026-05-08','2026-05-10','room14.jpg',5,14,1,700000),

-- Branch 6
('2026-05-06','2026-05-08','room16.jpg',6,16,2,550000),
('2026-05-09','2026-05-11','room17.jpg',6,17,3,750000),

-- Branch 7
('2026-05-05','2026-05-06','room19.jpg',7,19,1,400000),
('2026-05-07','2026-05-09','room20.jpg',7,20,2,650000),

-- Branch 8
('2026-05-06','2026-05-08','room22.jpg',8,22,3,500000),
('2026-05-09','2026-05-11','room23.jpg',8,23,1,700000),

-- Branch 9
('2026-05-05','2026-05-07','room25.jpg',9,25,2,550000),
('2026-05-08','2026-05-10','room26.jpg',9,26,3,750000),

-- Branch 10
('2026-05-06','2026-05-07','room28.jpg',10,28,1,400000),
('2026-05-08','2026-05-09','room29.jpg',10,29,2,600000),

-- Branch 11
('2026-05-05','2026-05-07','room31.jpg',11,31,3,500000),
('2026-05-08','2026-05-10','room32.jpg',11,32,1,700000),

-- Branch 12
('2026-05-06','2026-05-08','room34.jpg',12,34,2,550000),
('2026-05-09','2026-05-11','room35.jpg',12,35,3,750000);




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







