import axiosInstance from '../api/axiosConfig';

export const staffApi = {
  // جلب كل الموظفين التابعين للشركة (الباك أند بيعرف الشركة من التوكن)
  getStaff: async () => {
    const response = await axiosInstance.get('/staff');
    return response.data; // هيرجع لك المصفوفة في data
  },

  // إضافة موظف جديد
  createStaff: async (data: any) => {
    const response = await axiosInstance.post('/staff', data);
    return response.data;
  },

  // تحديث بيانات موظف (الاسم، التليفون، الإيميل، أو الباسورد)
  updateStaff: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/staff/${id}`, data);
    return response.data;
  },

  // حذف الموظف نهائياً من قاعدة البيانات
  deleteStaff: async (id: number) => {
    const response = await axiosInstance.delete(`/staff/${id}`);
    return response.data;
  },

  // (اختياري) إذا كنت تريد جلب المواقع الحية للموظفين من السيرفر
  getStaffLocations: async () => {
    const response = await axiosInstance.get('/staff/locations');
    return response.data;
  }
};