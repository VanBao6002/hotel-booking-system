import apiClient  from "./apiClient.js";

export const searchHotel = (searchInfoData) => {
    return apiClient("/api/search/hotel", {
        method: "POST",
        body: JSON.stringify(searchInfoData)
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        throw error;
    });
}