import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, LogOut, Menu, X, Bell, 
  User, Users, UserCheck, UserCog,
  Package, Megaphone, ShoppingBag, 
  LayoutGrid, BoxSelect, Palette ,Tag ,Wrench
} from "lucide-react";import { cn } from "../lib/utils";
import { Button } from "./Button";
import { motion, AnimatePresence } from "motion/react";
import { NotificationPopover } from "./NotificationPopover";
import { Notification } from "../types";

const adminNavItems = [
  { icon: LayoutDashboard,  label: "Overview",        path: "/" },
  { icon: Users,            label: "User",            path: "/User" },

  { icon: UserCheck,        label: "Provider",        path: "/Provider" },
  { icon: UserCog,          label: "Customer",        path: "/Customer" },
  { icon: Tag  ,            label: "Category",        path: "/Category" },
  { icon: Wrench,           label: "Service",         path: "/Service" },
  { icon: Wrench,           label: "Posts",           path: "/Posts" },

  { icon: Package,          label: "Packages",        path: "/Packages" },
  { icon: Megaphone,        label: "Ads",             path: "/Ads" },
  { icon: ShoppingBag,      label: "Bag",             path: "/Bag" },
  { icon: LayoutGrid,       label: "Bags Categories", path: "/bags_categories" },
  { icon: BoxSelect,        label: "Bag Items",       path: "/bag_items" },
  { icon: Palette,          label: "Style Guide",     path: "/style-guide" },
];

const staffNavItems = [
  { icon: LayoutDashboard, label: "My Tasks", path: "/" },
 ];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "New Booking",
    message:
      "Ahmed Samir booked a Deep Cleaning service for tomorrow at 10:00 AM.",
    time: "2 mins ago",
    isRead: false,
    type: "info",
  },
  {
    id: 2,
    title: "Payment Received",
    message: "Payment of $120.00 received for Booking #1024.",
    time: "1 hour ago",
    isRead: false,
    type: "success",
  },
  {
    id: 3,
    title: "Staff Alert",
    message:
      "Staff member John Doe is running late for his 2:00 PM appointment.",
    time: "3 hours ago",
    isRead: true,
    type: "warning",
  },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );

  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";
  const navItems = role === "staff" ? staffNavItems : adminNavItems;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-screen bg-bg-surface overflow-hidden">
      {/* Sidebar - Desktop: Permanent, Mobile: Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] w-64 transform border-r border-border-light bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col",
          isSidebarOpen
            ? "translate-x-0 shadow-2xl lg:shadow-none"
            : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-border-light px-6 justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-solid flex items-center justify-center">
                <span
                  className="text-white font-bold text-xs tracking-tighter"
                  style={{ fontFamily: "'Brush Script MT', cursive" }}
                >
                  C
                </span>
              </div>
              <span className="text-lg font-bold tracking-tight text-carbon-black">
                b2b
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1"
            >
              <X className="h-5 w-5 text-slate-400" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-tint text-emerald-text"
                      : "text-carbon-gray hover:bg-slate-50 hover:text-carbon-black",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-emerald-solid" : "text-slate-400",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border-light p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-carbon-gray hover:text-carbon-black hover:bg-slate-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-[55] bg-carbon-black/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border-light bg-white px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-emerald-solid flex items-center justify-center">
              <span
                className="text-white font-bold text-xs tracking-tighter"
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                C
              </span>
            </div>
            <span className="text-base font-bold tracking-tight text-carbon-black">
              b2b
            </span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 lg:gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "relative rounded-full p-2 transition-all duration-200",
                  isNotificationsOpen
                    ? "bg-emerald-tint text-emerald-text"
                    : "hover:bg-slate-50",
                )}
              >
                <Bell
                  className={cn(
                    "h-5 w-5",
                    isNotificationsOpen
                      ? "text-emerald-solid"
                      : "text-slate-400",
                  )}
                />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-solid border-2 border-white" />
                )}
              </Button>

              <NotificationPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
              />
            </div>

            <div className="flex items-center gap-2 lg:gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-carbon-black leading-none">
                  Ahmed Samir
                </p>
                <p className="text-[10px] text-slate-400 mt-1 capitalize">
                  {role}
                </p>
              </div>
              <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-slate-100 border border-border-light overflow-hidden">
                <img
                  src="https://picsum.photos/seed/user/100/100"
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Bottom Navigation - Mobile only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-light px-2 py-1 z-50 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.03)] min-h-[64px] pb-safe">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-300 active:scale-95",
                  isActive ? "text-emerald-solid" : "text-slate-400 hover:text-emerald-solid/70"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive && "bg-emerald-tint"
                )}>
                  <item.icon className="h-5 w-5 mb-1" />
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}

          {/* More Menu for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-300 active:scale-95",
              isSidebarOpen ? "text-emerald-solid" : "text-slate-400 hover:text-emerald-solid/70"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              isSidebarOpen && "bg-emerald-tint"
            )}>
              <Menu className="h-5 w-5 mb-1" />
            </div>
            <span className="text-[10px] font-semibold">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
