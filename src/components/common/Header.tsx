import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import { 
  ShieldAlert, Bell, LogOut, Sun, Moon, Watch, BatteryCharging, Shield
} from 'lucide-react';

interface HeaderProps {
  toggleNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleNotifications }) => {
  const {
    setScreen, role, currentUser, logout,
    triggerFallAlert, unreadCount,
    darkMode, setDarkMode, speakText
  } = useEcosystem();

  return (
    <header className="sticky top-0 z-40 w-full app-header px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">

      {/* Left: Brand Logo & Tagline */}
      <div
        onClick={() => {
          if (role === 'Doctor') setScreen('doctor');
          else if (role === 'Family') setScreen('family');
          else if (role === 'Admin') setScreen('admin');
          else setScreen('dashboard');
        }}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-sm sm:text-base font-extrabold font-heading tracking-tight group-hover:text-blue-600 transition-colors">
              ElderGuard <span className="text-blue-600">AI</span>
            </span>
          </div>
          <p className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide">
            Care. Protect. Empower.
          </p>
        </div>
      </div>

      {/* Center: Greeting & Live Telemetry Pills (Desktop & Tablet) */}
      <div className="hidden lg:flex items-center gap-4">
        <div>
          <h2 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
            Good Morning, <span className="text-blue-600">{currentUser?.name || 'Devendra'}</span> 👋
          </h2>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />

        {/* Telemetry Status Pills */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
            <Watch className="w-3.5 h-3.5 text-emerald-500" /> Watch Connected
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-blue-500" /> 100%
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> SOS Ready
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

        {/* Dark/Light Theme Switcher */}
        <button
          onClick={() => {
            const next = !darkMode;
            setDarkMode(next);
            speakText(next ? "Dark theme" : "Light theme");
          }}
          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notifications */}
        <button
          onClick={toggleNotifications}
          className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Emergency SOS Button */}
        <button
          onClick={triggerFallAlert}
          className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 sm:gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>SOS</span>
        </button>

        {/* Profile Avatar & Logout */}
        {currentUser && (
          <div className="flex items-center gap-1 sm:gap-2 ml-0.5 sm:ml-1">
            <span className="text-lg sm:text-xl">{currentUser.avatar}</span>
            <button
              onClick={logout}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
