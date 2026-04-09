import axiosInstance from '../api/axiosConfig';

export const offerApi = {
  // جلب كل العروض الخاصة بالشركة
  getOffers: async () => {
    const response = await axiosInstance.get('/offers');
    return response.data;
  },
  
  // إنشاء عرض جديد (نستخدم FormData لأننا سنرسل ملف صورة)
  createOffer: async (formData: FormData) => {
    const response = await axiosInstance.post('/offers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // جلب الأقسام المتاحة لإضافتها في الـ Select
  getCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  // تغيير حالة العرض (نشط/غير نشط)
  toggleStatus: async (id: number) => {
    const response = await axiosInstance.patch(`/offers/${id}/toggle`);
    return response.data;
  },

  deleteOffer: async (id: number) => {
    const response = await axiosInstance.delete(`/offers/${id}`);
    return response.data;
  }
};