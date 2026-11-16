"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CHORDS = [
  [130.81, 164.81, 196, 246.94], // Cmaj7
  [110, 164.81, 196, 261.63],    // Am7
  [87.31, 130.81, 164.81, 220],   // Fmaj7
  [98, 146.83, 246.94, 329.63],   // G6
];

export function SoundToggle() {
  const [isOn, setIsOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const busRef = useRef<BiquadFilterNode | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const chordIndexRef = useRef(0);

  const sync = useCallback(() => {
    const active = !!(
      isPlayingRef.current &&
      audioCtxRef.current &&
      audioCtxRef.current.state === "running"
    );
    setIsOn(active);
  }, []);

  const playNote = useCallback(
    (
      f: number,
      t: number,
      type: OscillatorType,
      pk: number,
      at: number,
      hold: number,
      rel: number
    ) => {
      const AC = audioCtxRef.current;
      const bus = busRef.current;
      if (!AC || !bus) return;

      const osc = AC.createOscillator();
      const gain = AC.createGain();
      osc.type = type;
      osc.frequency.value = f;

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(pk, t + at);
      gain.gain.setValueAtTime(pk, t + at + hold);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + at + hold + rel);

      osc.connect(gain);
      gain.connect(bus);
      osc.start(t);
      osc.stop(t + at + hold + rel + 0.1);
    },
    []
  );

  const scheduleLoop = useCallback(() => {
    if (!isPlayingRef.current || !audioCtxRef.current) return;
    const AC = audioCtxRef.current;
    if (AC.state !== "running") {
      playTimerRef.current = setTimeout(scheduleLoop, 400);
      return;
    }

    const t = AC.currentTime + 0.1;
    const chord = CHORDS[chordIndexRef.current++ % 4];

    // Warm pad notes
    chord.forEach((f, i) => {
      playNote(f, t + i * 0.08, "sine", 0.04, 2, 4.5, 3.5);
    });

    // Sparse pentatonic chimes
    for (let k = 0; k < 8; k++) {
      if (Math.random() < 0.75) {
        const m = chord[Math.floor(Math.random() * 4)] * (Math.random() < 0.5 ? 2 : 4);
        playNote(
          m,
          t + k + (Math.random() < 0.3 ? 0.5 : 0),
          "triangle",
          0.05,
          0.01,
          0,
          2.4
        );
      }
    }

    playTimerRef.current = setTimeout(scheduleLoop, 8000);
  }, [playNote]);

  const buildAudio = useCallback(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return false;

    const AC = new AudioContextClass();
    AC.onstatechange = sync;
    const mg = AC.createGain();
    mg.gain.value = 0;
    mg.connect(AC.destination);

    const bus = AC.createBiquadFilter();
    bus.type = "lowpass";
    bus.frequency.value = 2400;
    bus.connect(mg);

    const dl = AC.createDelay(2);
    const fb = AC.createGain();
    const wt = AC.createGain();
    const dp = AC.createBiquadFilter();

    dl.delayTime.value = 0.55;
    fb.gain.value = 0.45;
    wt.gain.value = 0.45;
    dp.type = "lowpass";
    dp.frequency.value = 1600;

    bus.connect(dl);
    dl.connect(dp);
    dp.connect(fb);
    fb.connect(dl);
    dp.connect(wt);
    wt.connect(mg);

    audioCtxRef.current = AC;
    masterGainRef.current = mg;
    busRef.current = bus;
    return true;
  }, [sync]);

  const soundOn = useCallback(() => {
    if (!audioCtxRef.current && !buildAudio()) return;
    const AC = audioCtxRef.current!;
    const mg = masterGainRef.current!;

    isPlayingRef.current = true;
    mg.gain.cancelScheduledValues(AC.currentTime);
    mg.gain.setTargetAtTime(0.55, AC.currentTime, 1.2);

    const r = AC.resume();
    if (r && r.then) r.then(sync, () => {});
    sync();

    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    playTimerRef.current = setTimeout(scheduleLoop, 300);
  }, [buildAudio, scheduleLoop, sync]);

  const soundOff = useCallback(() => {
    isPlayingRef.current = false;
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    if (!audioCtxRef.current || !masterGainRef.current) {
      sync();
      return;
    }

    const AC = audioCtxRef.current;
    const mg = masterGainRef.current;
    mg.gain.cancelScheduledValues(AC.currentTime);
    mg.gain.setTargetAtTime(0, AC.currentTime, 0.25);
    sync();

    setTimeout(() => {
      if (!isPlayingRef.current && audioCtxRef.current === AC) {
        audioCtxRef.current = null;
        masterGainRef.current = null;
        busRef.current = null;
        AC.close();
      }
    }, 1500);
  }, [sync]);

  const toggleSound = () => {
    if (isOn) {
      soundOff();
    } else {
      soundOn();
    }
  };

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      className={`snd ${isOn ? "on" : ""}`}
      id="snd"
      type="button"
      aria-pressed={isOn}
      aria-label={isOn ? "Turn ambient sound off" : "Turn ambient sound on"}
      onClick={toggleSound}
    >
      <span />
      <span />
      <span />
      <span />
    </button>
  );
}
