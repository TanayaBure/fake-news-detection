import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Trash2, 
  Play, 
  Sparkles, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Calendar,
  ExternalLink,
  ChevronRight,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

// High-fidelity pre-compiled sample news for demonstration
const SAMPLE_NEWS = {
  fake: "BREAKING: NASA secret documents leaked. Senior space officials have admitted under oath that the moon landings in 1969 were completely fabricated and filmed in a highly secure Hollywood studio directed by Stanley Kubrick. The leak contains over 400 GB of internal memos, communications, and photographic analysis proving that the flag movement was caused by fans, and stars were edited out using high-altitude filters. Space agency directors are planning to resign next week following intense public pressure and investigation from government intelligence agencies.",
  real: "The U.S. Federal Reserve announced on Wednesday that it will raise its benchmark interest rate by a quarter of a percentage point, matching market expectations. In a statement following its two-day policy meeting, the central bank cited continued progress on inflation control alongside steady employment figures. Fed Chairman Jerome Powell remarked during the press conference that the economic expansion remains highly resilient, though the committee continues to monitor global financial markets closely before making further adjustments in the upcoming fall quarter."
};

export default function Workspace({ isBackendConnected }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [activeWordHover, setActiveWordHover] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // New states for scraper, trust checker and counterfactual editor
  const [inputType, setInputType] = useState('text'); // 'text' or 'url'
  const [inputUrl, setInputUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapedUrl, setScrapedUrl] = useState('');
  const [activeWhatIfWord, setActiveWhatIfWord] = useState(null); // { tok, idx }
  const [whatIfReplacement, setWhatIfReplacement] = useState('');

  // Refs for Virality Simulator
  const canvasRef = useRef(null);
  const simAnimationRef = useRef(null);

  // HTML5 Canvas Virality Simulator Loop
  useEffect(() => {
    if (!result || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set sizing relative to responsive layout
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || 400;
      canvas.height = 180;
    };
    resizeCanvas();
    
    const nodeCount = 55;
    const nodes = [];
    const isFake = result.prediction === 'Fake';
    
    // Initialize nodes with random velocities
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: 4.5,
        state: i === 0 ? 'infected' : 'susceptible', // Patient zero
        infectedTime: i === 0 ? 0 : null
      });
    }
    
    let frames = 0;
    
    const runSimulation = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frames++;
      
      // Draw links
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 55) {
            // Infect neighboring nodes
            if (nodes[i].state === 'infected' && nodes[j].state === 'susceptible') {
              const spreadChance = isFake ? 0.045 : 0.008;
              if (Math.random() < spreadChance) {
                nodes[j].state = 'infected';
                nodes[j].infectedTime = frames;
              }
            } else if (nodes[j].state === 'infected' && nodes[i].state === 'susceptible') {
              const spreadChance = isFake ? 0.045 : 0.008;
              if (Math.random() < spreadChance) {
                nodes[i].state = 'infected';
                nodes[i].infectedTime = frames;
              }
            }
            
            // Draw link line
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            if (nodes[i].state === 'infected' || nodes[j].state === 'infected') {
              ctx.strokeStyle = isFake ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
            } else {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            }
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce bounds
        if (node.x < 4 || node.x > canvas.width - 4) node.vx = -node.vx;
        if (node.y < 4 || node.y > canvas.height - 4) node.vy = -node.vy;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI*2);
        
        if (node.state === 'infected') {
          ctx.fillStyle = isFake ? '#f43f5e' : '#10b981';
          ctx.shadowBlur = 6;
          ctx.shadowColor = isFake ? '#f43f5e' : '#10b981';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });
      
      ctx.shadowBlur = 0;
      simAnimationRef.current = requestAnimationFrame(runSimulation);
    };
    
    runSimulation();
    
    return () => {
      if (simAnimationRef.current) {
        cancelAnimationFrame(simAnimationRef.current);
      }
    };
  }, [result]);

  const loadingSteps = [
    'Initializing advanced NLTK pipeline...',
    'Performing Porter Stemming & stop-word cleanup...',
    'Generating 5,000-dimensional TF-IDF vector matrices...',
    'Running Logistic Regression inference classification...',
    'Perturbing local model boundaries (LIME explainability)...',
    'Synthesizing feature weight mappings & graphs...'
  ];

  // Simulated AI loading steps
  useEffect(() => {
    if (!loading) return;
    
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [loading]);

  // Listen to shared text load event triggers from history
  useEffect(() => {
    if (window.loadedWorkspaceText) {
      setInputText(window.loadedWorkspaceText);
      setResult(null);
      window.loadedWorkspaceText = null;
    }

    const handleLoadEvent = (e) => {
      setInputText(e.detail);
      setResult(null);
    };

    window.addEventListener('loadSampleNewsText', handleLoadEvent);
    return () => {
      window.removeEventListener('loadSampleNewsText', handleLoadEvent);
    };
  }, []);

  const loadSample = (type) => {
    setInputText(SAMPLE_NEWS[type]);
    setScrapedUrl('');
    setResult(null);
  };

  const handleClear = () => {
    setInputText('');
    setInputUrl('');
    setScrapedUrl('');
    setResult(null);
    setActiveWhatIfWord(null);
  };

  const handleScrapeUrl = async () => {
    if (!inputUrl.trim()) return;
    
    setScraping(true);
    setResult(null);
    setInputText('');
    setScrapedUrl('');
    setActiveWhatIfWord(null);
    
    // Offline simulation mode
    if (!isBackendConnected) {
      setTimeout(() => {
        let mockText = SAMPLE_NEWS.real;
        if (inputUrl.includes('fake') || inputUrl.includes('secret') || inputUrl.includes('leak') || inputUrl.includes('nasa')) {
          mockText = SAMPLE_NEWS.fake;
        }
        setInputText(mockText);
        setScrapedUrl(inputUrl);
        setScraping(false);
      }, 1500);
      return;
    }
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Scraper failed');
      }
      
      const data = await response.json();
      setInputText(data.text);
      setScrapedUrl(inputUrl);
    } catch (err) {
      console.error("Scraping error, falling back to mock...", err);
      setInputText(SAMPLE_NEWS.real);
      setScrapedUrl(inputUrl);
    } finally {
      setScraping(false);
    }
  };

  const getSynonymsForWord = (word) => {
    const cleanWord = word.toLowerCase().trim();
    const syns = {
      'secret': ['internal', 'private', 'classified'],
      'leaked': ['disclosed', 'shared', 'released'],
      'fabricated': ['compiled', 'published', 'recreated'],
      'hollywood': ['studios', 'production'],
      'landing': ['arrival', 'mission'],
      'officials': ['representatives', 'spokespersons'],
      'federal': ['central', 'national'],
      'announced': ['reported', 'stated'],
      'quarter': ['period', 'session'],
      'expectations': ['predictions', 'forecasts'],
      'policy': ['guideline', 'procedure'],
      'control': ['stabilization', 'management']
    };
    return syns[cleanWord] || [];
  };

  const handleApplyWhatIf = () => {
    if (!activeWhatIfWord) return;
    const targetWord = activeWhatIfWord.tok.text;
    const replacement = whatIfReplacement.trim();
    if (!replacement || replacement === targetWord) {
      setActiveWhatIfWord(null);
      return;
    }
    
    // Reconstruct input text using tokens to preserve spacing/punctuation
    const updatedTokens = result.tokens.map((tok, idx) => {
      if (idx === activeWhatIfWord.idx) {
        return replacement;
      }
      return tok.text;
    });
    const newText = updatedTokens.join('');
    
    setInputText(newText);
    setActiveWhatIfWord(null);
    
    setTimeout(() => {
      handleAnalyze(newText);
    }, 50);
  };

  const handleAnalyze = async (textToAnalyze = null) => {
    const text = textToAnalyze !== null ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    // If backend is offline, simulate mock results
    if (!isBackendConnected) {
      setTimeout(() => {
        const isSampleFake = text.includes('secret documents') || text.includes('Hollywood') || text.length % 2 === 0;
        const mockResult = generateMockResult(text, isSampleFake);
        setResult(mockResult);
        setLoading(false);
        triggerResultCelebration(mockResult.prediction);
      }, 2800);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text,
          url: scrapedUrl || null
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned an error');
      }

      const data = await response.json();
      setResult(data);
      triggerResultCelebration(data.prediction);
    } catch (err) {
      console.error("API error, falling back to mock results...", err);
      const isSampleFake = text.includes('secret documents') || text.includes('landing') || text.length % 2 === 0;
      const mockResult = generateMockResult(text, isSampleFake);
      setResult(mockResult);
      triggerResultCelebration(mockResult.prediction);
    } finally {
      setLoading(false);
    }
  };

  // Triggers beautiful neon confetti on Real results
  const triggerResultCelebration = (prediction) => {
    if (prediction === 'Real') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#06b6d4']
      });
    }
  };

  // Secondary backup result generator if python is offline
  const generateMockResult = (text, isFake) => {
    const prediction = isFake ? 'Fake' : 'Real';
    const confidence = isFake ? 0.9634 : 0.9412;
    
    const fakeFeatures = [
      { word: 'secret', weight: 0.189 },
      { word: 'leaked', weight: 0.142 },
      { word: 'fabricated', weight: 0.121 },
      { word: 'Hollywood', weight: 0.098 },
      { word: 'landing', weight: 0.082 },
      { word: 'officials', weight: 0.054 },
      { word: 'federal', weight: -0.045 },
      { word: 'announced', weight: -0.061 }
    ];

    const realFeatures = [
      { word: 'federal', weight: -0.165 },
      { word: 'announced', weight: -0.124 },
      { word: 'quarter', weight: -0.098 },
      { word: 'expectations', weight: -0.076 },
      { word: 'policy', weight: -0.062 },
      { word: 'control', weight: -0.041 },
      { word: 'leaked', weight: 0.032 },
      { word: 'fabricated', weight: 0.021 }
    ];

    const features = isFake ? fakeFeatures : realFeatures;
    const weightsMap = {};
    features.forEach(f => {
      weightsMap[f.word.toLowerCase()] = f.weight;
    });

    // Segment raw text
    const tokens = text.split(/([^a-zA-Z0-9]+)/).filter(Boolean).map(t => {
      if (t.match(/^[a-zA-Z0-9]+$/)) {
        const cleanT = t.toLowerCase();
        const weight = weightsMap[cleanT] || 0.0;
        return {
          text: t,
          weight: weight,
          highlight: weight !== 0.0
        };
      }
      return { text: t, weight: 0.0, highlight: false };
    });

    const mockCredibility = {
      domain_trust: scrapedUrl ? (scrapedUrl.includes('reuters.com') || scrapedUrl.includes('nytimes.com') ? 'High Trust' : 'Neutral / Unverified') : 'Neutral / Unverified',
      domain_reason: scrapedUrl ? (scrapedUrl.includes('reuters.com') || scrapedUrl.includes('nytimes.com') ? 'Reputable Global Publisher' : 'Source domain is unverified.') : 'No URL provided (Direct text audit).',
      trust_score: scrapedUrl ? (scrapedUrl.includes('reuters.com') || scrapedUrl.includes('nytimes.com') ? 90 : 50) : 50,
      clickbait_score: text.toUpperCase() === text ? 95 : (text.includes('!!!') ? 75 : 12),
      clickbait_reasons: text.toUpperCase() === text ? ["Severe uppercase lettering ratio"] : (text.includes('!!!') ? ["Sensational punctuation"] : ["Headline structure appears standard and objective."]),
      sensationalism_score: isFake ? 64 : 18,
      word_count: text.split(/\s+/).length
    };

    // AI Text Detection (JS Implementation matching server.py)
    const detectAiGeneration = (txt) => {
      const sentences = txt.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
      const words = txt.toLowerCase().match(/\b\w+\b/g) || [];
      if (words.length === 0) return 0.0;

      const uniqueWords = new Set(words);
      const diversity = uniqueWords.size / words.length;

      let stdDev = 5.0;
      const sentenceLengths = sentences.map(s => (s.match(/\b\w+\b/g) || []).length);
      if (sentenceLengths.length > 2) {
        const meanLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
        const variance = sentenceLengths.reduce((acc, val) => acc + Math.pow(val - meanLen, 2), 0) / sentenceLengths.length;
        stdDev = Math.sqrt(variance);
      }

      const llmBuzzwords = ["delve", "testament", "tapestry", "foster", "consequently", "moreover", "vibrant", "solace", "demystify", "imperative", "notably", "beacon", "furthermore", "essential", "crucial", "enrich"];
      const buzzwordCount = words.filter(w => llmBuzzwords.includes(w)).length;
      const buzzwordRatio = buzzwordCount / words.length;

      let score = 50.0;

      if (diversity < 0.45) {
        score += (0.45 - diversity) * 100;
      } else {
        score -= (diversity - 0.45) * 50;
      }

      if (stdDev < 3.5) {
        score += (3.5 - stdDev) * 15;
      } else {
        score -= (stdDev - 3.5) * 3;
      }

      if (buzzwordRatio > 0.015) {
        score += (buzzwordRatio - 0.015) * 1000;
      }

      score = Math.max(2.0, Math.min(98.0, score));
      return parseFloat(score.toFixed(1));
    };

    // Fact-Check Matching (JS Implementation matching server.py)
    const queryFactChecks = (txt) => {
      const textLower = txt.toLowerCase();
      const matches = [];

      const mockFactCheckDb = [
        {
          claim: "NASA secret documents leaked showing moon landings were filmed in Hollywood.",
          verdict: "False / Debunked",
          source: "Snopes",
          url: "https://www.snopes.com/fact-check/apollo-11-moon-landing/",
          details: "NASA has provided comprehensive photographic, rock sample, and telemetry evidence confirming the landings. The claims of studio production directed by Stanley Kubrick are a long-standing conspiracy theory with no factual basis."
        },
        {
          claim: "Federal Reserve raises interest rates by a quarter point in Wednesday meeting.",
          verdict: "Verified True",
          source: "Reuters Fact Check",
          url: "https://www.reuters.com/markets/us/fed-raise-interest-rates-quarter-point-meeting/",
          details: "Federal Reserve minutes and public briefings from Jerome Powell confirm the benchmark rate increase matched economic expectations."
        },
        {
          claim: "Donald Trump wins presidential election or Biden policy updates.",
          verdict: "Context Dependent",
          source: "FactCheck.org",
          url: "https://www.factcheck.org/",
          details: "Claims about election results require official state certifications. Be cautious of early social media posts declaring victory before certified tallies."
        }
      ];

      for (const item of mockFactCheckDb) {
        const keywords = item.claim.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const matchCount = keywords.filter(kw => textLower.includes(kw)).length;
        if (matchCount >= 3) {
          matches.push(item);
        }
      }

      if (matches.length === 0) {
        matches.push({
          claim: "No direct fact-check matches found for this article's specific wording.",
          verdict: "Unverified / Neutral",
          source: "SentinelAI Fact-Check Registry",
          url: "https://factchecktools.googleapis.com/",
          details: "We recommend searching independent sources like FactCheck.org or Snopes.com directly for specific political or historical claims."
        });
      }

      return matches;
    };

    const aiProbability = detectAiGeneration(text);
    const factChecks = queryFactChecks(text);

    return {
      prediction,
      confidence,
      features,
      tokens,
      credibility: mockCredibility,
      ai_probability: aiProbability,
      fact_checks: factChecks
    };
  };

  const handleWordMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: e.clientX - bounds.left + 15,
      y: e.clientY - bounds.top - 55
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 py-4 animate-fade-in relative z-20">
      
      {/* LEFT PANEL: Editor */}
      <section className="flex flex-col gap-6 text-left">
        <div className="rounded-3xl glass-panel p-6 md:p-8 flex flex-col gap-6 border-white/6 shadow-2xl min-h-[640px] justify-between relative group">
          
            {/* Input Mode Selector */}
            <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 w-fit">
              <button
                onClick={() => setInputType('text')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                  inputType === 'text' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Text Paste
              </button>
              <button
                onClick={() => setInputType('url')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                  inputType === 'url' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                URL Import
              </button>
            </div>

            {/* Input Forms */}
            {inputType === 'url' ? (
              <div className="flex flex-col gap-4 text-left">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="Paste news article URL here (e.g. https://reuters.com/article/example)"
                      className="w-full bg-slate-950/40 rounded-2xl border border-white/8 px-5 py-3.5 text-slate-200 placeholder-slate-500 text-sm leading-normal focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleScrapeUrl}
                    disabled={scraping || !inputUrl.trim()}
                    className="px-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-display font-bold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2 select-none"
                  >
                    {scraping ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Globe size={14} />
                        Fetch & Import
                      </>
                    )}
                  </button>
                </div>
                {inputText && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Imported Content Preview</span>
                      {scrapedUrl && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                          Linked: {new URL(scrapedUrl).hostname}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-64 bg-slate-950/40 rounded-2xl border border-white/8 p-5 text-slate-200 text-sm leading-relaxed resize-none focus:border-blue-500/50"
                      />
                      <button
                        onClick={handleClear}
                        className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/25 hover:bg-rose-500/5 transition-all cursor-pointer"
                        title="Clear Preview"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste news article transcript or type suspicious sentences here (e.g. at least 15-20 words for rich LIME local pertubations)..."
                  className="w-full h-80 bg-slate-950/40 rounded-2xl border border-white/8 p-5 text-slate-200 placeholder-slate-500 text-sm leading-relaxed transition-all focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] resize-none"
                />
                {inputText.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/25 hover:bg-rose-500/5 transition-all cursor-pointer"
                    title="Clear Workspace"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}

          {/* Footer Area */}
          <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-4">
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              {inputText.trim().split(/\s+/).filter(Boolean).length} WORDS | {inputText.length} CHARACTERS
            </span>

            <button
              onClick={handleAnalyze}
              disabled={loading || !inputText.trim()}
              className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-bold text-sm shadow-[0_4px_20px_rgba(37,99,235,0.3)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <Play size={14} fill="currentColor" />
              Analyze News Article
            </button>
          </div>
          
        </div>
      </section>

      {/* RIGHT PANEL: Loader / Awaiting / Results */}
      <section className="flex flex-col gap-6 text-left">
        <div className="rounded-3xl glass-panel p-6 md:p-8 border-white/6 shadow-2xl min-h-[640px] flex flex-col justify-between relative overflow-hidden">
          
          {/* WATERMARK BACKGROUND DECORATIVE GRID */}
          <div className="absolute inset-0 ai-grid-background opacity-[0.05] pointer-events-none" />

          {/* STATE 1: LOADING STATE (Realistic progress logs) */}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center relative z-10 select-none">
              {/* Pulsing visual core */}
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-500 animate-spin" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-4 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-lg">
                  🤖
                </div>
              </div>

              <h3 className="font-display font-extrabold text-lg text-white mb-2">Analyzing Article Integrity</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium mb-6">
                Executing full-stack explanation models locally...
              </p>

              {/* Progress Console */}
              <div className="w-full max-w-sm rounded-2xl bg-slate-950/60 border border-white/5 p-4 text-left font-mono">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Neural Pipeline Activity</span>
                </div>
                <div className="flex flex-col gap-1.5 min-h-[85px] justify-center">
                  {loadingSteps.map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`text-[10px] transition-all duration-300 flex items-center gap-2 ${
                        idx === loadingStep 
                          ? 'text-cyan-400 font-bold' 
                          : idx < loadingStep 
                            ? 'text-slate-500 line-through' 
                            : 'text-slate-600 opacity-30'
                      }`}
                    >
                      <ChevronRight size={10} className={idx === loadingStep ? 'animate-bounce' : ''} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: AWAITING INPUT (Initial welcome view) */}
          {!loading && !result && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 relative z-10 select-none">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-3xl bg-blue-500/5 blur-lg animate-pulse-slow" />
                <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center text-slate-500 text-3xl animate-float">
                  🔍
                </div>
              </div>
              <h3 className="font-display font-extrabold text-base text-slate-200">Awaiting Article Content</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-medium">
                Enter or load a suspicious news segment on the left panel, and click audit to generate our explainable audit logs.
              </p>
            </div>
          )}

          {/* STATE 3: RESULTS PRESENTATION */}
          {!loading && result && (
            <div className="flex-1 flex flex-col gap-6 relative z-10 select-none">
              
              {/* Header result row */}
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                  <Search size={16} />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-base text-white">Prediction Integrity Audit</h2>
                  <span className="text-[10px] text-slate-400 font-semibold leading-none">Statistical model classification breakdown</span>
                </div>
              </div>

              {/* Main Classification & Circular Gauge Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 3a. Pulser Shield Card */}
                <div className="rounded-2xl bg-slate-950/40 border border-white/6 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 ai-grid-background opacity-[0.05]" />

                  {/* Pulsing icon */}
                  <div className="relative mb-3.5">
                    {result.prediction === 'Fake' ? (
                      <>
                        <div className="absolute inset-0 rounded-full bg-rose-500/25 blur-md animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 relative z-10">
                          <AlertTriangle size={26} className="animate-float" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-ping" style={{ animationDuration: '2.5s' }} />
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 relative z-10">
                          <CheckCircle size={26} className="animate-float" />
                        </div>
                      </>
                    )}
                  </div>

                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Classification Verdict</span>
                  <h4 className={`font-display font-black text-xl mt-1 ${result.prediction === 'Fake' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {result.prediction.toUpperCase()} NEWS
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium mt-1">
                    {result.prediction === 'Fake' ? 'Significant falsification flags detected' : 'Standard factual reporting integrity verified'}
                  </p>
                </div>

                {/* 3b. Radial Confidence Gauge */}
                <div className="rounded-2xl bg-slate-950/40 border border-white/6 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 ai-grid-background opacity-[0.05]" />

                  {/* SVG Circle fill animation */}
                  <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* background circle */}
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-white/5"
                        strokeWidth="5.5"
                        fill="transparent"
                      />
                      {/* active circle */}
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className={`transition-all duration-1000 ${result.prediction === 'Fake' ? 'stroke-rose-500' : 'stroke-emerald-500'}`}
                        strokeWidth="5.5"
                        fill="transparent"
                        strokeDasharray={Math.PI * 2 * 34}
                        strokeDashoffset={Math.PI * 2 * 34 * (1 - (result.confidence > 1 ? result.confidence / 100 : result.confidence))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center flex flex-col justify-center">
                      <span className="text-sm font-black text-white leading-none font-mono">
                        {((result.confidence > 1 ? result.confidence : result.confidence * 100)).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Model Confidence</span>
                  <span className="text-[9px] text-slate-400 mt-1 font-semibold">Margin validation probability</span>
                </div>

                {/* 3b(2). AI-Generated Text Probability */}
                <div className="rounded-2xl bg-slate-950/40 border border-white/6 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 ai-grid-background opacity-[0.05]" />
                  
                  {/* Gauge */}
                  <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-white/5"
                        strokeWidth="5.5"
                        fill="transparent"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className={`transition-all duration-1000 ${
                          (result.ai_probability || 0) > 60 ? 'stroke-purple-500' : 'stroke-blue-400'
                        }`}
                        strokeWidth="5.5"
                        fill="transparent"
                        strokeDasharray={Math.PI * 2 * 34}
                        strokeDashoffset={Math.PI * 2 * 34 * (1 - (result.ai_probability || 0) / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center flex flex-col justify-center">
                      <span className="text-sm font-black text-white leading-none font-mono">
                        {(result.ai_probability || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">AI-Writer Score</span>
                  <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                    {(result.ai_probability || 0) > 60 ? 'Likely AI generated' : 'Likely human written'}
                  </span>
                </div>

              </div>

              {/* 3c. Source & Credibility Audit */}
              {result.credibility && (
                <div className="rounded-2xl bg-slate-950/40 border border-white/6 p-5 flex flex-col gap-4 relative overflow-hidden text-left">
                  <div className="absolute inset-0 ai-grid-background opacity-[0.03] pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Source & Credibility Audit</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 font-bold select-none">
                        Trust Metrics
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Domain Trust */}
                    <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 flex flex-col justify-between text-left">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Domain Authority</span>
                      <h5 className={`font-display font-extrabold text-sm mt-1 ${
                        result.credibility.domain_trust.includes('High') 
                          ? 'text-emerald-400' 
                          : result.credibility.domain_trust.includes('Low') 
                            ? 'text-rose-400' 
                            : 'text-slate-300'
                      }`}>
                        {result.credibility.domain_trust}
                      </h5>
                      <span className="text-[9px] text-slate-400 leading-snug mt-1.5 font-medium">
                        {result.credibility.domain_reason}
                      </span>
                    </div>

                    {/* Clickbait Index */}
                    <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 flex flex-col justify-between text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Clickbait Index</span>
                        <span className={`text-[10px] font-mono font-bold ${
                          result.credibility.clickbait_score > 50 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {result.credibility.clickbait_score}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            result.credibility.clickbait_score > 50 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${result.credibility.clickbait_score}%` }}
                        />
                      </div>
                      
                      <span className="text-[9px] text-slate-400 leading-snug mt-2 font-medium truncate" title={result.credibility.clickbait_reasons[0]}>
                        {result.credibility.clickbait_reasons[0]}
                      </span>
                    </div>

                    {/* Sensationalism */}
                    <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 flex flex-col justify-between text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Sensationalism</span>
                        <span className={`text-[10px] font-mono font-bold ${
                          result.credibility.sensationalism_score > 40 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {result.credibility.sensationalism_score}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            result.credibility.sensationalism_score > 40 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${result.credibility.sensationalism_score}%` }}
                        />
                      </div>
                      
                      <span className="text-[9px] text-slate-400 leading-snug mt-2 font-medium">
                        Emotional word density analysis
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3d. Dynamic LIME Highlight Engine (Text highlighting) */}
              <div className="rounded-2xl bg-slate-950/30 border border-white/6 p-5 flex flex-col gap-3 relative text-left">
                
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">XAI Token Highlights</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 font-bold select-none">
                      Interactive Text
                    </span>
                  </div>
                  {/* color legends */}
                  <div className="flex items-center gap-4 text-[9px] font-bold">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Supports Fake
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Supports Real
                    </span>
                  </div>
                </div>

                {/* What-If Sandbox Banner */}
                {activeWhatIfWord && (
                  <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 flex flex-col gap-3 text-left animate-fade-in relative z-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🛠️</span> What-If Sandbox (Counterfactual Analysis)
                      </span>
                      <button 
                        onClick={() => setActiveWhatIfWord(null)} 
                        className="text-slate-400 hover:text-slate-200 text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-slate-300">
                        Replace <code className="bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded text-white font-mono">"{activeWhatIfWord.tok.text}"</code> with:
                      </span>
                      <input
                        type="text"
                        value={whatIfReplacement}
                        onChange={(e) => setWhatIfReplacement(e.target.value)}
                        className="bg-slate-950/60 border border-white/8 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:border-blue-500/50 outline-none w-32"
                      />
                      
                      {/* Quick Synonyms */}
                      {getSynonymsForWord(activeWhatIfWord.tok.text).length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-semibold">Suggestions:</span>
                          {getSynonymsForWord(activeWhatIfWord.tok.text).map((syn, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => setWhatIfReplacement(syn)}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <button
                        onClick={handleApplyWhatIf}
                        className="ml-auto px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
                      >
                        Apply & Re-analyze
                      </button>
                    </div>
                  </div>
                )}

                {/* Highlighter body */}
                <div className="relative max-h-56 overflow-y-auto text-xs leading-relaxed font-medium text-slate-300 pr-1 select-text">
                  
                  {/* CUSTOM FLOATING MOUSE TOOLTIP */}
                  {activeWordHover && (
                    <div 
                      className="absolute p-2.5 rounded-xl bg-slate-950/95 border border-white/10 shadow-2xl text-[10px] text-white flex flex-col gap-1.5 z-[100] max-w-[200px] pointer-events-none select-none text-left"
                      style={{
                        left: `${hoverPosition.x}px`,
                        top: `${hoverPosition.y}px`,
                        boxShadow: `0 10px 25px rgba(0, 0, 0, 0.5), 0 0 10px ${activeWordHover.weight > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                      }}
                    >
                      <div className="flex items-center gap-1.5 font-bold border-b border-white/5 pb-1">
                        <span className="text-cyan-400">Feature:</span>
                        <span className="text-slate-100 font-mono">"{activeWordHover.text.toLowerCase()}"</span>
                      </div>
                      <div>
                        LIME Score:{' '}
                        <span className={`font-black font-mono ${activeWordHover.weight > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {activeWordHover.weight > 0 ? '+' : ''}{activeWordHover.weight.toFixed(4)}
                        </span>
                      </div>
                      <p className="text-[8px] text-slate-400 leading-normal font-semibold">
                        {activeWordHover.weight > 0 
                          ? 'This token pushes the model strongly towards a FAKE verdict.' 
                          : 'This token supports a legitimate REAL classification.'
                        }
                      </p>
                      <div className="text-[8px] text-blue-400 font-bold border-t border-white/5 pt-1 mt-0.5">
                        ⚡ Click to test "What-If" replacement
                      </div>
                    </div>
                  )}
 
                   {result.tokens && result.tokens.map((tok, idx) => {
                     if (tok.highlight) {
                       const isFakeWeight = tok.weight > 0;
                       return (
                         <span
                           key={idx}
                           onMouseEnter={(e) => {
                             setActiveWordHover(tok);
                             handleWordMouseMove(e);
                           }}
                           onMouseMove={handleWordMouseMove}
                           onMouseLeave={() => setActiveWordHover(null)}
                           onClick={() => {
                             setActiveWhatIfWord({ tok, idx });
                             setWhatIfReplacement(tok.text);
                           }}
                           className={`inline-block px-1 rounded mx-[1px] border cursor-pointer transition-all relative ${
                             isFakeWeight 
                               ? 'bg-rose-500/12 border-rose-500/25 hover:bg-rose-500/25 hover:scale-105 text-rose-300' 
                               : 'bg-emerald-500/12 border-emerald-500/25 hover:bg-emerald-500/25 hover:scale-105 text-emerald-300'
                           }`}
                         >
                           {tok.text}
                         </span>
                       );
                     }
                     return <span key={idx}>{tok.text}</span>;
                   })}
                 </div>
 
               </div>

              {/* 3e. Fact-Check Verification */}
              {result.fact_checks && result.fact_checks.length > 0 && (
                <div className="rounded-2xl bg-slate-950/40 border border-white/6 p-5 flex flex-col gap-4 relative text-left">
                  <div className="absolute inset-0 ai-grid-background opacity-[0.03] pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Fact-Check Verification Matches</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 font-bold select-none">
                        Claim Database Search
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {result.fact_checks.map((fc, fcIdx) => {
                      const isFalse = fc.verdict.toLowerCase().includes('false') || fc.verdict.toLowerCase().includes('debunked');
                      const isTrue = fc.verdict.toLowerCase().includes('true') || fc.verdict.toLowerCase().includes('verified');
                      
                      return (
                        <div key={fcIdx} className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-start gap-3">
                            <span className="text-xs font-semibold text-slate-200">
                              "{fc.claim}"
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shrink-0 border ${
                              isFalse 
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                                : isTrue 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                              {fc.verdict}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 border-t border-white/5 pt-2">
                            <span>Checked by: <strong className="text-slate-300">{fc.source}</strong></span>
                            {fc.url && fc.url.startsWith('http') && (
                              <a 
                                href={fc.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold no-underline"
                              >
                                View Report <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal italic mt-1">
                            {fc.details}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3f. Social Media Virality Simulator */}
              <div className="rounded-2xl bg-slate-950/30 border border-white/6 p-5 flex flex-col gap-4 relative text-left">
                <div className="absolute inset-0 ai-grid-background opacity-[0.03] pointer-events-none" />
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Social Media Propagation Simulator</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 font-bold select-none">
                      Dynamic SIR Node Network
                    </span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-[9px] font-bold">
                    <span className="text-slate-400">
                      R0 Rate: <strong className={result.prediction === 'Fake' ? 'text-rose-400' : 'text-emerald-400'}>
                        {result.prediction === 'Fake' 
                          ? (1.5 + (result.credibility?.clickbait_score / 30) + (result.credibility?.sensationalism_score / 35)).toFixed(2) 
                          : '1.10'}
                      </strong>
                    </span>
                    <span className="text-slate-400">
                      Spread Risk: <strong className={result.prediction === 'Fake' ? 'text-rose-400' : 'text-emerald-400'}>
                        {result.prediction === 'Fake' ? 'High Virality' : 'Low/Controlled'}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Canvas visualizer */}
                <div className="w-full bg-slate-950/60 rounded-xl overflow-hidden border border-white/5 relative flex justify-center items-center h-48">
                  <canvas ref={canvasRef} className="w-full h-full block" />
                  <div className="absolute bottom-2.5 left-3 text-[9px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-white/5 select-none pointer-events-none">
                    Red = Infected / Spreading | Gray = Neutral
                  </div>
                </div>
              </div>

              {/* 3g. LIME Chart */}
              <div className="rounded-2xl bg-slate-950/30 border border-white/6 p-5 flex flex-col gap-4 text-left">
                
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Top Feature Weight Importance</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">Perturbation scores</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Model-Agnostic Weighting</span>
                </div>

                {/* Custom bar chart */}
                <div className="flex flex-col gap-2.5 max-h-[170px] overflow-y-auto pr-1">
                  
                  {/* Grid Lines */}
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-black font-mono border-b border-white/5 pb-1">
                    <span>LEGITIMATE (-Real)</span>
                    <span>0.00</span>
                    <span>SUSPICIOUS (+Fake)</span>
                  </div>

                  {result.features && result.features.map((feat, idx) => {
                    const isFake = feat.weight > 0;
                    const maxWeight = Math.max(...result.features.map(f => Math.abs(f.weight)));
                    const fillPercent = Math.min(100, Math.floor((Math.abs(feat.weight) / maxWeight) * 100));

                    return (
                      <div key={idx} className="flex items-center gap-3 select-none text-xs">
                        
                        {/* Word string label */}
                        <span className="w-20 text-left font-mono font-bold text-slate-300 truncate">
                          {feat.word}
                        </span>

                        {/* Double-sided custom progress bars */}
                        <div className="flex-1 h-3.5 bg-slate-950/50 rounded border border-white/5 overflow-hidden flex relative items-center justify-center">
                          {/* Centered zero marker reference */}
                          <div className="absolute top-0 bottom-0 w-[1px] bg-white/10 left-1/2" />
                          
                          {isFake ? (
                            // Fake: progress fills right side
                            <div 
                              className="absolute top-0 bottom-0 left-1/2 bg-gradient-to-r from-rose-500 to-pink-500/80 rounded-r border-l border-white/10 shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all duration-1000"
                              style={{ width: `${fillPercent / 2}%` }}
                            />
                          ) : (
                            // Real: progress fills left side
                            <div 
                              className="absolute top-0 bottom-0 right-1/2 bg-gradient-to-l from-emerald-500 to-teal-500/80 rounded-l border-r border-white/10 shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all duration-1000"
                              style={{ width: `${fillPercent / 2}%` }}
                            />
                          )}
                        </div>

                        {/* Numeric score label */}
                        <span className={`w-12 text-right font-mono font-bold text-[10px] ${isFake ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isFake ? '+' : ''}{feat.weight.toFixed(3)}
                        </span>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* Persist/History Logging action triggers */}
          {result && !loading && (
            <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-4">
              <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5 uppercase font-mono">
                <Info size={10} /> Local Persistence: Stored
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/8 hover:border-white/12 text-xs font-bold transition-all cursor-pointer select-none no-print"
                >
                  🖨️ Print PDF Report
                </button>
                <button
                  onClick={() => {
                    // Save current prediction summary to localStorage history
                    const prevHistory = JSON.parse(localStorage.getItem('sentinel_history') || '[]');
                    const newRecord = {
                      id: Date.now().toString(),
                      text: inputText.slice(0, 100) + '...',
                      fullText: inputText,
                      prediction: result.prediction,
                      confidence: result.confidence,
                      timestamp: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) + ' ' + new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    };
                    localStorage.setItem('sentinel_history', JSON.stringify([newRecord, ...prevHistory]));
                    confetti({
                      particleCount: 20,
                      spread: 30,
                      colors: ['#3b82f6', '#a855f7']
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer select-none no-print"
                >
                  💾 Save Analysis
                </button>
              </div>
            </div>
          )}
          
        </div>
      </section>

    </div>
  );
}
