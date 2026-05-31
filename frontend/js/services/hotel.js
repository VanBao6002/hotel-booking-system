import apiClient  from "./apiClient.js";

export const searchHotel = (searchInfoData) => {
    return apiClient("/api/search/hotel", {
        method: "POST",
        body: JSON.stringify(searchInfoData),
        skipAuth: true
    });
};

export const getReviewsHotel = (hotelId) => {
    return apiClient(`/api/reviews/hotel/${hotelId}`, {
        method: "GET",
        skipAuth: true,
    })
}
export const bookingRoom = (data) => {
    return apiClient("/api/bookings", {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: false
    })
}
export const getBookingHistory = (userId) => {
    return apiClient(`/api/bookings/user/${userId}`, {
        method: "GET",
        skipAuth: false
    })
}

export const submitReview = (hotelId, reviewData) => {
    return apiClient(`/api/reviews/hotel/${hotelId}`, {
        method: "POST",
        body: JSON.stringify(reviewData),
        skipAuth: false
    })
}