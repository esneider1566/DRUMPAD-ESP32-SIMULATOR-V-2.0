let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const createNoiseBuffer = () => {
  if (!audioCtx) return null;
  const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

let noiseBuffer: AudioBuffer | null = null;

export const playDrumSound = (type: string, velocity: number) => {
  const ctx = initAudio();
  if (!ctx) return;
  if (!noiseBuffer) noiseBuffer = createNoiseBuffer();

  const t = ctx.currentTime;
  const vol = velocity / 127;

  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);
  gainNode.gain.setValueAtTime(vol, t);
  gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

  if (type.includes("KICK")) {
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
    osc.connect(gainNode);
    osc.start(t);
    osc.stop(t + 0.5);
  } 
  else if (type.includes("SNARE") || type.includes("RIM") || type.includes("CLAP")) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.connect(gainNode);
    osc.start(t);
    osc.stop(t + 0.2);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.8, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.connect(noiseFilter);
    noise.start(t);
    noise.stop(t + 0.2);
  }
  else if (type.includes("HH") || type.includes("CRASH") || type.includes("RIDE")) {
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.6, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + (type.includes("O") || type.includes("CRASH") ? 0.5 : 0.1));

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 5000;
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.connect(noiseFilter);
    noise.start(t);
    noise.stop(t + 0.5);
  } 
  else {
    // Toms / Cowbell
    const osc = ctx.createOscillator();
    osc.type = type.includes("COWB") ? 'square' : 'sine';
    osc.frequency.setValueAtTime(type.includes("H") ? 200 : 100, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.3);
    osc.connect(gainNode);
    osc.start(t);
    osc.stop(t + 0.3);
  }
};