# Frontend/Backend Data Matching Analysis

## 🔍 USERS MANAGEMENT

### Frontend - Mock Data:
```javascript
// Từ users-management.js template
{
  id: 1,
  userName: "john_doe",
  email: "john@example.com",
  fullName: "John Doe",
  role: "USER",
  lockedUntil: null,  // "2026-05-12 10:30:00" khi bị khóa
  isActive: true
}
```

### Backend - UserDTO Output:
```java
{
  id: 1,
  userName: "john_doe",
  email: "john@example.com",
  fullName: "John Doe",
  isActive: true,
  createdAt: "2026-03-24T14:25:32"
}
```

### ❌ MISMATCH - Fields Missing in Backend:
- ❌ `role` - NOT returned by getUserDTO (need to add)
- ❌ `lockedUntil` - NOT returned by getUserDTO (need to add)

### 🔧 FIX NEEDED:
Update UserDTO to include:
```java
private String role;
private LocalDateTime lockedUntil;
```

---

## 🔍 HOTELS MANAGEMENT

### Frontend - Mock Data:
```javascript
{
  id: 1,
  hotelName: "The Oceanfront Villa",
  location: "Maldives",
  rating: 4.8,
  roomCount: 120,
  imageUrl: "https://images.unsplash.com/...",
  isOnline: true
}
```

### Backend - HotelBranchDTO Output:
```java
{
  id: 1,
  address: "Beach Street 123",        // ❌ Should be hotelName
  phoneNumber: "123-456-7890",
  locationName: "Maldives",           // ✅ Match
  averageStar: 4.8,                   // ✅ Match with rating
  roomCount: 120,                     // ✅ Match
  imageUrl: "https://...",            // ✅ Match
  isOnline: true                      // ✅ Match
}
```

### ⚠️ PROBLEM:
- **Database structure**: `hotelbranch.address` stores street address, NOT hotel name
- **Frontend expects**: hotelName field

### 🔧 SOLUTION - Option 1: Add hotelName field to database
```sql
ALTER TABLE hotelbranch ADD COLUMN hotel_name VARCHAR(100) NOT NULL;
```

### 🔧 SOLUTION - Option 2: Use address as hotel name (Current approach)
Update HotelBranchDTO mapping to map address → hotelName in frontend response

---

## 🔍 ROOMS MANAGEMENT

### Frontend - Mock Data (implied):
```javascript
// Mỗi hotel có rooms array
{
  rooms: [
    {
      id: 1,
      roomNumber: "101",
      type: "Deluxe",
      pricePerNight: 150.00,
      isAvailable: true,
      capacity: 2
    }
  ]
}
```

### Backend - RoomDTO Output:
```java
{
  id: 1,
  roomNumber: 101,                    // ⚠️ Int instead of String
  floor: 1,
  area: "30m²",
  numberOfBed: 2,
  price: 150,
  description: "Deluxe room with ocean view",
  roomIMG: "https://...",
  typeCode: "DELUXE",                 // ✅ type
  roomStatus: "AVAILABLE",
  hotelBranchAddress: "Beach St 123",
  services: ["WiFi", "AC", "TV"]
}
```

### ✅ MOSTLY MATCH
- ⚠️ `roomNumber`: Backend = Integer, Frontend = String ("101" vs 101)
- ✅ `type/typeCode`: Match (DELUXE)
- ✅ `price/pricePerNight`: Match
- ✅ `capacity/numberOfBed`: Match (same as 2)
- ✅ `isAvailable`: Backend uses roomStatus = "AVAILABLE"

### 🔧 ADJUSTMENTS NEEDED:
1. Convert roomNumber to String in response
2. Use roomStatus = "AVAILABLE" for isAvailable check
3. Add capacity field (same as numberOfBed)

---

## 🔍 BOOKINGS MANAGEMENT

### Frontend - Mock Data:
```javascript
{
  id: "B-1001",                       // String format
  guest: "John Doe",
  hotel: "The Oceanfront Villa",
  dates: "Oct 20 - Oct 25",
  price: "$10,500",
  payStatus: "Paid",
  payTag: "gold",
  bookStatus: "Confirmed",
  bookTag: "gold"
}
```

