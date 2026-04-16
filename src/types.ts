export interface CompanyProfile {
  id: number;
  name: string;
  logo: string;
  address: string;
  phone?: string; // أضفناه لأنه موجود في رد السيرفر
  hourly_rate: number | string; // يقبل الأرقام والنصوص مثل "100.00"
  is_verified: boolean | number; // يقبل true/false أو 0/1
  description?: string;
  free_delivery?: boolean | number; // يقبل true/false أو 0/1
  rating?: number | string; // السيرفر يرسله "4.50"
  admin_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StandardBag {
  id?: number; // جعلناه اختيارياً لأن الـ Frontend يولد ID عشوائي قبل الحفظ
  service_id?: number;
  description: string;
}

export interface Service {
  id: number;
  service_name: string;
  price: number;
  price_today: number;
  discount: number;
  admin_id?: number; // أضفناه للتوثيق
  standard_bags?: StandardBag[];
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  user_id?: number;
  user_name: string;
  service_id: number;
  booking_date: string;
  start_time: string;
  hours: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'paid' | 'unpaid';
  notes?: string;
  // أضف هذا السطر لحل المشكلة:
  service?: Service; 
  service_name?: string; // كاحتياط لو الباك إند بيرجع الاسم مباشرة أحياناً
}

export interface Availability {
  id: number;
  service_id: number;
  day_of_week: number; // 0-6 for Sunday-Saturday
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeServices: number;
  pendingBookings: number;
}

export interface Staff {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  password?: string;
  role?: 'admin' | 'staff';
}
 export interface LoginCredentials {
  login: string;
  password?: string;
 }

export interface AuthResponse {
  access_token: string;  
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'staff';
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';

export interface StaffBooking {
  id: number;
  customer_name: string;
  service_type: string;
  appointment_time: string;
  status: BookingStatus;
  notes?: string;
  before_photo?: string;
  after_photo?: string;
  start_time?: string;
  end_time?: string;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  image_path: string;
  category_id: number;
  category_name: string;
  is_active: boolean;
  company_id: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
