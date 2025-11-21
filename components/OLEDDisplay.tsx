import React, { useEffect, useRef } from 'react';
import { PadConfig, PadState, VelocityCurve } from '../types';
import { OLED_WIDTH, OLED_HEIGHT } from '../constants';

interface OLEDDisplayProps {
  currentPad: PadConfig;
  padState: PadState;
  lastVelocity: number;
  totalHits: number;
  stateName: string;
}

const OLEDDisplay: React.FC<OLEDDisplayProps> = ({ currentPad, padState, lastVelocity, totalHits, stateName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear screen (Black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, OLED_WIDTH, OLED_HEIGHT);

    // Set color (White/Blueish for OLED look)
    ctx.fillStyle = '#aaddff';
    ctx.strokeStyle = '#aaddff';
    
    // Font setup (Simulate Adafruit GFX default font roughly)
    ctx.font = '10px "Courier New", monospace';
    ctx.textBaseline = 'top';

    // === HEADER ===
    ctx.fillText(`${currentPad.name} [${stateName}]`, 0, 0);
    const hitText = `H:${totalHits % 1000}`;
    const hitWidth = ctx.measureText(hitText).width;
    ctx.fillText(hitText, OLED_WIDTH - hitWidth, 0);

    // Divider Line
    ctx.beginPath();
    ctx.moveTo(0, 11);
    ctx.lineTo(OLED_WIDTH, 11);
    ctx.stroke();

    // === PARAMETERS ===
    const drawBar = (x: number, y: number, w: number, h: number, val: number, max: number) => {
      ctx.strokeRect(x, y, w, h);
      const filled = Math.min(w - 2, Math.max(0, (val / max) * (w - 2)));
      if (filled > 0) {
        ctx.fillRect(x + 1, y + 1, filled, h - 2);
      }
    };

    // SENS
    ctx.fillText("SENS:", 0, 14);
    ctx.fillText(currentPad.sensitivity.toString(), 75, 14);
    drawBar(35, 14, 35, 8, currentPad.sensitivity, 100);

    // THRS
    ctx.fillText("THRS:", 0, 24);
    ctx.fillText(currentPad.threshold.toString(), 75, 24);
    drawBar(35, 24, 35, 8, currentPad.threshold, 100);

    // GAIN
    ctx.fillText("GAIN:", 0, 34);
    ctx.fillText(currentPad.gain.toString(), 75, 34);
    drawBar(35, 34, 35, 8, currentPad.gain, 500);

    // CURVE & NOTE
    ctx.fillText("CURVE:", 0, 46);
    ctx.fillText(currentPad.curve === VelocityCurve.CURVE_PROFESSIONAL ? "PRO" : "LIN", 40, 46);
    ctx.fillText(`N:${currentPad.midiNote}`, 85, 46);

    // Divider
    ctx.beginPath();
    ctx.moveTo(0, 56);
    ctx.lineTo(OLED_WIDTH, 56);
    ctx.stroke();

    // === VELOCITY METER ===
    // Velocity bar at bottom
    if (lastVelocity > 0) {
        drawBar(0, 58, OLED_WIDTH, 6, lastVelocity, 127);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple pixelation effect by disabling smoothing
    ctx.imageSmoothingEnabled = false;
    
    draw(ctx);
  }, [currentPad, padState, lastVelocity, totalHits, stateName]);

  return (
    <div className="border-4 border-gray-600 rounded-md bg-black p-1 shadow-lg inline-block">
        <canvas 
            ref={canvasRef} 
            width={OLED_WIDTH} 
            height={OLED_HEIGHT}
            className="w-full h-auto"
            style={{ imageRendering: 'pixelated', width: '256px', height: '128px' }} // Double scale for visibility
        />
    </div>
  );
};

export default OLEDDisplay;