### Backend - BookingDTO Output:
```java
{
  id: 1,                              // ❌ Integer, Frontend expects String "B-1001"
  checkInDate: "2026-10-20",
  checkOutDate: "2026-10-25",
  bookedAt: "2026-09-15T10:00:00",
  guestName: "John Doe",              // ✅ guest
  hotelName: "The Oceanfront Villa",  // ✅ hotel
  totalPrice: 10500,                  // ⚠️ $10,500 format (need formatting)
  paymentStatus: "Paid",              // ✅ payStatus
  bookingStatus: "Confirmed"          // ✅ bookStatus
}
```

### ⚠️ MISMATCHES:
- ❌ `id` format: Backend returns Integer, Frontend expects "B-1001" format
- ❌ `dates` field missing: Frontend shows "Oct 20 - Oct 25" (derived from dates)
- ❌ `price` format: Backend returns number, Frontend shows "$10,500"
- ❌ `payTag`, `bookTag`: Not in backend (for styling, can be handled in frontend)

### 🔧 SOLUTION:
Add to BookingDTO:
```java
private String id;  // Format as "B-{bookingId}"
private String dates;  // Format as "MMM dd - MMM dd"
```

---

## 🔍 FINANCE MANAGEMENT

### Frontend - Mock Data:
```javascript
// Summary Card
{
  title: "Total Earnings",
  value: "$5,240,000"
}

// Transaction Row
{
  date: "Oct 25, 2023",
  description: "The Oceanfront Villa Booking",
  amount: "$3,500",
  status: "Completed - Gold status"
}

// Monthly Data
{
  month: "Jan",
  revenue: 34000,
  expenses: 19000
}
```

### Backend - FinanceManagementService Output:
```java
FinanceSummaryDTO:
{
  totalEarnings: 5240000,             // ✅ Match
  pendingPayouts: 120500,
  taxSummary: 890000,
  currency: "USD"
}

TransactionDTO:
{
  date: "2026-10-25",                 // ⚠️ Format issue
  description: "...",                 // ✅ Match
  amount: 3500,                       // ⚠️ Need $ prefix
  status: "Completed",
  type: "revenue"
}

MonthlyRevenueDTO.MonthDataDTO:
{
  month: "January",                   // ⚠️ Should be "Jan"
  revenue: 34000,                     // ✅ Match
  expenses: 19000                     // ✅ Match
}
```

### ⚠️ FORMATTING ISSUES:
- ❌ Month name: "January" vs "Jan"
- ❌ Amount format: number vs "$3,500"
- ❌ Date format: may need localization

### 🔧 SOLUTION:
Keep backend data as-is, do formatting in frontend:
```javascript
// Frontend
amount: `$${transaction.amount.toLocaleString()}`
month: transaction.month.substring(0, 3)
```

---

## 📋 SUMMARY - Required Fixes

### HIGH PRIORITY (Breaking):
1. ❌ Add `role` and `lockedUntil` to UserDTO
2. ❌ Add `hotelName` field to HotelBranchDTO (or clarify address usage)
3. ❌ Format Booking `id` as "B-{id}"
4. ❌ Add `dates` field to BookingDTO

### MEDIUM PRIORITY (Logic):
5. ⚠️ Convert `roomNumber` to String
6. ⚠️ Map `roomStatus` to `isAvailable`
7. ⚠️ Add `capacity` field to RoomDTO

### LOW PRIORITY (Frontend Formatting):
8. ✅ Money formatting: Handle in frontend
9. ✅ Month name shortening: Handle in frontend
10. ✅ Tag colors (payTag, bookTag): Handle in frontend

---

## 🔧 Code Changes Needed

### UserDTO Update:
```java
@Data
public class UserDTO {
    private Integer id;
    private String userName;
    private String email;
    private String fullName;
    private String role;              // ADD THIS
    private LocalDateTime lockedUntil; // ADD THIS
    private Boolean isActive;
    private LocalDateTime createdAt;
}
```

### HotelBranchDTO Update:
```java
private String hotelName;  // ADD THIS - rename from address or add new field
// OR use address field as hotelName
```

### BookingDTO Update:
```java
private String id;  // Change from Integer, format as "B-{id}"
private String dates;  // ADD THIS - format as "MMM dd - MMM dd"
```

---

## ✅ Implementation Status

| Component | Status | Issues |
|-----------|--------|--------|
| Users API | ✅ Implemented | ⚠️ DTO missing role, lockedUntil |
| Hotels API | ✅ Implemented | ⚠️ Address vs hotelName confusion |
| Rooms API | ✅ Implemented | ⚠️ Minor field mappings needed |
| Bookings API | ✅ Implemented | ⚠️ ID format, dates field |
| Finance API | ✅ Implemented | ✅ Mostly OK, frontend formats |

