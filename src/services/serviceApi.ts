import axiosInstance from '../api/axiosConfig';
import { Service } from '../types';

export const serviceApi = {
  // جلب كل الخدمات
  getServices: async () => {
    const response = await axiosInstance.get('/services');
    return response.data; // هيرجع الـ object اللي فيه success و data
  },

  // إنشاء خدمة جديدة
  createService: async (data: any) => {
    const response = await axiosInstance.post('/services', data);
    return response.data;
  },

  // تحديث خدمة
  updateService: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/services/${id}`, data);
    return response.data;
  },

  // حذف خدمة
  deleteService: async (id: number) => {
    const response = await axiosInstance.delete(`/services/${id}`);
    return response.data;
  },

  // --- التعديل هنا لـ Availability ---
  getAvailability: async () => {
    const response = await axiosInstance.get('/availability');
    return response.data;
  },

  updateAvailability: async (serviceId: number, data: any) => {
    // استخدمنا await و رجعنا الـ data عشان تمشي مع نفس نظامك
    const response = await axiosInstance.post(`/availability/sync/${serviceId}`, data);
    return response.data;
  },

  deleteAvailability: (id: number) => axiosInstance.delete(`/availability/${id}`),
};