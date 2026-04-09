import { log } from 'console';
import axiosInstance from '../api/axiosConfig'
import { CompanyProfile } from '../types';

export const profileService = {
  // جلب بيانات الشركة
  getProfile: async (): Promise<CompanyProfile> => {
    const response = await axiosInstance.get('my-company');
    return response.data.data;
  },

saveProfile: async (profileData: any, imageFile: File | null, exists: boolean): Promise<CompanyProfile> => {
  const formData = new FormData();
  
  // إضافة البيانات النصية
  Object.keys(profileData).forEach(key => {
    formData.append(key, profileData[key]);
  });

  // إضافة الصورة
  if (imageFile) {
    formData.append('logo', imageFile);
  }

  // الحيلة هنا: إذا كان تحديث (exists === true)
  // نرسل POST ولكن نخبر لارافيل أننا نريد PUT
  if (exists) {
    formData.append('_method', 'PUT');
  }

  const response = await axiosInstance.post('my-company', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data.data;
},
  // رفع اللوجو (بافتراض أن الباك اند يتوقع FormData أو Base64)
  updateLogo: async (imageFile: File): Promise<{ logo_url: string }> => {
    const formData = new FormData();
    formData.append('logo', imageFile);
    const response = await axiosInstance.post('/api/company/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  // تغيير كلمة المرور
  changePassword: async (passwordData: any) => {
    const response = await axiosInstance.post('/api/company/change-password', passwordData);
    return response.data.data;
  }
};