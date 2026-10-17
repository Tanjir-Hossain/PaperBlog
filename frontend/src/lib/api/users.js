import { apiRequest } from "../apiClient";

// --- self-service (user / admin) ------------------------------------------
export const getMyProfile = (token) =>
    apiRequest("/users/profile", { token });

export const updateMyProfile = ({ firstname, lastname }) =>
    apiRequest("/users/profile/update", {
        method: "PUT",
        body: { firstname, lastname }
    });

export const changeMyPassword = (password) =>
    apiRequest("/users/password", { method: "PATCH", body: { password } });

export const uploadMyAvatar = (file) => {
    const form = new FormData();
    form.append("image", file);
    return apiRequest("/users/profile/image", { method: "PATCH", body: form });
};

// --- admin-only -----------------------------------------------------------
export const listUsers = () => apiRequest("/users");

export const getUser = (id) => apiRequest(`/users/${id}`);

export const setUserStatus = (id, isActive) =>
    apiRequest(`/users/${id}/status`, { method: "PATCH", body: { isActive } });
