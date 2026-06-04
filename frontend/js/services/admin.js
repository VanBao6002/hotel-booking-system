import apiClient from "./apiClient.js";

export const getHotels = () => apiClient("/api/v1/hotels", { method: "GET" });
export const getLocations = () => apiClient("/api/v1/hotels/locations", { method: "GET" });
export const getHotel = (hotelId) => apiClient(`/api/v1/hotels/${hotelId}`, { method: "GET" });
export const createHotel = (hotel) => apiClient("/api/v1/hotels", {
  method: "POST",
  body: JSON.stringify(hotel),
});
export const updateHotel = (hotelId, hotel) => apiClient(`/api/v1/hotels/${hotelId}`, {
  method: "PUT",
  body: JSON.stringify(hotel),
});
export const deleteHotel = (hotelId) => apiClient(`/api/v1/hotels/${hotelId}`, { method: "DELETE" });

export const getHotelRooms = (hotelId) => apiClient(`/api/v1/hotels/${hotelId}/rooms`, { method: "GET" });
export const createRoom = (hotelId, room) => apiClient(`/api/v1/hotels/${hotelId}/rooms`, {
  method: "POST",
  body: JSON.stringify(room),
});
export const updateRoom = (hotelId, roomId, room) => apiClient(`/api/v1/hotels/${hotelId}/rooms/${roomId}`, {
  method: "PUT",
  body: JSON.stringify(room),
});
export const deleteRoom = (hotelId, roomId) => apiClient(`/api/v1/hotels/${hotelId}/rooms/${roomId}`, { method: "DELETE" });

export const getBookings = () => apiClient("/api/v1/bookings", { method: "GET" });
export const searchBookings = (filters) => apiClient("/api/v1/bookings/search", {
  method: "POST",
  body: JSON.stringify(filters),
});

export const getFinanceSummary = () => apiClient("/api/v1/finance/summary", { method: "GET" });
export const getFinanceTransactions = () => apiClient("/api/v1/finance/transactions", { method: "GET" });
export const getMonthlyRevenue = (year = new Date().getFullYear()) =>
  apiClient(`/api/v1/finance/monthly-revenue?year=${encodeURIComponent(year)}`, { method: "GET" });

export const getManagerDashboard = (year = new Date().getFullYear()) =>
  apiClient(`/api/v1/dashboard/manager?year=${encodeURIComponent(year)}`, { method: "GET" });
