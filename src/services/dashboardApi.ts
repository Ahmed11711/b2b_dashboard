import axiosInstance from '../api/axiosConfig';

export const dashboardApi = {
  // جلب إحصائيات لوحة التحكم (المدير)
  getAdminStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },

  // جلب إحصائيات الموظف (لو كان المسجل موظف)
  getStaffStats: async () => {
    const response = await axiosInstance.get('/staff/stats');
    return response.data;
  },

  // جلب الحجوزات الأخيرة (مع إمكانية تحديد عدد معين)
  getRecentBookings: async (limit: number = 5) => {
    const response = await axiosInstance.get(`/bookings?limit=${limit}`);
    return response.data;
  }
};