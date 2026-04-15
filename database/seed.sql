INSERT INTO Roles (role_name) VALUES ('Admin'), ('Staff'), ('Customer');
INSERT INTO Countries (code, country_name) VALUES ('VN', 'Vietnam'), ('US', 'United States');
INSERT INTO Genders (gender_name) VALUES ('Male'), ('Female');
INSERT INTO Locations (location) VALUES ('Tầng 1'), ('Tầng 2');
INSERT INTO TypeRoom (type) VALUES ('Standard'), ('Deluxe'), ('Suite');
INSERT INTO RoomStatus (status) VALUES ('Available'), ('Booked'), ('Maintenance');
INSERT INTO ReportType (type) VALUES ('Daily'), ('Monthly');
INSERT INTO NotificationStatus (status) VALUES ('Unread'), ('Read');



INSERT INTO HotelBranch (address, phone_number) VALUES
('123 Nguyễn Trãi, HCM', '0909123456'),
('456 Lê Lợi, Hà Nội', '0912345678');

INSERT INTO Users (user_name, email, password_hash, role_id, full_name, date_of_birth, gender_id, phone_number, current_address, country_id)
VALUES
('admin', 'admin@example.com', 'hash123', 1, 'Admin User', '1990-01-01', 1, '0909000000', 'HCM', 1),
('staff1', 'staff1@example.com', 'hash123', 2, 'Staff One', '1995-05-05', 1, '0909111111', 'HCM', 1),
('customer1', 'customer1@example.com', 'hash123', 3, 'Customer One', '2000-10-10', 2, '0909222222', 'HN', 1);

INSERT INTO Services (name, description, price) VALUES
('Spa', 'Massage thư giãn toàn thân', 200000),
('Gym', 'Phòng tập thể hình hiện đại', 150000),
('Breakfast', 'Buffet sáng tại nhà hàng', 100000),
('Airport Pickup', 'Xe đưa đón sân bay', 300000);

INSERT INTO Room (area, numberOfBed, description, roomIMG, HotelBranchID, TypeRoomID, LocationID, RoomStatusID)
VALUES
('30m2', 1, 'Phòng tiêu chuẩn', 'room1.jpg', 1, 1, 1, 1),
('50m2', 2, 'Phòng deluxe', 'room2.jpg', 1, 2, 2, 1);


INSERT INTO Staff (UserID, HotelBranchID) VALUES (2, 1);

INSERT INTO Booking (HotelBranchID, RoomID, checkInDate, checkOutDate, roomIMG)
VALUES (1, 1, '2026-04-05', '2026-04-07', 'room1.jpg');

INSERT INTO BookingService ( Type_roomID, ServiceID)
VALUES ( 1, 1),
       ( 1, 3);

INSERT INTO Notification (message, createAt, isBroadcast, UserID, NotificationStatusID)
VALUES ('Chào mừng bạn đến khách sạn', NOW(), FALSE, 3, 1);

INSERT INTO Conversation (createAt, status, CustomerID, HotelBranchID)
VALUES (NOW(), 'Open', 3, 1);

INSERT INTO Message (content, ConversationID, SenderID)
VALUES ('Xin chào, tôi muốn hỏi về phòng.', 1, 3);

INSERT INTO Review (comment, rating, createAt, CustomerID, BookingID)
VALUES ('Phòng sạch sẽ, dịch vụ tốt', 5, NOW(), 3, 1);

INSERT INTO Receipt (paymentMethod, amount, paymentDate, BookingID)
VALUES ('Cash', 400000, '2026-04-05', 1);








