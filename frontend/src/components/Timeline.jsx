import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Fingerprint, 
  Cpu, 
  LineChart, 
  ShieldCheck 
} from 'lucide-react';

export default function Timeline() {
  const steps = [
    {
      number: '01',
      title: 'Enter News',
      desc: 'Input or paste the news article content into the workspace.',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      shadow: 'rgba(59, 130, 246, 0.4)',
    },
    {
      number: '02',
      title: 'Clean Text',
      desc: 'Tokenization, lowercase normalization, and stemming filters.',
      icon: Sparkles,
      color: 'from-cyan-500 to-indigo-500',
      shadow: 'rgba(6, 182, 212, 0.4)',
    },
    {
      number: '03',
      title: 'TF-IDF Matrix',
      desc: 'Compute term frequency weight vectors over 5000 features.',
      icon: Fingerprint,
      color: 'from-indigo-500 to-purple-500',
      shadow: 'rgba(99, 102, 241, 0.4)',
    },
    {
      number: '04',
      title: 'ML Prediction',
      desc: 'Run trained Logistic Regression pipeline classification.',
      icon: Cpu,
      color: 'from-purple-500 to-pink-500',
      shadow: 'rgba(168, 85, 247, 0.4)',
    },
    {
      number: '05',
      title: 'LIME Perturbation',
      desc: 'Perturb features locally to measure individual word weights.',
      icon: LineChart,
      color: 'from-pink-500 to-rose-500',
      shadow: 'rgba(236, 72, 153, 0.4)',
    },
    {
      number: '06',
      title: 'Final Verdict',
      desc: 'Visualize prediction confidence and exact word highlights.',
      icon: ShieldCheck,
      color: 'from-rose-500 to-emerald-500',
      shadow: 'rgba(16, 185, 129, 0.4)',
    },
  ];

  return (
    <div className="flex flex-col gap-10 py-4 select-none">
      <div className="text-center flex flex-col gap-2">
        <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
          Explainable ML Pipeline
        </h3>
        <p className="text-sm text-slate-400 max-w-xl mx-auto font-medium">
          How SentinelAI decodes text patterns to provide transparent, verifiable results step-by-step.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-6">
        
        {/* Glow connector bar for desktop lg screens */}
        <div className="hidden lg:block absolute top-[40px] left-[6%] right-[6%] h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-25" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center group relative z-10"
            >
              {/* Circular Icon Container */}
              <div 
                className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${step.color} p-[1px] shadow-[0_10px_30px_rgba(0,0,0,0.4)] group-hover:scale-105 duration-300 transition-all cursor-pointer`}
                style={{
                  boxShadow: `0 0 30px rgba(0, 0, 0, 0.4), 0 8px 20px ${step.shadow}`,
                }}
              >
                <div className="w-full h-full rounded-[23px] bg-slate-900 flex items-center justify-center text-white relative overflow-hidden">
                  <Icon size={24} className="group-hover:rotate-[6deg] transition-transform duration-300 relative z-10" />
                  
                  {/* Glowing background flow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                </div>
              </div>

              {/* Step Number Tag */}
              <span className={`text-[10px] mt-4 px-2 py-0.5 rounded-full font-black bg-gradient-to-tr ${step.color} text-white font-mono`}>
                {step.number}
              </span>

              {/* Title & Desc */}
              <h4 className="mt-3 font-display font-bold text-sm text-slate-100 group-hover:text-white transition-colors duration-300">
                {step.title}
              </h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed font-medium px-2 group-hover:text-slate-300 transition-colors duration-300">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
