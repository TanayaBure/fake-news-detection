import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Trash2, 
  ArrowUpRight, 
  Search, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Filter
} from 'lucide-react';

export default function History({ onLoadText, setActiveTab }) {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, real, fake

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('sentinel_history') || '[]');
    setHistoryList(list);
  }, []);

  const handleDelete = (id) => {
    const updated = historyList.filter(item => item.id !== id);
    localStorage.setItem('sentinel_history', JSON.stringify(updated));
    setHistoryList(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all analysis history?")) {
      localStorage.removeItem('sentinel_history');
      setHistoryList([]);
    }
  };

  const filteredList = historyList.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.fullText && item.fullText.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && item.prediction.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in text-left select-none relative z-20">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        
        {/* Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <HistoryIcon size={20} className="animate-pulse-slow" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-white">Local Audit Logs</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Browse and review past news article audits saved directly in your browser.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audited articles..."
              className="w-full bg-slate-950/40 rounded-xl border border-white/8 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-950/40 rounded-xl border border-white/8 p-1 relative z-10 w-full sm:w-auto">
            {['all', 'real', 'fake'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
                  filterType === type 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Clear all */}
          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer select-none"
            >
              Clear Logs
            </button>
          )}

        </div>

      </div>

      {/* 2. List Body */}
      {filteredList.length === 0 ? (
        
        // Empty State View
        <div className="rounded-3xl glass-panel p-16 flex flex-col items-center justify-center text-center max-w-xl mx-auto border-white/6 mt-6 select-none">
          <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center text-slate-500 text-3xl mb-6 animate-float">
            📋
          </div>
          <h3 className="font-display font-extrabold text-base text-slate-200">
            {searchQuery || filterType !== 'all' ? 'No Matching Records' : 'Audit Logs Empty'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium mt-2 max-w-xs">
            {searchQuery || filterType !== 'all' 
              ? 'Try modifying your search text or removing the type filter bounds.' 
              : 'Save news analysis sessions inside the Workspace dashboard to view logs here.'
            }
          </p>
        </div>

      ) : (

        // List Grid Layout
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((item) => {
            const isFake = item.prediction === 'Fake';
            return (
              <div 
                key={item.id}
                className="rounded-2xl glass-panel border-white/6 p-5 flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300"
              >
                
                {/* Visual Glow corners */}
                <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-[0.06] blur-xl transition-opacity duration-300 pointer-events-none ${isFake ? 'bg-rose-500' : 'bg-emerald-500'}`} />

                {/* Card Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    {isFake ? (
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                        <AlertTriangle size={14} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                        <CheckCircle size={14} />
                      </div>
                    )}
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isFake ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {item.prediction} News
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold mt-0.5">
                        <Calendar size={10} />
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <span className={`px-2 py-1 rounded bg-slate-900 border text-[10px] font-mono font-bold leading-none ${isFake ? 'border-rose-500/20 text-rose-300' : 'border-emerald-500/20 text-emerald-300'}`}>
                    Conf: {((item.confidence > 1 ? item.confidence : item.confidence * 100)).toFixed(1)}%
                  </span>
                </div>

                {/* Article snippet */}
                <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-3 select-text bg-slate-950/20 rounded-xl border border-white/4 p-3 font-mono">
                  "{item.text}"
                </p>

                {/* Card footer options */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3.5">
                  
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:border-rose-500/25 hover:bg-rose-500/5 transition-all cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Load back to workspace */}
                  <button
                    onClick={() => {
                      onLoadText(item.fullText || item.text);
                      setActiveTab('workspace');
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 text-[10px] font-bold transition-all cursor-pointer select-none"
                  >
                    Load in Workspace
                    <ArrowUpRight size={12} />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      )}
      
    </div>
  );
}
