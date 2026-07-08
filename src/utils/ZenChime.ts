import { NOTE_FREQUENCIES } from '../data/presets';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a rich, resonant traditional bell/chime sound using Web Audio API synthesis.
 * Uses a fundamental oscillator combined with high-frequency overtones and resonance
 * to mimic Tibetan singing bowls and wind chimes.
 */
export function playChime(note: string) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const frequency = NOTE_FREQUENCIES[note] || 261.63;
    const now = ctx.currentTime;

    // 1. Create a master gain for the note
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.35, now + 0.01); // Quick attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5); // Smooth long decay

    // 2. Fundamental Frequency (Sine wave for pure depth)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);

    // 3. Perfect Fifth overtone (frequency * 1.5) for rich harmonic chime
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 1.5, now);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    // 4. Sparkling bell harmonic (frequency * 3.13) for high wind-chime metallic ring
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(frequency * 3.13, now);
    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(0.05, now);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    // 5. Bandpass Filter to shape the wind chime ring
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(8, now); // Resonant Q
    filter.frequency.setValueAtTime(frequency * 2, now);

    // Connections
    osc1.connect(noteGain);
    
    osc2.connect(gain2);
    gain2.connect(noteGain);

    osc3.connect(gain3);
    gain3.connect(filter);
    filter.connect(noteGain);

    noteGain.connect(ctx.destination);

    // Start & Stop
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);
    osc3.stop(now + 2.5);
  } catch (error) {
    console.warn('Audio synthesis failed:', error);
  }
}
