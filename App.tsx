import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_PADS, PAD_NAMES, KEY_MAPPINGS } from './constants';
import { PadConfig, PadState, HitStats, VelocityCurve } from './types';
import OLEDDisplay from './components/OLEDDisplay';
import Knob from './components/Knob';
import CodeReview from './components/CodeReview';
import { initAudio, playDrumSound } from './utils/audioSynth';
import { Settings, Volume2, Zap, Activity } from 'lucide-react';

export default function App() {
  const [pads, setPads] = useState<PadConfig[]>(DEFAULT_PADS);
  const [activePadId, setActivePadId] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Simulated Hardware State
  const [padStates, setPadStates] = useState<PadState[]>(new Array(12).fill(PadState.PAD_IDLE));
  const [stats, setStats] = useState<HitStats>({
    totalHits: 0,
    ghostNotes: 0,
    lastHitTime: 0,
    lastVelocity: 0,
    latency: 0
  });

  // Enable Audio Context on first interaction
  const handleInteraction = () => {
    if (!audioEnabled) {
      initAudio();
      setAudioEnabled(true);
    }
  };

  const triggerPad = useCallback((id: number, velocity: number = 100) => {
    const pad = pads[id];
    if (!pad.enabled) return;

    setActivePadId(id);
    playDrumSound(pad.name, velocity);
    
    // Update Stats
    setStats(prev => ({
      totalHits: prev.totalHits + 1,
      ghostNotes: velocity < 25 ? prev.ghostNotes + 1 : prev.ghostNotes,
      lastHitTime: Date.now(),
      lastVelocity: velocity,
      latency: Math.random() * 2 // Simulated 0-2ms latency
    }));

    // Simulate State Machine Visuals (Rising -> Idle)
    setPadStates(prev => {
      const next = [...prev];
      next[id] = PadState.PAD_PEAK;
      return next;
    });

    // Reset visual state after a short delay
    setTimeout(() => {
      setPadStates(prev => {
        const next = [...prev];
        next[id] = PadState.PAD_IDLE;
        return next;
      });
    }, 100);

  }, [pads]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const padIndex = KEY_MAPPINGS.indexOf(key);
      if (padIndex !== -1) {
        triggerPad(padIndex, Math.floor(Math.random() * 27) + 100); // Random velocity 100-127
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerPad]);

  const handleSettingChange = (key: keyof PadConfig, val: any) => {
    setPads(prev => {
      const newPads = [...prev];
      newPads[activePadId] = { ...newPads[activePadId], [key]: val };
      return newPads;
    });
  };

  const currentPad = pads[activePadId];

  return (
    <div 
      className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 selection:bg-emerald-500/30"
      onClick={handleInteraction}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500">
              DRUM PAD <span className="text-slate-500 font-mono text-xl">v2.0</span>
            </h1>
            <p className="text-slate-400 font-mono text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              SYSTEM READY // HAIRLESS MIDI MODE
            </p>
          </div>
          {!audioEnabled && (
            <div className="mt-4 md:mt-0 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded border border-yellow-500/30 text-sm font-bold animate-bounce cursor-pointer">
              CLICK ANYWHERE TO START AUDIO ENGINE
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls & Display */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* OLED Simulator */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-2xl flex justify-center">
               <OLEDDisplay 
                 currentPad={currentPad}
                 padState={padStates[activePadId]}
                 lastVelocity={stats.lastVelocity}
                 totalHits={stats.totalHits}
                 stateName={["IDLE", "RISE", "PEAK", "FALL", "MASK"][padStates[activePadId]]}
               />
            </div>

            {/* Physical Controls Simulation */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-xs font-bold tracking-widest">
                <Settings size={14} /> Hardware Controls
              </div>
              <div className="flex justify-between px-2">
                <Knob 
                  label="SENS" 
                  value={currentPad.sensitivity} 
                  min={0} max={100} 
                  onChange={(v) => handleSettingChange('sensitivity', v)} 
                />
                <Knob 
                  label="THRESH" 
                  value={currentPad.threshold} 
                  min={0} max={100} 
                  onChange={(v) => handleSettingChange('threshold', v)} 
                />
                <Knob 
                  label="GAIN" 
                  value={currentPad.gain} 
                  min={250} max={500} 
                  onChange={(v) => handleSettingChange('gain', v)} 
                />
              </div>
              
              <div className="mt-6 flex justify-between items-center border-t border-slate-700 pt-4">
                <span className="text-xs font-mono text-slate-400">VELOCITY CURVE</span>
                <button 
                  onClick={() => handleSettingChange('curve', currentPad.curve === VelocityCurve.CURVE_LINEAR ? VelocityCurve.CURVE_PROFESSIONAL : VelocityCurve.CURVE_LINEAR)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    currentPad.curve === VelocityCurve.CURVE_PROFESSIONAL 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {currentPad.curve === VelocityCurve.CURVE_PROFESSIONAL ? 'PRO' : 'LINEAR'}
                </button>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-xs space-y-2">
               <div className="flex justify-between">
                 <span className="text-slate-500">TOTAL HITS</span>
                 <span className="text-sky-400">{stats.totalHits}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-500">GHOST NOTES</span>
                 <span className="text-purple-400">{stats.ghostNotes}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-500">AVG LATENCY</span>
                 <span className="text-emerald-400">{stats.latency.toFixed(2)}ms</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-500">BAUD RATE</span>
                 <span className="text-orange-400">115200</span>
               </div>
            </div>

          </div>

          {/* Right Column: The Pads */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-4 gap-4 h-full">
              {pads.map((pad) => (
                <button
                  key={pad.id}
                  onMouseDown={() => triggerPad(pad.id)}
                  className={`
                    relative rounded-lg border-2 p-4 flex flex-col justify-between h-32 transition-all duration-75 group
                    ${padStates[pad.id] === PadState.PAD_PEAK 
                      ? 'bg-sky-500 border-sky-300 shadow-[0_0_30px_rgba(14,165,233,0.5)] translate-y-1' 
                      : activePadId === pad.id
                        ? 'bg-slate-800 border-slate-500'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                    }
                  `}
                >
                  <div className="flex justify-between w-full">
                    <span className={`text-xs font-bold font-mono ${padStates[pad.id] === PadState.PAD_PEAK ? 'text-white' : 'text-slate-500'}`}>
                      {pad.midiNote}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${padStates[pad.id] === PadState.PAD_PEAK ? 'bg-white' : 'bg-slate-600'}`} />
                  </div>
                  
                  <div className="text-center">
                    <span className={`text-lg font-black tracking-wider ${padStates[pad.id] === PadState.PAD_PEAK ? 'text-white' : 'text-slate-300'}`}>
                      {pad.name}
                    </span>
                  </div>

                  <div className="w-full text-center">
                     <span className="text-[10px] text-slate-600 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50 group-hover:border-slate-600">
                       KEY: {pad.keyTrigger}
                     </span>
                  </div>
                </button>
              ))}
            </div>

            <CodeReview />

          </div>
        </div>
      </div>
    </div>
  );
}