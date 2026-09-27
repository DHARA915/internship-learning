import { api } from "./axios";

export const getUsers = async () => {
    const { data } = await api.get("/users")
    return data;
}

export const getUser = async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
}

export const createUser = async (user) => {
    const { data } = await api.post("/users/add", user);
    return data;
}

export const updateUser = async ({ id, user }) => {
    const { data } = await api.put(`/users/${id}`, user);
    return data;
}

export const deleteUser = async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
};