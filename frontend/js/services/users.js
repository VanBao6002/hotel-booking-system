import apiClient from "./apiClient.js";

export const getAllUsers = () => {
  return apiClient("/api/v1/users", {
    method: "GET",
    skipAuth: false,
  });
};

// Soft delete a user by disabling the account.
export const deleteUser = (userId) => {
  return apiClient(`/api/v1/users/${userId}`, {
    method: "DELETE",
    skipAuth: false,
  });
};

// Ban/Lock a user account with optional reason
export const banUser = (userId, reason = "") => {
  return apiClient(`/api/v1/users/${userId}/lock`, {
    method: "PUT",
    skipAuth: false,
    body: JSON.stringify({
      reason: reason || "Banned by admin",
    }),
  });
};

// Send a warning to a user
export const warnUser = (userId, message = "") => {
  return apiClient(`/api/v1/users/${userId}/warn`, {
    method: "POST",
    skipAuth: false,
    body: JSON.stringify({
      message: message || "Warning from admin",
    }),
  });
};

// Grant staff role to a user
export const grantStaffRole = (userId, hotelBranchId = null) => {
  return apiClient(`/api/v1/users/${userId}/role`, {
    method: "PUT",
    skipAuth: false,
    body: JSON.stringify({
      role: "staff",
      hotelBranchId,
    }),
  });
};

export const getMe = () => {
  return apiClient("/api/v1/auth/me", {
    method: "GET",
    skipAuth: false
  });
};

export const updateMe = (profile) => {
  return apiClient("/api/v1/auth/update-profile", {
    method: "PUT",
    skipAuth: false,
    body: JSON.stringify(profile),
  });
};

export const changePassword = (passwordData) => {
  return apiClient("/api/v1/auth/change-password", {
    method: "PUT",
    skipAuth: false,
    body: JSON.stringify(passwordData),
  });
};
<<<<<<< HEAD

export const forgotPassword = (phoneNumber) => {
  return apiClient("/api/v1/auth/forgot-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(phoneNumber),
  });
}

export const resetPassword = (resetData) => {
  return apiClient("/api/v1/auth/reset-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(resetData),
  });
}
=======
>>>>>>> origin/FE_QuanLy
