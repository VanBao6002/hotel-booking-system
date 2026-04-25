import apiClient  from "./apiClient.js";

export const userRegister = (userData) => {
    return apiClient("/api/v1/auth/register",{
        method: "POST",
        body: JSON.stringify(userData)
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        throw error;
    });
};

export const userLogin = (userData) => {
    return apiClient("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(userData)
    })
    .then(data => {
        // console.log("Data nhan thanh cong(login)", data);
        return data;
    })
    .catch(error => {
        throw error;
    });
} 