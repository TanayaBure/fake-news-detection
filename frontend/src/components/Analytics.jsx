import React from 'react';
import { 
  BarChart3, 
  Target, 
  GitCommit, 
  Grid3X3, 
  Layers2, 
  Info,
  LineChart
} from 'lucide-react';

export default function Analytics() {
  const stats = [
    { title: 'Model Accuracy', value: '94.12%', desc: 'Overall classification correctness', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
    { title: 'Precision Score', value: '93.45%', desc: 'Minimizes false positive alerts', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
    { title: 'Recall Rating', value: '94.01%', desc: 'Minimizes false negative leaks', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
    { title: 'F1-Score Rating', value: '93.73%', desc: 'Harmonic mean of model precision', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' }
  ];

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in text-left select-none relative z-20">
      
      {/* 1. Header Row */}
      <div className="flex items-center gap-3.5 border-b border-white/5 pb-6">
        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
          <BarChart3 size={20} className="animate-pulse-slow" />
        </div>
        <div>
          <h2 className="font-display font-black text-2xl text-white">System Performance Analytics</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Review detailed statistical breakdowns of the model's accuracy, precision, and error boundaries.
          </p>
        </div>
      </div>

      {/* 2. Stat Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            className={`p-5 rounded-2xl border glass-panel flex flex-col gap-2 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${stat.color}`}
          >
            {/* Soft decorative background dot */}
            <div className="absolute right-[-10px] top-[-10px] w-12 h-12 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 bg-white" />
            
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {stat.title}
            </span>
            <span className="font-display font-black text-3xl text-white">
              {stat.value}
            </span>
            <p className="text-[10px] text-slate-500 font-bold leading-normal">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Confusion Matrix & ROC-AUC Chart Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-2">
        
        {/* 3a. SVG Confusion Matrix */}
        <div className="rounded-3xl glass-panel p-6 md:p-8 border-white/6 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute inset-0 ai-grid-background opacity-[0.03]" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Grid3X3 size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-white">Confusion Error Matrix</span>
            </div>
            <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">2x2 grid</span>
          </div>

          {/* Matrix body */}
          <div className="flex-grow flex flex-col justify-center items-center py-4 select-none">
            
            {/* Container for grid labels */}
            <div className="relative w-80 h-80 flex flex-col gap-3 justify-end pr-2 pb-2">
              
              {/* Row Label (Actual) */}
              <div className="absolute left-[-45px] top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">
                Actual Class
              </div>

              {/* Col Label (Predicted) */}
              <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">
                Predicted Class
              </div>

              {/* Col Header tags */}
              <div className="flex justify-between w-full pl-16 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">
                <span className="w-28">REAL (-Legit)</span>
                <span className="w-28">FAKE (+Suspect)</span>
              </div>

              <div className="flex items-center gap-3 w-full">
                {/* Row Header tag */}
                <span className="w-14 text-right text-[9px] font-black text-slate-500 uppercase tracking-wider leading-tight">
                  REAL
                </span>
                
                {/* Grid row 1 */}
                <div className="flex-1 flex gap-3">
                  {/* True Negative */}
                  <div className="flex-1 h-28 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 flex flex-col items-center justify-center p-3 relative group transition-colors">
                    <span className="text-xl font-black text-emerald-400 font-mono">94.8%</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-1 leading-none uppercase">True Negative (TN)</span>
                    <span className="text-[8px] text-slate-500 font-medium mt-1">Legitimate classified correctly</span>
                  </div>
                  {/* False Positive */}
                  <div className="flex-1 h-28 rounded-2xl bg-white/2 hover:bg-white/4 border border-white/5 flex flex-col items-center justify-center p-3 relative group transition-colors">
                    <span className="text-xl font-black text-slate-400 font-mono">5.2%</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-1 leading-none uppercase">False Positive (FP)</span>
                    <span className="text-[8px] text-slate-500 font-medium mt-1">Legitimate flagged as Fake</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                {/* Row Header tag */}
                <span className="w-14 text-right text-[9px] font-black text-slate-500 uppercase tracking-wider leading-tight">
                  FAKE
                </span>
                
                {/* Grid row 2 */}
                <div className="flex-1 flex gap-3">
                  {/* False Negative */}
                  <div className="flex-1 h-28 rounded-2xl bg-white/2 hover:bg-white/4 border border-white/5 flex flex-col items-center justify-center p-3 relative group transition-colors">
                    <span className="text-xl font-black text-slate-400 font-mono">6.6%</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-1 leading-none uppercase">False Negative (FN)</span>
                    <span className="text-[8px] text-slate-500 font-medium mt-1">Fake classified as Real</span>
                  </div>
                  {/* True Positive */}
                  <div className="flex-1 h-28 rounded-2xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 flex flex-col items-center justify-center p-3 relative group transition-colors">
                    <span className="text-xl font-black text-rose-400 font-mono text-gradient-rose">93.4%</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-1 leading-none uppercase">True Positive (TP)</span>
                    <span className="text-[8px] text-slate-500 font-medium mt-1">Fake classified correctly</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3b. ROC-AUC Bezier Curvature Chart */}
        <div className="rounded-3xl glass-panel p-6 md:p-8 border-white/6 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute inset-0 ai-grid-background opacity-[0.03]" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <LineChart size={16} className="text-purple-400" />
              <span className="text-xs font-bold text-white">ROC-AUC Classification Curves</span>
            </div>
            <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">Sensitivity plot</span>
          </div>

          {/* Curve drawing wrapper */}
          <div className="flex-grow flex flex-col justify-center items-center py-4">
            <div className="relative w-80 h-72 border-b border-l border-white/10 px-2 pb-2">
              
              {/* Plot labels */}
              <div className="absolute left-[-45px] top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-slate-500 font-black tracking-widest uppercase">
                True Positive Rate
              </div>
              <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[8px] text-slate-500 font-black tracking-widest uppercase">
                False Positive Rate
              </div>

              {/* Dotted threshold guidelines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                {/* 50-50 random guess line */}
                <line 
                  x1="0" y1="288" x2="320" y2="0" 
                  className="stroke-white/5" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                
                {/* Ideal ROC bounds line */}
                <path 
                  d="M 0,288 C 10,10 50,0 320,0" 
                  fill="none" 
                  className="stroke-purple-500/80 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]" 
                  strokeWidth="3.5"
                />

                {/* Shaded Area under curve fill */}
                <path 
                  d="M 0,288 C 10,10 50,0 320,0 L 320,288 Z" 
                  fill="url(#rocGlowGrad)"
                  className="opacity-15"
                />

                <defs>
                  <linearGradient id="rocGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Graph metadata overlay */}
              <div className="absolute right-4 bottom-4 p-3 rounded-xl bg-slate-950/80 border border-white/5 flex flex-col gap-1 text-[10px] font-bold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 rounded bg-purple-500" />
                  <span>Sentinel Model Area</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px]">
                  <span className="text-cyan-400">AUC Index:</span>
                  <span className="text-white">0.9842 (Superb)</span>
                </div>
              </div>

              <span className="absolute left-[-16px] top-0 text-[8px] font-mono text-slate-500">1.0</span>
              <span className="absolute left-[-16px] bottom-0 text-[8px] font-mono text-slate-500">0.0</span>
              <span className="absolute right-0 bottom-[-16px] text-[8px] font-mono text-slate-500">1.0</span>
              
            </div>
          </div>
        </div>

      </div>

      {/* 4. Dataset scope details */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950/20 to-slate-900/10 border border-white/6 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mt-2">
        <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-indigo-500/5 blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <Layers2 size={22} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-white text-base">Trained Corpus Scope</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
              SentinelAI utilizes double-cleansed benchmark research sets featuring a heavy volume of balanced records.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 font-mono text-xs">
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col text-center">
            <span className="text-slate-500 text-[8px] font-black uppercase font-sans">Total Articles</span>
            <span className="text-white font-extrabold text-sm mt-0.5">44,898</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col text-center">
            <span className="text-emerald-400 text-[8px] font-black uppercase font-sans">Real News</span>
            <span className="text-white font-extrabold text-sm mt-0.5">21,417</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col text-center">
            <span className="text-rose-400 text-[8px] font-black uppercase font-sans">Fake News</span>
            <span className="text-white font-extrabold text-sm mt-0.5">23,481</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
