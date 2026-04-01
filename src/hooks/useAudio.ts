// Web Audio API — todos os sons gerados proceduralmente, sem arquivos externos
// Começa mutado; activate() precisa ser chamado num gesto do usuário

import { useRef, useCallback, useState } from 'react';

interface AudioState {
  isReady: boolean;
  lofiEnabled: boolean;
  masterMuted: boolean;
  activate: () => void;
  toggleLofi: () => void;
  toggleMute: () => void;
  playTyping: () => void;
  playNotification: () => void;
}

export function useAudio(): AudioState {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const lofiGainRef = useRef<GainNode | null>(null);
  const lofiOscsRef = useRef<OscillatorNode[]>([]);

  const [isReady, setIsReady] = useState(false);
  const [lofiEnabled, setLofiEnabled] = useState(false);
  const [masterMuted, setMasterMuted] = useState(true);

  // Inicializa o AudioContext — deve ser chamado num gesto do usuário
  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0; // começa mutado
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return ctxRef.current;
  }

  const activate = useCallback(() => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    if (masterRef.current) masterRef.current.gain.value = 0.5;
    setMasterMuted(false);
    setIsReady(true);
  }, []);

  const toggleMute = useCallback(() => {
    if (!masterRef.current) return;
    setMasterMuted((prev) => {
      const next = !prev;
      masterRef.current!.gain.value = next ? 0 : 0.5;
      return next;
    });
  }, []);

  // Click de teclado: burst de ruído branco filtrado (banda estreita ~800Hz)
  const playTyping = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    const bufSize = Math.floor(ctx.sampleRate * 0.035);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.08;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500 + Math.random() * 900;
    filter.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start();
  }, []);

  // Notificação: 3 notas ascendentes (arpegio suave)
  const playNotification = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;

    [880, 1108, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.09;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.14, t + 0.012);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.connect(env);
      env.connect(master);
      osc.start(t);
      osc.stop(t + 0.42);
    });
  }, []);

  // Lo-fi: pad ambiente com osciladores em A minor + filtro LFO
  const startLofi = useCallback(() => {
    const ctx = getCtx();
    const master = masterRef.current!;
    if (lofiGainRef.current) return;

    const lofiGain = ctx.createGain();
    lofiGain.gain.value = 0;
    lofiGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 2);
    lofiGain.connect(master);
    lofiGainRef.current = lofiGain;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.7;
    filter.connect(lofiGain);

    // LFO varrendo o filtro suavemente
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    lofiOscsRef.current.push(lfo);

    // Acorde Am: A2, C3, E3, A3 + oitava A1 no bass
    const notes = [55, 110, 130.81, 164.81, 220];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.value = freq + (Math.random() - 0.5) * 2; // leve detune
      oscGain.gain.value = i === 0 ? 0.5 : 0.18;
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      lofiOscsRef.current.push(osc);
    });

    // Ruído rosa suave (textura analógica)
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < noiseBuf.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      noiseData[i] = (b0 + b1 + b2) * 0.11;
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuf;
    noiseNode.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.06;
    noiseNode.connect(noiseGain);
    noiseGain.connect(filter);
    noiseNode.start();
  }, []);

  const stopLofi = useCallback(() => {
    const ctx = ctxRef.current;
    const gain = lofiGainRef.current;
    if (!ctx || !gain) return;
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      lofiOscsRef.current.forEach((o) => { try { o.stop(); } catch {} });
      lofiOscsRef.current = [];
      lofiGainRef.current = null;
    }, 1600);
  }, []);

  const toggleLofi = useCallback(() => {
    setLofiEnabled((prev) => {
      if (prev) {
        stopLofi();
        return false;
      } else {
        startLofi();
        return true;
      }
    });
  }, [startLofi, stopLofi]);

  return { isReady, lofiEnabled, masterMuted, activate, toggleLofi, toggleMute, playTyping, playNotification };
}
