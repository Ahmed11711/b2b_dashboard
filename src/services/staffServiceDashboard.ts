import axiosInstance from '../api/axiosConfig';
import { StaffBooking, BookingStatus } from '../types';

// تعريف شكل الاستجابة القادمة من الباك أند
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export const staffService = {
  // جلب المهام
  getMyBookings: async (): Promise<ApiResponse<StaffBooking[]>> => {
    const response = await axiosInstance.get('/staff/Dashbaord/bookings');
    return response.data; // هنا response.data هو الـ Object الكامل
  },

  updateBookingStatus: async (id: number, status: BookingStatus) => {
    const response = await axiosInstance.patch(`/staff/Dashbaord/bookings/${id}/status`, { 
      status 
    });
    return response.data;
  },

  completeBooking: async (id: number, data: { 
    notes: string; 
    beforePhoto?: string; 
    afterPhoto?: string 
  }) => {
    const response = await axiosInstance.post(`/staff/Dashbaord/bookings/${id}/complete`, data);
    return response.data;
  },

  sendLocation: async (lat: number, lng: number) => {
    const response = await axiosInstance.post('/staff/Dashbaord/update-location', { lat, lng });
    return response.data;
  }
};