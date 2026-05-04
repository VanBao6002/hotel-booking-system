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