import apiClient from "./apiClient.js";

export const getAllUsers = () => {
  return apiClient("/api/v1/users", {
    method: "GET",
    skipAuth: false,
  });
};

// Delete a user permanently
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

// Grant STAFF role to a user
export const grantStaffRole = (userId) => {
  return apiClient(`/api/v1/users/${userId}/role`, {
    method: "PUT",
    skipAuth: false,
    body: JSON.stringify({
      role: "STAFF",
    }),
  });
};

export const getMe = () => {
  return apiClient("/api/v1/auth/me", {
    method: "GET",
    skipAuth: false
  });
};

