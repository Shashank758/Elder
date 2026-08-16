import React from 'react';
import { useEcosystem } from '../../context/EcosystemContext';
import type { AppScreen } from '../../types';
import {
  LayoutDashboard, Heart, Activity, Pill, Bot, Home,
  ShieldAlert, Users, FileText, Sparkles, Settings, X, ArrowLeft,
  Sun, Moon, LogOut, BrainCircuit
} from 'lucide-react';

interface NavItem {
  id: AppScreen;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const {
    screen, setScreen, triggerFallAlert,
    mobileMenuOpen, setMobileMenuOpen,
    darkMode, setDarkMode, speakText, logout, currentUser
  } = useEcosystem();

  const mainNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'ai360', label: 'ElderGuard AI 360', icon: <BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse" />, badge: 'AI' },
    { id: 'smarthome', label: 'Smart Home Hub', icon: <Home className="w-4 h-4" /> },
    { id: 'prediction', label: 'Health Telemetry', icon: <Heart className="w-4 h-4" /> },
    { id: 'motion', label: 'Activity & Fall', icon: <Activity className="w-4 h-4" /> },
    { id: 'medicine', label: 'Medicine', icon: <Pill className="w-4 h-4" /> },
    { id: 'companion', label: 'AI Companion', icon: <Bot className="w-4 h-4" /> },
    { id: 'emergency', label: 'Emergency Alerts', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'family', label: 'Family Portal', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'spiritual', label: 'Spiritual Sanctuary', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const navigateTo = (id: AppScreen) => {
    setScreen(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile & Desktop Sidebar Drawer Container */}
      <aside className={`
        app-sidebar shrink-0 p-4 flex flex-col justify-between overflow-y-auto transition-all duration-300
        ${mobileMenuOpen
          ? 'fixed inset-y-0 left-0 w-72 sm:w-80 z-50 bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800'
          : 'hidden lg:flex lg:w-60 lg:relative lg:z-0'
        }
      `}>
        <div>
          {/* Mobile Drawer Header with Back & Close Buttons */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Back</span>
            </button>
            <span className="font-extrabold text-xs font-heading text-slate-900 dark:text-white">All Modules</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-1">
            {mainNav.map(item => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`
                    flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all w-full text-left active:scale-98
                    ${active
                      ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }
                  `}
                >
                  <span className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Theme Toggle, SOS, Logout (mobile drawer footer) */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          {/* Theme Toggle — mobile-only (hidden on desktop sidebar since header has it) */}
          <button
            onClick={() => {
              const next = !darkMode;
              setDarkMode(next);
              speakText(next ? "Dark theme" : "Light theme");
            }}
            className="lg:hidden w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Emergency SOS */}
          <button
            onClick={() => {
              triggerFallAlert();
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors shadow-xs"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Emergency SOS</span>
          </button>

          {/* Logout — mobile-only (hidden on desktop sidebar since header has it) */}
          {currentUser && (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="lg:hidden w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout ({currentUser.name})</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Fixed for quick touch access) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-1.5 px-1 mobile-nav-shadow mobile-safe-bottom">
        {[
          { id: 'dashboard' as AppScreen, icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home' },
          { id: 'smarthome' as AppScreen, icon: <Home className="w-5 h-5" />, label: 'Smart Hub' },
          { id: 'prediction' as AppScreen, icon: <Heart className="w-5 h-5" />, label: 'Health' },
          { id: 'companion' as AppScreen, icon: <Bot className="w-5 h-5" />, label: 'AI Companion' },
          { id: 'medicine' as AppScreen, icon: <Pill className="w-5 h-5" />, label: 'Medicine' },
        ].map(t => {
          const isActive = screen === t.id;
          return (
            <button
              key={t.id}
              onClick={() => navigateTo(t.id)}
              className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl text-[10px] font-bold transition-all active:scale-95 max-w-[64px] ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-500/20' : ''}`}>
                {t.icon}
              </div>
              <span className="truncate w-full text-center">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
