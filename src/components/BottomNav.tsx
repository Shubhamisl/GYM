import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Home' },
  { to: '/tracker', icon: 'fitness_center', label: 'Tracker' },
  { to: '/stats', icon: 'calendar_month', label: 'Stats' },
  { to: '/builder', icon: 'architecture', label: 'Builder' },
  { to: '/party', icon: 'diversity_3', label: 'Squad' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export const BottomNav: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors duration-200 ${
      isActive
        ? 'text-primary'
        : 'text-on-surface-variant hover:text-on-surface'
    }`;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#091328]/95 backdrop-blur-xl border-t border-[#192540] flex safe-bottom">
      {navItems.map(item => (
        <NavLink key={item.to} to={item.to} className={navClass} end={item.to === '/'}>
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
