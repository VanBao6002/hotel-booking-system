-- Tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa bảng con trước (phụ thuộc nhiều khóa ngoại)
TRUNCATE TABLE BookingService;
TRUNCATE TABLE HistoryLogin;
TRUNCATE TABLE Notification;
TRUNCATE TABLE Message;
TRUNCATE TABLE Review;
TRUNCATE TABLE CheckIn;
TRUNCATE TABLE CheckOut;
TRUNCATE TABLE Receipt;
TRUNCATE TABLE Maintenance;
TRUNCATE TABLE Report;
TRUNCATE TABLE Conversation;
TRUNCATE TABLE RoomPrice;

-- Xóa bảng trung gian
TRUNCATE TABLE Booking;
TRUNCATE TABLE Staff;

-- Xóa bảng chính
TRUNCATE TABLE Services;
TRUNCATE TABLE Room;
TRUNCATE TABLE HotelBranch;
TRUNCATE TABLE Users;

-- Xóa bảng danh mục (lookup tables)
TRUNCATE TABLE Roles;
TRUNCATE TABLE Countries;
TRUNCATE TABLE Genders;
TRUNCATE TABLE Locations;
TRUNCATE TABLE TypeRoom;
TRUNCATE TABLE RoomStatus;
TRUNCATE TABLE ReportType;
TRUNCATE TABLE NotificationStatus;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;