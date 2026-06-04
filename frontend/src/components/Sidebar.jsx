import React from 'react';
import { 
  Home, 
  Terminal, 
  History as HistoryIcon, 
  BarChart3, 
  BookOpen, 
  Cpu, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isBackendConnected }) {
  const menuItems = [
    { id: 'home', name: 'Dashboard', icon: Home },
    { id: 'workspace', name: 'Workspace', icon: Terminal },
    { id: 'history', name: 'Local History', icon: HistoryIcon },
    { id: 'analytics', name: 'AI Analytics', icon: BarChart3 },
    { id: 'about', name: 'Methodology', icon: BookOpen },
  ];

  return (
    <aside className="w-72 h-[calc(100vh-2rem)] sticky top-4 left-4 flex flex-col justify-between p-6 rounded-3xl glass-panel border-white/8 shadow-2xl transition-all duration-300 z-40 select-none">
      
      {/* Brand Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3.5 px-2 py-1">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-white/20 animate-pulse-slow">
            📰
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg tracking-wider text-white leading-tight">
              SENTINEL<span className="text-blue-500">AI</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-bold tracking-[0.18em]">
              EXPLAINABLE AI
            </span>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="mt-4 px-2.5 py-2 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500 animate-pulse'}`} />
            <span className="text-[11px] font-semibold text-slate-400">
              {isBackendConnected ? 'ML Core Connected' : 'ML Server Offline'}
            </span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
            v2.0
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 my-8 flex-1 justify-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 relative ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600/15 to-indigo-600/5 text-white border-l-2 border-blue-500 shadow-md shadow-blue-500/5' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/3 border-l-2 border-transparent'
              }`}
            >
              {/* Background hover light effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <Icon 
                size={18} 
                className={`transition-all duration-300 relative z-10 ${
                  isActive 
                    ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' 
                    : 'group-hover:text-slate-300 group-hover:scale-105'
                }`} 
              />
              <span className="relative z-10">{item.name}</span>
              
              {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile Box */}
      <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
        {/* Decorative Mini Banner */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/20 border border-white/5 text-left relative overflow-hidden group hover:border-white/10 transition-colors duration-300">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-300">
            <Cpu size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-300 leading-none">Logistic Regression</div>
            <div className="text-[9px] text-indigo-400 font-semibold mt-1">LIME Perturbations</div>
          </div>
          {/* subtle background glow */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-indigo-500/5 blur-md" />
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-[0_4px_12px_rgba(59,130,246,0.25)] border border-white/10 select-none">
              TB
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-none">Tanaya Bure</span>
              <span className="text-[10px] text-slate-500 mt-1 font-semibold">Research Lead</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer transition-colors duration-200">
            ⚙️
          </div>
        </div>
      </div>
      
    </aside>
  );
}
