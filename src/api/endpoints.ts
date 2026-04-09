import { 
  CompanyProfile, 
  Service, 
  Booking, 
  Availability, 
  DashboardStats,
  StandardBag,
  Staff
} from '../types';

// Mock Data
export const mockStaff: Staff[] = [
  {
    id: 1,
    full_name: 'Ahmed Samir',
    phone: '+20123456789',
    email: 'ahmed@example.com',
  },
  {
    id: 2,
    full_name: 'Sarah Johnson',
    phone: '+15550123456',
    email: 'sarah@example.com',
  },
  {
    id: 3,
    full_name: 'Michael Chen',
    phone: '+15550987654',
    email: 'michael@example.com',
  },
  {
    id: 4,
    full_name: 'Elena Rodriguez',
    phone: '+15550112233',
    email: 'elena@example.com',
  },
  {
    id: 5,
    full_name: 'David Wilson',
    phone: '+15550445566',
    email: 'david@example.com',
  },
];

export const mockProfile: CompanyProfile = {
  id: 1,
  name: 'Premium Home Services',
  logo: 'https://picsum.photos/seed/company/200/200',
  address: '123 Luxury Ave, Beverly Hills, CA',
  hourly_rate: 85,
  is_verified: true,
  description: 'We provide high-quality home maintenance services including deep cleaning, garden care, and pool maintenance. Our team of certified professionals is dedicated to ensuring your home is in top condition.',
  free_delivery: true,
  rating: 4.8,
};

export const mockServices: Service[] = [
  { 
    id: 1, 
    service_name: 'Deep Cleaning', 
    price: 150, 
    price_today: 120, 
    discount: 20,
    standard_bags: [
      { id: 1, service_id: 1, description: 'Includes essential cleaning supplies' },
      { id: 2, service_id: 1, description: 'Includes eco-friendly supplies and specialized tools' },
    ]
  },
  { 
    id: 2, 
    service_name: 'Garden Maintenance', 
    price: 80, 
    price_today: 80, 
    discount: 0,
    standard_bags: [
      { id: 3, service_id: 2, description: 'High-quality organic fertilizer' },
    ]
  },
  { id: 3, service_name: 'Pool Cleaning', price: 100, price_today: 90, discount: 10, standard_bags: [] },
  { id: 4, service_name: 'Window Washing', price: 60, price_today: 60, discount: 0, standard_bags: [] },
];

export const mockBookings: Booking[] = [
  { 
    id: 1, 
    user_id: 101, 
    user_name: 'John Doe', 
    service_id: 1, 
    service_name: 'Deep Cleaning', 
    booking_date: '2026-03-27', 
    start_time: '09:00',
    hours: 4,
    total_price: 480, 
    status: 'confirmed', 
    payment_status: 'paid',
    notes: 'Please be careful with the glass table in the living room. It is very fragile and expensive.'
  },
  { 
    id: 2, 
    user_id: 102, 
    user_name: 'Jane Smith', 
    service_id: 2, 
    service_name: 'Garden Maintenance', 
    booking_date: '2026-03-28', 
    start_time: '14:00',
    hours: 2,
    total_price: 160, 
    status: 'pending', 
    payment_status: 'unpaid',
    notes: 'The back gate is a bit sticky, you might need to pull it hard to open it. Also, please don\'t trim the roses yet.'
  },
  { 
    id: 3, 
    user_id: 103, 
    user_name: 'Mike Johnson', 
    service_id: 3, 
    service_name: 'Pool Cleaning', 
    booking_date: '2026-03-29', 
    start_time: '10:00',
    hours: 3,
    total_price: 270, 
    status: 'cancelled', 
    payment_status: 'unpaid',
    notes: 'The pool has been quite green lately, might need extra chlorine.'
  },
];

export const mockAvailability: Availability[] = [
  { id: 1, service_id: 1, day_of_week: 1, start_time: '08:00', end_time: '12:00', is_available: true },
  { id: 2, service_id: 1, day_of_week: 1, start_time: '14:00', end_time: '20:00', is_available: true },
  { id: 3, service_id: 1, day_of_week: 2, start_time: '09:00', end_time: '17:00', is_available: true },
  { id: 4, service_id: 2, day_of_week: 1, start_time: '08:00', end_time: '17:00', is_available: true },
  { id: 5, service_id: 3, day_of_week: 3, start_time: '10:00', end_time: '18:00', is_available: true },
];

export const mockStats: DashboardStats = {
  totalBookings: 124,
  totalRevenue: 15420,
  activeServices: 8,
  pendingBookings: 12,
};

// API Endpoints (Mocked for now)
export const apiEndpoints = {
  getProfile: () => Promise.resolve({ data: mockProfile }),
  getServices: () => Promise.resolve({ data: mockServices }),
  getBookings: () => Promise.resolve({ data: mockBookings }),
  getAvailability: () => Promise.resolve({ data: mockAvailability }),
  getStats: () => Promise.resolve({ data: mockStats }),
  
  updateBookingStatus: (id: number, status: string) => Promise.resolve({ data: { id, status } }),
  updatePaymentStatus: (id: number, status: string) => Promise.resolve({ data: { id, status } }),
  
  createService: (service: Omit<Service, 'id'>) => Promise.resolve({ data: { ...service, id: Math.random() } }),
  updateService: (id: number, service: Partial<Service>) => Promise.resolve({ data: { ...service, id } }),
  deleteService: (id: number) => Promise.resolve({ data: { id } }),

  createAvailability: (availability: Omit<Availability, 'id'>) => Promise.resolve({ data: { ...availability, id: Math.random() } }),
  updateAvailability: (id: number, availability: Partial<Availability>) => Promise.resolve({ data: { ...availability, id } }),
  deleteAvailability: (id: number) => Promise.resolve({ data: { id } }),

  createStandardBag: (bag: Omit<StandardBag, 'id'>) => Promise.resolve({ data: { ...bag, id: Math.random() } }),
  updateStandardBag: (id: number, bag: Partial<StandardBag>) => Promise.resolve({ data: { ...bag, id } }),
  deleteStandardBag: (id: number) => Promise.resolve({ data: { id } }),

  getStaff: () => Promise.resolve({ data: mockStaff }),
  createStaff: (staff: Omit<Staff, 'id'>) => Promise.resolve({ data: { ...staff, id: Math.random() } }),
  updateStaff: (id: number, staff: Partial<Staff>) => Promise.resolve({ data: { ...staff, id } }),
  deleteStaff: (id: number) => Promise.resolve({ data: { id } }),
};
