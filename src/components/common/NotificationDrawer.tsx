import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { X, Check, Bell, ShieldAlert, Pill, Home, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead } = useEcosystem();

  const typeIcons = {
    emergency: <ShieldAlert className="w-5 h-5 text-rose-500" />,
    medicine: <Pill className="w-5 h-5 text-emerald-500" />,
    smarthome: <Home className="w-5 h-5 text-cyan-500" />,
    health: <Heart className="w-5 h-5 text-rose-500" />,
    spiritual: <Bell className="w-5 h-5 text-amber-500" />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-slate-900 z-50 border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Notifications</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List */}
              <div className="flex flex-col gap-3 mt-4">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      n.read
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                        : 'bg-blue-50/50 dark:bg-slate-800 border-blue-200 dark:border-blue-500/30 text-slate-900 dark:text-slate-100 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {typeIcons[n.type]}
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-xs mt-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                    {!n.read && (
                      <div className="flex justify-end mt-2">
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> Mark Read
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-mono text-slate-400">
              Firebase Realtime Database & FCM Sync Connected
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
