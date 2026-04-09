import axiosInstance from '../api/axiosConfig';
import { LoginCredentials, AuthResponse } from '../types'; // الآن لن يعطي خطأ

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // نحدد نوع البيانات الراجعة هنا <AuthResponse>
    const response = await axiosInstance.post<AuthResponse>('auth/login', credentials);
    return response.data;
  },
  
  // دالة لجلب بيانات البروفايل من التوكن المخزن
  getMe: async (): Promise<AuthResponse['user']> => {
    const response = await axiosInstance.get('/api/me');
    return response.data;
  }
};