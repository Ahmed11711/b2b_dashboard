// src/services/apiService.js
import axios from "axios";

const BASE_URL = "http://192.168.1.40:8000/api/admin/v1/";

const api = axios.create({
  baseURL: BASE_URL,
  // ❌ لا تضع Content-Type هنا بشكل ثابت إذا كنت سترسل ملفات
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
  // ✅ نستخدم api (الـ instance الذي عرفناه فوق) وليس axiosInstance
  const response = await api.post(`/${endpoint}`, data, {
    headers: {
      // ✅ عندما نرسل FormData، يفضل ترك Axios يحدد الـ Content-Type والـ Boundary تلقائياً
      // أو نكتبها صراحة إذا كان الباك اند يتطلب ذلك:
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

// 🔵 Update
export const updateItem = async (endpoint, id, data) => {
  const isFormData = data instanceof FormData;

  if (isFormData) {
    // لارايفل بتحب الـ _method يكون داخل الـ Body مع الملفات
    if (!data.has('_method')) {
      data.append('_method', 'PUT');
    }

    const response = await api.post(`/${endpoint}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  }

  // لو JSON عادي، استخدم PUT مباشرة (أنضف وأسرع)
  const response = await api.put(`/${endpoint}/${id}`, data);
  return response.data.data || response.data;
};

// 🔴 Delete
export const deleteItem = async (endpoint, id) => {
  const response = await api.delete(`/${endpoint}/${id}`);
  return response.data.data;
};