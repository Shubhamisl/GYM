import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserSettings } from '../hooks/useUserSettings';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { currentUser, logout } = useAuth();
  const { profile } = useUserSettings();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 font-manrope tracking-tight text-sm transition-all duration-300 rounded-[1rem] ${
      isActive 
        ? 'bg-surface-container-high text-primary border-l-4 border-primary-dim' 
        : 'text-on-surface-variant hover:text-on-surface border-l-4 border-transparent hover:bg-surface-container-high'
    }`;

  return (
    <aside className={`hidden lg:flex w-[250px] h-full fixed left-0 top-0 border-r border-[#192540] bg-[#091328] flex-col p-4 z-50 ${className}`}>
      <div className="mb-10 px-2 mt-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#dee5ff] uppercase font-manrope">
          IRON<span className="text-primary">TRACK</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-[#a3aac4] font-medium mt-1">Elite Performance</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavLink to="/" className={navClass}>
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </NavLink>
        <NavLink to="/tracker" className={navClass}>
          <span className="material-symbols-outlined">fitness_center</span>
          Workout Tracker
        </NavLink>
        <NavLink to="/stats" className={navClass}>
          <span className="material-symbols-outlined">calendar_month</span>
          Stats & Calendar
        </NavLink>
        <NavLink to="/builder" className={navClass}>
          <span className="material-symbols-outlined">architecture</span>
          Program Builder
        </NavLink>
        <NavLink to="/party" className={navClass}>
          <span className="material-symbols-outlined">diversity_3</span>
          Iron Fellowship
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          <span className="material-symbols-outlined">settings</span>
          Settings
        </NavLink>
      </nav>
      
      <div className="mt-auto p-4 rounded-2xl bg-[#141f38] border border-[#192540] flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[#9396ff] flex items-center justify-center text-xl">
            {profile.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#dee5ff] truncate">{profile.displayName || currentUser?.email?.split('@')[0] || 'Guest'}</p>
            <p className="text-[10px] text-[#a3a6ff] uppercase font-bold tracking-tighter">Onyx Member</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-[#a3aac4] hover:text-[#ff6e84] transition-colors p-1" title="Logout">
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
