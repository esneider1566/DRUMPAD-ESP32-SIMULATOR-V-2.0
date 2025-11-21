export enum VelocityCurve {
  CURVE_LINEAR = 0,
  CURVE_PROFESSIONAL = 1
}

export enum PadState {
  PAD_IDLE = 0,
  PAD_RISING,
  PAD_PEAK,
  PAD_FALLING,
  PAD_MASK
}

export interface PadConfig {
  id: number;
  name: string;
  keyTrigger: string; // Keyboard key to trigger
  midiNote: number;
  sensitivity: number;
  threshold: number;
  gain: number;
  curve: VelocityCurve;
  enabled: boolean;
}

export interface GlobalConfig {
  masterVolume: number;
  tempo: number;
  usbMidiEnable: boolean;
}

export interface HitStats {
  totalHits: number;
  ghostNotes: number;
  lastHitTime: number;
  lastVelocity: number;
  latency: number;
}