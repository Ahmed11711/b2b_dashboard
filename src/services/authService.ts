import axiosInstance from '../api/axiosConfig';
import { LoginCredentials, AuthResponse } from '../types';  

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
     const response = await axiosInstance.post<AuthResponse>('auth/login', credentials);
    return response.data;
  },
  
   getMe: async (): Promise<AuthResponse['user']> => {
    const response = await axiosInstance.get('/api/me');
    return response.data;
  }
};