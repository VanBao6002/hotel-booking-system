import apiClient from "./apiClient.js";

export const getStaffDashboard = () => apiClient("/api/v1/staff/dashboard", { method: "GET" });
export const getStaffHotel = () => apiClient("/api/v1/staff/hotel", { method: "GET" });
export const getStaffRooms = () => apiClient("/api/v1/staff/rooms", { method: "GET" });
export const getStaffBookings = () => apiClient("/api/v1/staff/bookings", { method: "GET" });

export const searchStaffBookings = (filters) => apiClient("/api/v1/staff/bookings/search", {
  method: "POST",
  body: JSON.stringify(filters),
});

export const updateStaffRoomStatus = (roomId, roomStatus) => apiClient(`/api/v1/staff/rooms/${roomId}/status`, {
  method: "PUT",
  body: JSON.stringify({ roomStatus }),
});
