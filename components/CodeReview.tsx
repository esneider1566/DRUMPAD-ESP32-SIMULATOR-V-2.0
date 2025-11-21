import React from 'react';
import { CheckCircle, AlertTriangle, Zap, Terminal } from 'lucide-react';

const CodeReview: React.FC = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-8 text-sm">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="text-emerald-400" size={24} />
        <h2 className="text-xl font-bold text-emerald-400 font-mono">C++ CODE ANALYSIS: "God Tier" v2.0</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-2">✅ Strengths (Industrial Grade)</h3>
          
          <div className="flex gap-3">
            <Zap className="text-yellow-400 shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-300">Slope Detection</p>
              <p className="text-slate-400 mt-1">Using <code>calculateSlope</code> instead of a simple threshold trigger is excellent. It reduces false positives and captures dynamics much better, especially for piezo sensors.</p>
            </div>
          </div>

          <div className="flex gap-3">
             <CheckCircle className="text-green-400 shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-300">Hairless MIDI Optimization</p>
              <p className="text-slate-400 mt-1">Explicitly handling Baud Rate at <code>115200</code> and flushing the Serial buffer ensures low-latency communication with the bridge software.</p>
            </div>
          </div>

           <div className="flex gap-3">
             <CheckCircle className="text-green-400 shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-300">Memory Efficiency</p>
              <p className="text-slate-400 mt-1">Using <code>PROGMEM</code> for the velocity curves is a pro move. It saves valuable SRAM on the microcontroller for dynamic variables.</p>
            </div>
          </div>
        </div>

        {/* Improvements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-2">⚠️ Potential Improvements</h3>
          
          <div className="flex gap-3">
            <AlertTriangle className="text-orange-400 shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-300">Blocking ADC Read</p>
              <p className="text-slate-400 mt-1"><code>analogRead()</code> is blocking. On ESP32, continuous polling in the <code>loop()</code> can be jittery. Consider using DMA (Direct Memory Access) or FreeRTOS tasks pinned to Core 0 for dedicated ADC sampling.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertTriangle className="text-orange-400 shrink-0" size={20} />
            <div>
              <p className="font-bold text-slate-300">Debug String Fragmentation</p>
              <p className="text-slate-400 mt-1">While <code>F()</code> macro is used (good!), excessive <code>Serial.print</code> in the debug loop can cause timing hiccups. Ensure <code>DEBUG_ENABLE</code> is always false in production.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-900 rounded border border-slate-700 font-mono text-xs text-emerald-500/80">
        <p>VERDICT: This code is solid. The state machine implementation (IDLE -> RISING -> PEAK -> FALL) is robust for drum triggering. 9/10.</p>
      </div>
    </div>
  );
};

export default CodeReview;