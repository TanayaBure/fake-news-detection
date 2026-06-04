import React from 'react';
import { 
  BookOpen, 
  Terminal, 
  Binary, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Hash
} from 'lucide-react';

export default function About() {
  const steps = [
    { title: 'Alphanumeric Regex Filtering', desc: 'Isolates and retains only alphabetic character strings, stripping symbols and numeric indicators.' },
    { title: 'Lowercase Normalization', desc: 'Converts all texts to uniform lowercase sequences to remove typographical case discrepancy bias.' },
    { title: 'Stop-Word Elimination', desc: 'Strips extremely common, low-information connectors (e.g. "the", "and", "is") using NLTK libraries.' },
    { title: 'Porter Stemmer Normalization', desc: 'Reduces terms to their primary linguistic stems (e.g. "announcements", "announcing" both reduce to "announc").' }
  ];

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in text-left select-none relative z-20">
      
      {/* 1. Header Area */}
      <div className="flex items-center gap-3.5 border-b border-white/5 pb-6">
        <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
          <BookOpen size={20} className="animate-pulse-slow" />
        </div>
        <div>
          <h2 className="font-display font-black text-2xl text-white">Scientific Methodology</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Explore the algorithms, mathematical formulations, and engineering principles behind SentinelAI.
          </p>
        </div>
      </div>

      {/* 2. Pipeline breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        
        {/* Left Side: NLP cleaning */}
        <div className="rounded-3xl glass-panel p-6 md:p-8 border-white/6 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute inset-0 ai-grid-background opacity-[0.03]" />
          
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Terminal size={16} className="text-cyan-400" />
            <span className="text-xs font-bold text-white">Natural Language Processing (NLP) Filters</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Raw news text is highly unstructured and noisy. To prepare the classification vectors, the model feeds the raw string through four serial filters.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            {steps.map((s, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{s.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold leading-normal mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Math Formulas */}
        <div className="rounded-3xl glass-panel p-6 md:p-8 border-white/6 flex flex-col gap-6 relative overflow-hidden justify-between">
          <div className="absolute inset-0 ai-grid-background opacity-[0.03]" />
          
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Binary size={16} className="text-purple-400" />
            <span className="text-xs font-bold text-white">Mathematical Modeling Formulations</span>
          </div>

          <div className="flex flex-col gap-6 flex-grow justify-center">
            
            {/* TF-IDF Formula */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/4 text-center">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                1. TF-IDF Token Weighting
              </span>
              <div className="font-mono text-sm font-bold text-cyan-400 py-1 bg-slate-950/60 rounded-lg inline-block px-4 border border-white/5 shadow-inner">
                W(t, d, D) = TF(t, d) × log( N / DF(t) )
              </div>
              <p className="text-[9px] text-slate-500 font-bold mt-2 leading-relaxed">
                Measures token significance in a single document against corpus-wide inverse frequencies.
              </p>
            </div>

            {/* Sigmoid formula */}
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/4 text-center">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                2. Logistic Regression Sigmoid Probability
              </span>
              <div className="font-mono text-sm font-bold text-purple-400 py-1 bg-slate-950/60 rounded-lg inline-block px-4 border border-white/5 shadow-inner">
                P(y = 1 | x) = 1 / ( 1 + e^(-z) )
              </div>
              <p className="text-[9px] text-slate-500 font-bold mt-2 leading-relaxed">
                Applies the Euler-sigmoid transform over linear dot products to scale probabilities [0, 1].
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 3. LIME explaining methodology */}
      <div className="rounded-3xl glass-panel p-6 md:p-8 border-white/6 flex flex-col gap-6 relative overflow-hidden mt-2">
        <div className="absolute inset-0 ai-grid-background opacity-[0.03]" />

        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <Layers size={16} className="text-emerald-400" />
          <span className="text-xs font-bold text-white">Explainable AI (XAI) via LIME Formulations</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-center py-2">
          
          <div className="xl:col-span-3 flex flex-col gap-4">
            <h4 className="font-display font-extrabold text-sm text-slate-100">
              Local Interpretable Model-Agnostic Explanations
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Black-box complex model classifiers are difficult for human auditors to verify. To generate explainability, LIME perturbs the input text document locally by deleting random subsets of words and measuring how prediction probabilities shift.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              LIME then fits a simple, interpretable linear surrogate model (such as a sparse ridge regression) over the perturbed neighborhood data points. The coefficients/weights extracted from this local surrogate model represent exactly how much individual words contributed to the final real vs fake news decision.
            </p>
          </div>

          <div className="xl:col-span-2 flex flex-col gap-4 justify-center">
            {/* LIME Equation card */}
            <div className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 text-center">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2.5">
                LIME Objective Optimization
              </span>
              <div className="font-mono text-sm font-bold text-emerald-400 py-2.5 bg-slate-950/60 rounded-lg inline-block px-5 border border-white/5 shadow-inner">
                &xi;(x) = argmin &thinsp; L(f, g, &pi;<sub>x</sub>) + &Omega;(g)
              </div>
              
              <div className="flex flex-col gap-1.5 text-[8px] text-slate-500 font-bold text-left mt-3.5 border-t border-white/5 pt-3">
                <div className="flex justify-between">
                  <span>g &isin; G:</span>
                  <span className="text-slate-400">Sparse linear surrogate explainer model</span>
                </div>
                <div className="flex justify-between">
                  <span>L(f, g, &pi;<sub>x</sub>):</span>
                  <span className="text-slate-400">Prediction mismatch error weighted by distance &pi;<sub>x</sub></span>
                </div>
                <div className="flex justify-between">
                  <span>&Omega;(g):</span>
                  <span className="text-slate-400">Surrogate model complexity constraint (sparsity limit)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
      
    </div>
  );
}
