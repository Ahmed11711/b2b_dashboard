import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  DollarSign,
  Briefcase,
  Clock,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Loader2,
  FileText,
  Settings,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { Button } from "../components/Button";
import { Booking } from "../types";
import { formatCurrency } from "../lib/utils";
import { Badge } from "../components/Badge";
import { getAll } from "../service/services/apiService";
import { useTranslation } from "../hooks/useTranslation";
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState<{ stats: any; chartData: any[] } | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = localStorage.getItem("role") || "admin";

useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        try {
            const [statsRes, bookingsRes, chartRes] = await Promise.all([
                getAll('dashboard/stats'),
                getAll('dashboard/recent-bookings'),
                getAll('dashboard/weekly-revenue'),
            ]);

            setData({
                stats:     statsRes.stats,
                chartData: chartRes.data,
            });
setRecentPosts(bookingsRes.data);
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setIsLoading(false);
        }
    }

    loadData();
}, []);
  const columns = [
    {
      header: t("common.title"),
      accessor: (p: any) => (
        <span className="font-semibold text-carbon-black">
          {p.title || p.user_name || t("common.untitled_post")}
        </span>
      ),
    },
    {
      header: t("common.author"),
      accessor: (p: any) => p.author?.user_name || p.user?.user_name || t("common.admin"),
    },
    {
      header: t("common.date"),
      accessor: (p: any) => p.created_at ? new Date(p.created_at).toLocaleDateString() : t("common.na"),
    },
    {
      header: t("common.status"),
      accessor: (p: any) => {
        const isActive = p.is_active !== undefined ? p.is_active : p.status;
        return (
          <Badge
            variant={
              isActive === 1 || isActive === "active"
                ? "success"
                : isActive === 0 || isActive === "inactive"
                  ? "error"
                  : "warning"
            }
          >
            {isActive === 1 || isActive === "active" 
              ? t("fields.active") 
              : isActive === 0 || isActive === "inactive" 
                ? t("fields.inactive") 
                : t("common.undefined")}
          </Badge>
        );
      },
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
          {role === "admin" ? t("dashboard.operations_analytics") : t("dashboard.staff_dashboard")}
        </h1>
        <p className="text-text-description mt-1">
          {t("dashboard.performance_overview")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("dashboard.total_revenue")}
          value={formatCurrency(data?.stats?.totalRevenue || 0)}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label={t("dashboard.total_bookings")}
          value={data?.stats?.totalBookings || 0}
          icon={CalendarIcon}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label={t("dashboard.active_services")}
          value={data?.stats?.activeServices || 0}
          icon={Briefcase}
        />
        <StatCard
          label={t("dashboard.pending_bookings")}
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
              {t("dashboard.weekly_revenue")}
            </h3>
            <Button variant="outline" size="sm" className="text-xs">
              {t("common.view_report")} <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
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
{/* Quick Actions */}
<div className="rounded-xl border border-border-light bg-white p-6 shadow-sm">
  <h3 className="text-base font-semibold text-carbon-black mb-6">
    Quick Actions
  </h3>
  <div className="space-y-3">
    <Button
      className="w-full justify-start text-xs h-11"
      variant="outline"
      onClick={() => navigate('/Provider')}
    >
      <Briefcase className="mr-3 h-4 w-4 text-slate-400" /> Add New Provider
    </Button>
    <Button
      className="w-full justify-start text-xs h-11"
      variant="outline"
      onClick={() => navigate('/Ads')}
    >
      <CalendarIcon className="mr-3 h-4 w-4 text-slate-400" /> Schedule Ads
    </Button>
    <Button
      className="w-full justify-start text-xs h-11"
      variant="outline"
      onClick={() => navigate('/Packages')}
    >
      <Users className="mr-3 h-4 w-4 text-slate-400" /> Packages
    </Button>
  </div>
</div>
      </div>

      {/* Recent Posts Table */}
      <div className="overflow-hidden rounded-2xl border border-border-light bg-white px-4 pb-3 pt-4 shadow-sm sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-carbon-black">
              {t("dashboard.recent_posts")}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => window.location.reload()}
            >
              {t("common.refresh")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate("/Posts")}
            >
              {t("common.see_all")}
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={recentPosts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;