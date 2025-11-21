import { PadConfig, VelocityCurve } from './types';

export const PAD_NAMES = [
  "KICK", "RIM", "SNARE", "CLAP",
  "TOM-L", "TOM-M", "HH-C", "TOM-H",
  "HH-O", "CRASH", "RIDE", "COWB"
];

// Mapping keyboard keys to pads for playability
export const KEY_MAPPINGS = [
  "1", "2", "3", "4",
  "Q", "W", "E", "R",
  "A", "S", "D", "F"
];

export const DEFAULT_PADS: PadConfig[] = PAD_NAMES.map((name, index) => ({
  id: index,
  name,
  keyTrigger: KEY_MAPPINGS[index],
  midiNote: 36 + index,
  sensitivity: 79, // Default from sketch
  threshold: 2,    // Default from sketch
  gain: 350,       // Default from sketch
  curve: VelocityCurve.CURVE_PROFESSIONAL,
  enabled: true
}));

export const OLED_WIDTH = 128;
export const OLED_HEIGHT = 64;