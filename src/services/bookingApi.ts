import axiosInstance from '../api/axiosConfig';

export const bookingApi = {
  // جلب كل الحجوزات الخاصة بالشركة
  getBookings: async () => {
    const response = await axiosInstance.get('/bookings');
    return response.data;
  },

  // إنشاء حجز جديد
  createBooking: async (data: any) => {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },

  /**
   * تحديث حالة الحجز (Confirmed / Cancelled)
   * تم إضافة باراميتر extraData لاستقبال الـ staff_id أو أي بيانات أخرى
   */
  updateBookingStatus: async (id: number, status: string, extraData: object = {}) => {
    const response = await axiosInstance.put(`/bookings/${id}/status`, { 
      status, 
      ...extraData // سيتم دمج الـ staff_id هنا إذا تم إرساله
    });
    return response.data;
  },

  // جلب قائمة الموظفين لعرضهم في المودال
  getStaff: async () => {
    const response = await axiosInstance.get('/staff'); // تأكد من مطابقة المسار للباك أند
    return response.data;
  },

  // جلب بيانات التوفر (Availability) لفلترة المواعيد في الفرونت
  getAvailability: async () => {
    const response = await axiosInstance.get('/availability');
    return response.data;
  }
};