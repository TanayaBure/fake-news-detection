import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Workspace from './components/Workspace';
import History from './components/History';
import Analytics from './components/Analytics';
import About from './components/About';
import { AlertCircle, HelpCircle, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [inputText, setInputText] = useState('');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  // Heartbeat check to see if FastAPI backend is online
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/stats');
        if (res.ok) {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (err) {
        setIsBackendConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    };

    checkConnection();
    // Check connection every 10 seconds to auto-reconnect
    const timer = setInterval(checkConnection, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleLoadTextIntoWorkspace = (text) => {
    setInputText(text);
    // Locate and set text on the workspace component by feeding it to a shared storage or state
    // We can also store the load in window variable for quick access
    window.loadedWorkspaceText = text;
    // Dispatch a custom event so Workspace knows to load this text immediately
    const event = new CustomEvent('loadSampleNewsText', { detail: text });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen w-full flex p-4 gap-6 relative select-none overflow-x-hidden antialiased">
      
      {/* 1. Floating Canvas Neural Background & Moving grid */}
      <Background />

      {/* 2. Sleek Glass Sidebar Panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isBackendConnected={isBackendConnected} 
      />

      {/* 3. Main Dashboard Content Panels */}
      <main className="flex-1 flex flex-col gap-6 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl p-6 md:p-8 relative">
        
        {/* Offline Alert Notification Panel */}
        {!checkingConnection && !isBackendConnected && (
          <div className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-center justify-between text-left gap-4 animate-fade-in relative z-30 select-none shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
                <AlertCircle size={18} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">AI Core: Running in Simulated Mode</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                  The Python FastAPI server is currently offline. The dashboard remains fully operational using high-fidelity local corpus fallback simulation.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 font-mono text-[9px] shrink-0">
              <span className="text-slate-400">Boot real model:</span>
              <code className="bg-slate-950/60 border border-white/5 px-2 py-1 rounded text-cyan-400 font-bold">
                python server.py
              </code>
            </div>
          </div>
        )}

        {/* Tab pages rendering with smooth entry classes */}
        <div className="flex-1 relative z-20">
          {activeTab === 'home' && (
            <Hero 
              onStartAnalyze={() => setActiveTab('workspace')}
              onViewAnalytics={() => setActiveTab('analytics')}
            />
          )}

          {activeTab === 'workspace' && (
            <Workspace isBackendConnected={isBackendConnected} />
          )}

          {activeTab === 'history' && (
            <History 
              onLoadText={handleLoadTextIntoWorkspace}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics />
          )}

          {activeTab === 'about' && (
            <About />
          )}
        </div>

      </main>

    </div>
  );
}
