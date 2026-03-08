-- Sample Users
INSERT INTO users (email, password, first_name, last_name, phone) VALUES
('john.doe@example.com', '$2a$10$X5wFWHJp5.FzpKmFTLLhfOhOLvvlPY7.vQI8b4V0B4GXxqqXDR3K6', 'John', 'Doe', '+1234567890'),
('jane.smith@example.com', '$2a$10$X5wFWHJp5.FzpKmFTLLhfOhOLvvlPY7.vQI8b4V0B4GXxqqXDR3K6', 'Jane', 'Smith', '+1234567891'),
('admin@hotel.com', '$2a$10$X5wFWHJp5.FzpKmFTLLhfOhOLvvlPY7.vQI8b4V0B4GXxqqXDR3K6', 'Admin', 'User', '+1234567892');

-- Sample Hotels
INSERT INTO hotels (name, address, city, country, rating) VALUES
('Grand Hotel Plaza', '123 Main Street', 'New York', 'USA', 4.5),
('Ocean View Resort', '456 Beach Road', 'Miami', 'USA', 4.8),
('Mountain Lodge', '789 Alpine Way', 'Denver', 'USA', 4.3),
('City Center Inn', '321 Downtown Ave', 'Chicago', 'USA', 4.0),
('Sunset Paradise', '654 Coastal Highway', 'San Diego', 'USA', 4.7);

-- Sample Rooms for Grand Hotel Plaza (hotel_id: 1)
INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity) VALUES
(1, '101', 'Standard', 120.00, 2),
(1, '102', 'Standard', 120.00, 2),
(1, '201', 'Deluxe', 180.00, 2),
(1, '202', 'Deluxe', 180.00, 3),
(1, '301', 'Suite', 350.00, 4);

-- Sample Rooms for Ocean View Resort (hotel_id: 2)
INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity) VALUES
(2, '101', 'Standard', 150.00, 2),
(2, '102', 'Ocean View', 220.00, 2),
(2, '201', 'Ocean View', 220.00, 3),
(2, '301', 'Presidential Suite', 500.00, 6);

-- Sample Rooms for Mountain Lodge (hotel_id: 3)
INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity) VALUES
(3, '101', 'Cabin', 100.00, 2),
(3, '102', 'Cabin', 100.00, 2),
(3, '201', 'Family Suite', 200.00, 4);

-- Sample Rooms for City Center Inn (hotel_id: 4)
INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity) VALUES
(4, '101', 'Standard', 90.00, 2),
(4, '102', 'Standard', 90.00, 2),
(4, '201', 'Business Suite', 150.00, 2);

-- Sample Rooms for Sunset Paradise (hotel_id: 5)
INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity) VALUES
(5, '101', 'Standard', 200.00, 2),
(5, '201', 'Deluxe', 280.00, 2),
(5, '301', 'Penthouse', 600.00, 4);

-- Sample Bookings
INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status) VALUES
(1, 1, '2026-03-15', '2026-03-18', 360.00, 'CONFIRMED'),
(2, 6, '2026-03-20', '2026-03-25', 750.00, 'CONFIRMED'),
(1, 10, '2026-04-01', '2026-04-05', 400.00, 'PENDING');