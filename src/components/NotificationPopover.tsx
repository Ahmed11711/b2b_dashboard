import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertCircle, Info, X, Clock } from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';
import { Button } from './Button';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onClearAll: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-solid" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-carbon-black/5 backdrop-blur-[2px] lg:hidden"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed right-4 top-16 z-[80] w-[calc(100vw-32px)] sm:w-80 overflow-hidden rounded-2xl border border-border-light bg-white shadow-2xl lg:absolute lg:right-0 lg:top-12"
          >
            <div className="flex items-center justify-between border-b border-border-light bg-slate-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-carbon-black" />
                <h3 className="text-sm font-bold tracking-tight text-carbon-black">Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-solid text-[10px] font-bold text-white">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearAll}
                className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-carbon-black"
              >
                Clear All
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                    <Bell className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-medium text-slate-400">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border-light">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => onMarkAsRead(notification.id)}
                      className={cn(
                        "group relative flex cursor-pointer gap-3 p-4 transition-colors hover:bg-slate-50",
                        !notification.isRead && "bg-emerald-tint/10"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm",
                          notification.type === 'success' ? "border-emerald-solid/20 bg-emerald-tint" :
                          notification.type === 'warning' ? "border-amber-200 bg-amber-50" :
                          notification.type === 'error' ? "border-red-200 bg-red-50" :
                          "border-blue-200 bg-blue-50"
                        )}>
                          {getIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            "text-xs font-bold text-carbon-black",
                            !notification.isRead && "text-emerald-text"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="shrink-0 text-[10px] font-medium text-slate-400">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500">
                          {notification.message}
                        </p>
                        {!notification.isRead && (
                          <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-solid">
                            <Clock className="h-3 w-3" />
                            New Alert
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-border-light bg-slate-50/30 p-3">
                <Button 
                  variant="ghost" 
                  className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-solid"
                  onClick={onClose}
                >
                  Close Panel
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
