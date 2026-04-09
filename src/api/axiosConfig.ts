import axios from 'axios';

const API_BASE_URL = 'https://api.cleany.qa/api/v1/company/'; // استبدله برابط الباك اند الخاص بك

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة interceptor لإرسال التوكن مع كل طلب بشكل تلقائي
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// إضافة interceptor للتعامل مع الأخطاء (مثل 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إذا انتهت صلاحية التوكن، امسح البيانات ووجه المستخدم لتسجيل الدخول
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;