// src/services/apiService.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/admin/v1/";

const api = axios.create({
  baseURL: BASE_URL,
 });

// 🟢 Get All
export const getAll = async (endpoint, params = {}) => {
  const response = await api.get(`${endpoint}`, { params });
  return response.data;
};

// 🟢 Get One
export const getOne = async (endpoint, id) => {
  const response = await api.get(`/${endpoint}/${id}`);
  return response.data.data;
};

// 🟡 Create
export const createItem = async (endpoint, data) => {
   const response = await api.post(`/${endpoint}`, data, {
    headers: {
       'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

// 🔵 Update
export const updateItem = async (endpoint, id, data) => {
  const isFormData = data instanceof FormData;

  if (isFormData) {
    if (!data.has('_method')) {
      data.append('_method', 'PUT');
    }

    const response = await api.post(`/${endpoint}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  }

  const response = await api.put(`/${endpoint}/${id}`, data);
  return response.data.data || response.data;
};

// 🔴 Delete
export const deleteItem = async (endpoint, id) => {
  const response = await api.delete(`/${endpoint}/${id}`);
  return response.data.data;
};