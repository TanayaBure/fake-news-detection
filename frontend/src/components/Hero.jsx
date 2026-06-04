import React from 'react';
import {
  Sparkles,
  Search,
  BarChart3,
  ShieldCheck,
  Terminal,
  BrainCircuit,
  Cpu,
  Zap
} from 'lucide-react';
import Timeline from './Timeline';

export default function Hero({ onStartAnalyze, onViewAnalytics }) {
  const features = [
    {
      title: 'Fake News Detection',
      desc: 'Harnesses Logistic Regression pipelines to classify incoming articles with superior predictive boundaries.',
      icon: ShieldCheck,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Explainable AI (XAI)',
      desc: 'Transparent verification powered by LIME, displaying exactly which words impacted the machine classifier.',
      icon: BrainCircuit,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'NLP Processing',
      desc: 'Performs token cleanings, non-alphabetic filtering, lowercase conversions, and Porter Stemmer removals.',
      icon: Terminal,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'TF-IDF Vectorization',
      desc: 'Transforms raw textual streams into robust numerical matrices over a curated 5,000 keyword dictionary.',
      icon: Cpu,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Real-Time Prediction',
      desc: 'Extremely lightweight, optimized execution paths deliver classification verdicts within a split-second.',
      icon: Zap,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    },
    {
      title: 'Confidence Analysis',
      desc: 'Calculates exact probabilities for each output class, establishing statistical certainty metrics.',
      icon: BarChart3,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-4 animate-fade-in">

      {/* 1. Centered Premium Welcome / Hero Section */}
      <section className="flex flex-col items-center justify-center text-center relative py-6">

        {/* Glowing Decorative Aura in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/15 blur-[80px] pointer-events-none -z-10 animate-pulse-slow" />

        {/* Center Welcome Card */}
        <div className="max-w-4xl w-full p-8 md:p-12 rounded-[32px] glass-card-neon border-white/12 shadow-[0_30px_80px_rgba(37,99,235,0.25)] flex flex-col items-center justify-center relative overflow-hidden group">

          {/* Subtle Cyber Grid watermark inside card */}
          <div className="absolute inset-0 ai-grid-background opacity-[0.2] pointer-events-none" />

          {/* Glowing animated AI core icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 opacity-30 blur-md animate-ping" style={{ animationDuration: '3s' }} />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-white/20 relative z-10 animate-float">
              🧠
            </div>
          </div>

          {/* Glowing technology badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 relative z-10">
            {['NLP', 'Machine Learning', 'LIME', 'Explainable AI'].map((badge, idx) => (
              <span
                key={idx}
                className="text-[10px] tracking-wider font-extrabold uppercase px-3.5 py-1.5 rounded-full tech-badge text-slate-300 hover:text-white cursor-default select-none"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Main heading */}
          <h1 className="font-display font-black text-4xl md:text-[56px] leading-[1.1] tracking-tight mb-4 select-none">
            <span className="text-gradient drop-shadow-[0_2px_10px_rgba(37,99,235,0.2)]">
              Fake News Detection
            </span>
            <br />
            <span className="text-white">System Dashboard</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 font-medium text-base md:text-lg max-w-xl leading-relaxed mb-10 select-none">
            Analyze, verify, and demystify news articles using advanced Natural Language Processing and transparent Explainable Artificial Intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative z-10">
            <button
              onClick={onStartAnalyze}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-display font-bold text-sm shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.65)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <Search size={16} />
              Analyze News Article
            </button>
            <button
              onClick={onViewAnalytics}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-display font-bold text-sm border border-white/10 hover:border-white/20 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <BarChart3 size={16} />
              View System Analytics
            </button>
          </div>

          {/* Bottom Card glow corner */}
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />
        </div>
      </section>

      {/* 2. Features Grid Section */}
      <section className="flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Comprehensive Analysis Engine
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto font-medium">
            Explore the premium research-grade algorithms powering our transparent detection workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col items-start gap-4 text-left select-none relative overflow-hidden group border-white/6"
              >
                {/* Glowing Aura inside feature cards on hover */}
                <div className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 blur-lg transition-all duration-500" />

                <div className={`p-3 rounded-xl border ${feat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-100 group-hover:text-white transition-colors duration-300">
                    {feat.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Horizontal Processing Pipeline Timeline */}
      <section className="border-t border-white/5 pt-16">
        <Timeline />
      </section>

    </div>
  );
}
