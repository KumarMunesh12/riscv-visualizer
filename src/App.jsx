import React, { useState, useCallback, useEffect } from 'react';
import InputForm from './components/InputForm.jsx';
import EncodingBar from './components/EncodingBar.jsx';
import OutputDisplay from './components/OutputDisplay.jsx';
import Decoder from './components/Decoder.jsx';
import AssemblyView from './components/AssemblyView.jsx';
import { INSTRUCTION_TYPES, FIELD_COLORS, validateField, buildInstruction } from './encoding.js';
import ParticleBackground from './components/ParticleBackground.jsx';

const TYPE_KEYS = Object.keys(INSTRUCTION_TYPES);

export default function App() {
  const [tab, setTab] = useState('encoder');
  const [instrType, setInstrType] = useState('R-type');
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const typeDef = INSTRUCTION_TYPES[instrType];

  useEffect(() => {
    setValues(typeDef.defaults);
    setErrors({});
  }, [instrType]);

  const handleChange = useCallback((key, rawValue) => {
    const field = typeDef.fields.find(f => f.key === key);
    if (!field) return;
    const validation = validateField(rawValue, field.bits);
    setErrors(prev => ({ ...prev, [key]: validation.valid ? '' : validation.msg }));
    setValues(prev => ({ ...prev, [key]: rawValue }));
  }, [typeDef]);

  const handleReset = () => { setValues(typeDef.defaults); setErrors({}); };
  const applyPreset = (preset) => { setValues(prev => ({ ...prev, ...preset.values })); setErrors({}); };

  const loadToEncoder = (type, decodedValues) => {
    if (!INSTRUCTION_TYPES[type]) return;
    setInstrType(type);
    setTimeout(() => {
      setValues({ ...INSTRUCTION_TYPES[type].defaults, ...decodedValues });
      setErrors({});
    }, 50);
    setTab('encoder');
  };

  const binary = buildInstruction(typeDef.fields, values);
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <ParticleBackground />
      {/* Header */}
      <header className="border-b sticky top-0 z-40" style={{ borderColor: '#1e2230', background: '#0a0c10ee', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <rect x="8" y="8" width="12" height="12" rx="1.5" stroke="#f97316" strokeWidth="1.5"/>
              <rect x="10.5" y="10.5" width="7" height="7" rx="0.5" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="0.5"/>
              <line x1="5" y1="11" x2="8" y2="11" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="5" y1="14" x2="8" y2="14" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="5" y1="17" x2="8" y2="17" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="11" x2="23" y2="11" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="14" x2="23" y2="14" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="17" x2="23" y2="17" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="11" y1="5" x2="11" y2="8" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="5" x2="14" y2="8" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="5" x2="17" y2="8" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="11" y1="20" x2="11" y2="23" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="20" x2="14" y2="23" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="20" x2="17" y2="23" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                RISC-V <span style={{ color: '#f97316' }}>Instruction</span> Visualizer
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>RV32I Base Integer ISA</p>
            </div>
          </div>

          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #1e2230' }}>
            {[
              { key: 'encoder', label: '⬡  Encoder' },
              { key: 'decoder', label: '⬢  Decoder' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="px-4 py-2 text-xs font-bold transition-all"
                style={{
                  background: tab === key ? 'rgba(249,115,22,0.15)' : 'transparent',
                  color: tab === key ? '#f97316' : '#4a5568',
                  fontFamily: "'Space Mono', monospace",
                  borderRight: key === 'encoder' ? '1px solid #1e2230' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color: '#4a5568' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            6 formats · 37 instructions
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ─── ENCODER ─── */}
        {tab === 'encoder' && (
          <div className="flex flex-col gap-6">
            {/* Format + preset controls */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs tracking-widest uppercase mr-1" style={{ color: '#4a5568' }}>Format:</span>
                {TYPE_KEYS.map(t => (
                  <button
                    key={t}
                    onClick={() => setInstrType(t)}
                    className="px-3 py-1.5 rounded font-bold text-xs tracking-wider transition-all"
                    style={{
                      background: instrType === t ? 'rgba(249,115,22,0.15)' : 'transparent',
                      border: `1px solid ${instrType === t ? '#f97316' : '#1e2230'}`,
                      color: instrType === t ? '#f97316' : '#4a5568',
                      fontFamily: "'Space Mono', monospace",
                      boxShadow: instrType === t ? '0 0 10px rgba(249,115,22,0.2)' : 'none',
                    }}
                  >
                    {t}
                  </button>
                ))}
                <button
                  onClick={handleReset}
                  className="ml-auto px-3 py-1.5 rounded text-xs transition-all flex items-center gap-1.5"
                  style={{ background: 'transparent', border: '1px solid #1e2230', color: '#4a5568' }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 6a5 5 0 1 0 .5-2.2" strokeLinecap="round"/>
                    <path d="M1 2v2.5h2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-xs px-2.5 py-1.5 rounded" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)', color: '#94a3b8' }}>
                  <span style={{ color: '#f97316' }}>{instrType}: </span>
                  {typeDef.description}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                  <span className="text-xs" style={{ color: '#4a5568' }}>Presets:</span>
                  {typeDef.presets.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-2.5 py-1 rounded text-xs font-bold tracking-widest transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2230', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}
                      onMouseEnter={e => { e.target.style.borderColor = '#60a5fa'; e.target.style.color = '#60a5fa'; e.target.style.background = 'rgba(96,165,250,0.08)'; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#1e2230'; e.target.style.color = '#94a3b8'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Assembly mnemonic hero */}
            <AssemblyView instrType={instrType} values={values} />

            {/* Main 2-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
              {/* Inputs */}
              <div className="rounded-xl p-5" style={{ background: '#111318', border: '1px solid #1e2230' }}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>Field Inputs</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                    {typeDef.fields.reduce((a, f) => a + f.bits, 0)}-bit
                  </span>
                </div>
                <InputForm fields={typeDef.fields} values={values} errors={errors} onChange={handleChange} />
              </div>

              {/* Viz + output */}
              <div className="flex flex-col gap-5">
                <div className="rounded-xl p-5" style={{ background: '#111318', border: '1px solid #1e2230' }}>
                  <div className="mb-4 text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>Bit Layout</div>
                  <EncodingBar fields={typeDef.fields} values={values} />
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{ background: '#111318', border: `1px solid ${hasErrors ? 'rgba(248,113,113,0.3)' : '#1e2230'}` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>Encoded Output</span>
                    {hasErrors && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                        ⚠ validation errors
                      </span>
                    )}
                  </div>
                  <OutputDisplay binary={binary} fields={typeDef.fields} values={values} />
                </div>
              </div>
            </div>

            {/* Format reference */}
            <div className="rounded-xl p-5" style={{ background: '#111318', border: '1px solid #1e2230' }}>
              <div className="mb-3 text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>RV32I Format Reference</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(INSTRUCTION_TYPES).map(([key, def]) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg cursor-pointer transition-all"
                    onClick={() => setInstrType(key)}
                    style={{
                      background: instrType === key ? 'rgba(249,115,22,0.07)' : 'rgba(0,0,0,0.2)',
                      border: `1px solid ${instrType === key ? 'rgba(249,115,22,0.4)' : '#1e2230'}`,
                    }}
                  >
                    <div className="font-bold text-xs mb-2" style={{ color: instrType === key ? '#f97316' : '#94a3b8', fontFamily: "'Space Mono', monospace" }}>{key}</div>
                    <div className="flex gap-px mb-1.5 h-2.5">
                      {def.fields.map(f => {
                        const c = FIELD_COLORS[f.key];
                        return (
                          <div key={f.key} className="rounded-sm" style={{ flex: f.bits, background: c?.bg || 'rgba(255,255,255,0.05)', border: `1px solid ${c?.border || '#1e2230'}55` }} title={f.label} />
                        );
                      })}
                    </div>
                    <div style={{ color: '#2d3748', fontSize: '9px', fontFamily: 'monospace', lineHeight: 1.4 }}>
                      {def.fields.map(f => f.label).join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── DECODER ─── */}
        {tab === 'decoder' && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl p-6" style={{ background: '#111318', border: '1px solid #1e2230' }}>
              <div className="mb-6">
                <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#4a5568' }}>Instruction Decoder</div>
                <p className="text-xs" style={{ color: '#4a5568' }}>Paste any RV32I 32-bit instruction in hex or binary — fields are decoded and the mnemonic identified automatically</p>
              </div>
              <Decoder onLoadToEncoder={loadToEncoder} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-10 py-4" style={{ borderColor: '#1e2230' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs" style={{ color: '#2d3748' }}>
          <span style={{ fontFamily: "'Space Mono', monospace" }}>RISC-V ISA Visualizer · RV32I</span>
          <span>RISC-V International Unprivileged Spec v20191213</span>
        </div>
      </footer>
    </div>
  );
}
