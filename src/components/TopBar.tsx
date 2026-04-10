import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMetricSearchResults } from '../utils/irontrackUtils';

interface TopBarProps {
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const results = getMetricSearchResults(query);

  const goTo = (to: string) => {
    setQuery('');
    navigate(to);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[250px] h-14 lg:h-16 bg-[#060e20]/60 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 z-40">
      <h2 className="text-[#dee5ff] font-black uppercase tracking-widest font-manrope text-sm lg:text-xl">{title}</h2>
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative group hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="bg-surface-container-highest border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary w-64 transition-all" 
            placeholder="Search metrics..." 
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results[0]) {
                goTo(results[0].to);
              }
            }}
          />
          {query && (
            <div className="absolute right-0 top-12 w-72 rounded-xl border border-outline-variant/20 bg-surface-container-high shadow-2xl overflow-hidden">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={`${result.label}-${result.to}`}
                    onClick={() => goTo(result.to)}
                    className="w-full px-4 py-3 text-left hover:bg-surface-variant transition-colors"
                  >
                    <span className="block text-sm font-bold text-on-surface">{result.label}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{result.to}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm font-bold text-on-surface-variant">No matching metric</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 lg:gap-4 text-[#a3a6ff]">
          <button className="material-symbols-outlined text-xl lg:text-2xl opacity-80 hover:opacity-100 transition-colors">notifications</button>
          <button
            onClick={() => navigate('/settings')}
            className="material-symbols-outlined text-xl lg:text-2xl opacity-80 hover:opacity-100 transition-colors"
            title="Open profile settings"
          >
            account_circle
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
