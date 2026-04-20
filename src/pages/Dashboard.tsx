import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Briefcase,
  Clock,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { Button } from "../components/Button";
import { Booking } from "../types";
import { formatCurrency } from "../lib/utils";
import { Badge } from "../components/Badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<{ stats: any; chartData: any[] } | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = localStorage.getItem("role") || "admin";

  useEffect(() => {
     const loadMockData = () => {
      setIsLoading(true);
      
       const mockStats = {
        totalRevenue: 154.3,
        totalBookings: 124,
        activeServices: 12,
        pendingBookings: 8,
      };

       const mockChartData = [
        { name: "Mon", revenue: 4000 },
        { name: "Tue", revenue: 3000 },
        { name: "Wed", revenue: 5000 },
        { name: "Thu", revenue: 2780 },
        { name: "Fri", revenue: 1890 },
        { name: "Sat", revenue: 2390 },
        { name: "Sun", revenue: 3490 },
      ];

      // بيانات الحجوزات الوهمية
      const mockBookings: any[] = [
        {
          id: "1",
          customer_name: "Ahmed Ali",
          service: { service_name: "Full Car Wash" },
          booking_date: new Date().toISOString(),
          status: "confirmed",
          total_price: 150,
        },
        {
          id: "2",
          customer_name: "Sara Smith",
          service: { service_name: "Engine Checkup" },
          booking_date: new Date().toISOString(),
          status: "pending",
          total_price: 300,
        },
        {
          id: "3",
          customer_name: "John Doe",
          service: { service_name: "Oil Change" },
          booking_date: new Date().toISOString(),
          status: "error",
          total_price: 80,
        }
      ];

      setTimeout(() => {
        setData({ stats: mockStats, chartData: mockChartData });
        setRecentBookings(mockBookings);
        setIsLoading(false);
      }, 800); // تأخير بسيط لمحاكاة تجربة المستخدم
    };

    loadMockData();
  }, []);

  const columns = [
    {
      header: "Customer",
      accessor: (b: any) => (
        <span className="font-semibold text-carbon-black">
          {b.user?.user_name || b.customer_name || "Guest"}
        </span>
      ),
    },
    {
      header: "Service",
      accessor: (b: any) => b.service?.service_name || "General Service",
    },
    {
      header: "Date",
      accessor: (b: Booking) => new Date(b.booking_date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (b: Booking) => (
        <Badge
          variant={
            b.status === "confirmed"
              ? "success"
              : b.status === "pending"
                ? "warning"
                : "error"
          }
        >
          {b.status}
        </Badge>
      ),
    },
    {
      header: "Price",
      accessor: (b: Booking) => formatCurrency(b.total_price),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-carbon-black">
          {role === "admin" ? "Operations & Analytics" : "Staff Dashboard"}
        </h1>
        <p className="text-text-description mt-1">
          Real-time overview of your business performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(data?.stats?.totalRevenue || 0)}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Total Bookings"
          value={data?.stats?.totalBookings || 0}
          icon={CalendarIcon}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Active Services"
          value={data?.stats?.activeServices || 0}
          icon={Briefcase}
        />
        <StatCard
          label="Pending Bookings"
          value={data?.stats?.pendingBookings || 0}
          icon={Clock}
          trend={{ value: 4, isPositive: false }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border-light bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-semibold text-carbon-black">
              Weekly Revenue
            </h3>
            <Button variant="outline" size="sm" className="text-xs">
              View Report <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC143C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#DC143C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F2E6E6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#594A4A", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#594A4A", fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  itemStyle={{ color: "#0F0505" }}
                  cursor={{ stroke: "#F2E6E6", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B22222"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border-light bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-carbon-black mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button
              className="w-full justify-start text-xs h-11"
              variant="outline"
            >
              <Briefcase className="mr-3 h-4 w-4 text-slate-400" /> Add New
              Service
            </Button>
            <Button
              className="w-full justify-start text-xs h-11"
              variant="outline"
            >
              <CalendarIcon className="mr-3 h-4 w-4 text-slate-400" /> Schedule
              Availability
            </Button>
            <Button
              className="w-full justify-start text-xs h-11"
              variant="outline"
            >
              <Users className="mr-3 h-4 w-4 text-slate-400" /> Manage Staff
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-border-light bg-white px-4 pb-3 pt-4 shadow-sm sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-carbon-black">
              Recent Bookings
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
              See all
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={recentBookings}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;