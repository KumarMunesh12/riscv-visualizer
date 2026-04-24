import React, { useState, useCallback } from 'react';
import { decodeInstruction, binToHex, FIELD_COLORS, INSTRUCTION_TYPES, padBinary } from '../encoding.js';
import EncodingBar from './EncodingBar.jsx';

const EXAMPLES = [
  { label: 'ADD x1,x2,x3', hex: '003100B3' },
  { label: 'ADDI x5, x0, 42', hex: '02A00293' },
  { label: 'LW x1, 0(x2)',    hex: '00012083' },
  { label: 'BEQ x1, x2, +8',  hex: '00208463' },
  { label: 'LUI x1, 0x12345', hex: '123450B7' },
  { label: 'JAL x0, +4',      hex: '0040006F' },
];

export default function Decoder({ onLoadToEncoder }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('hex'); // 'hex' | 'bin'

  const decode = useCallback((raw) => {
    if (!raw.trim()) { setResult(null); setError(''); return; }

    let bin32 = '';
    const clean = raw.trim().replace(/^0x/i, '').replace(/\s+/g, '');

    if (inputMode === 'hex') {
      if (!/^[0-9a-fA-F]{1,8}$/.test(clean)) {
        setError('Enter up to 8 hex digits (e.g. 003100B3)');
        setResult(null); return;
      }
      const num = parseInt(clean, 16);
      bin32 = num.toString(2).padStart(32, '0');
    } else {
      const binClean = clean.replace(/[^01]/g, '');
      if (binClean.length !== 32) {
        setError('Enter exactly 32 binary digits');
        setResult(null); return;
      }
      bin32 = binClean;
    }

    const decoded = decodeInstruction(bin32);
    if (decoded.error && !decoded.type) {
      setError(decoded.error);
      setResult(null);
    } else {
      setError(decoded.error || '');
      setResult({ ...decoded, bin32 });
    }
  }, [inputMode]);

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    decode(val);
  };

  const loadExample = (hex) => {
    if (inputMode !== 'hex') setInputMode('hex');
    setInput(hex);
    const num = parseInt(hex, 16);
    const bin32 = num.toString(2).padStart(32, '0');
    const decoded = decodeInstruction(bin32);
    setError(decoded.error && !decoded.type ? decoded.error : '');
    setResult(decoded.error && !decoded.type ? null : { ...decoded, bin32 });
  };

  const typeFields = result?.type ? INSTRUCTION_TYPES[result.type]?.fields : null;
  const displayValues = result?.values || {};

  return (
    <div className="flex flex-col gap-5">
      {/* Mode toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs tracking-widest uppercase" style={{ color: '#4a5568' }}>Input:</span>
        {['hex', 'bin'].map(m => (
          <button
            key={m}
            onClick={() => { setInputMode(m); setInput(''); setResult(null); setError(''); }}
            className="px-3 py-1 rounded text-xs font-bold transition-all"
            style={{
              background: inputMode === m ? 'rgba(96,165,250,0.15)' : 'transparent',
              border: `1px solid ${inputMode === m ? '#60a5fa' : '#1e2230'}`,
              color: inputMode === m ? '#60a5fa' : '#4a5568',
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {m === 'hex' ? 'HEX' : 'BINARY'}
          </button>
        ))}
      </div>

      {/* Input field */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder={inputMode === 'hex' ? 'e.g. 003100B3  (0x optional)' : 'e.g. 00000000001100010000000010110011'}
            className="field-input w-full rounded-lg px-4 py-3 text-sm font-mono"
            style={{
              borderColor: error ? '#f87171' : result ? '#34d399' : '#1e2230',
              fontSize: inputMode === 'bin' ? '11px' : '14px',
              letterSpacing: inputMode === 'bin' ? '0.05em' : 'normal',
            }}
            spellCheck={false}
          />
          {result && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                ✓ decoded
              </span>
            </div>
          )}
        </div>
        {error && <span className="text-xs" style={{ color: '#f87171' }}>⚠ {error}</span>}
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs" style={{ color: '#4a5568' }}>Try:</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex.hex}
            onClick={() => loadExample(ex.hex)}
            className="px-2.5 py-1 rounded text-xs transition-all font-mono"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2230', color: '#94a3b8' }}
            onMouseEnter={e => { e.target.style.borderColor = '#60a5fa'; e.target.style.color = '#60a5fa'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#1e2230'; e.target.style.color = '#94a3b8'; }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div className="flex flex-col gap-4 slide-in">
          {/* Mnemonic hero */}
          <div
            className="rounded-xl p-5 flex items-start justify-between gap-4"
            style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl font-bold tracking-widest"
                  style={{ fontFamily: "'Space Mono', monospace", color: '#34d399' }}
                >
                  {result.mnemonic}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded font-bold"
                  style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)', fontFamily: "'Space Mono', monospace" }}
                >
                  {result.type}
                </span>
              </div>
              <code className="text-sm mt-1" style={{ color: '#e2e8f0' }}>{result.assembly}</code>
              <p className="text-xs mt-1" style={{ color: '#4a5568' }}>{result.description}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-xs mb-1" style={{ color: '#4a5568' }}>hex</div>
              <div className="font-mono font-bold text-lg" style={{ color: '#60a5fa' }}>
                0x{binToHex(result.bin32)}
              </div>
            </div>
          </div>

          {/* Visual encoding bar */}
          {typeFields && (
            <div
              className="rounded-xl p-4"
              style={{ background: '#0d0f14', border: '1px solid #1e2230' }}
            >
              <EncodingBar fields={typeFields} values={displayValues} />
            </div>
          )}

          {/* Field table */}
          {typeFields && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e2230' }}>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ background: '#111318', borderBottom: '1px solid #1e2230' }}>
                    <th className="text-left px-3 py-2 tracking-widest uppercase" style={{ color: '#4a5568' }}>Field</th>
                    <th className="text-left px-3 py-2 tracking-widest uppercase" style={{ color: '#4a5568' }}>Bits</th>
                    <th className="text-left px-3 py-2 tracking-widest uppercase" style={{ color: '#4a5568' }}>Value</th>
                    <th className="text-right px-3 py-2 tracking-widest uppercase" style={{ color: '#4a5568' }}>Dec</th>
                  </tr>
                </thead>
                <tbody>
                  {typeFields.map((field, i) => {
                    const colors = FIELD_COLORS[field.key] || FIELD_COLORS.opcode;
                    const val = padBinary(displayValues[field.key] || '', field.bits);
                    return (
                      <tr
                        key={field.key}
                        style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent', borderBottom: '1px solid #1e2230' }}
                      >
                        <td className="px-3 py-2 font-bold" style={{ color: colors.text }}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm" style={{ background: colors.hex }} />
                            {field.label}
                          </div>
                        </td>
                        <td className="px-3 py-2" style={{ color: '#4a5568' }}>[{field.msb}:{field.lsb}]</td>
                        <td className="px-3 py-2" style={{ color: colors.text + 'cc' }}>{val}</td>
                        <td className="px-3 py-2 text-right" style={{ color: '#94a3b8' }}>{parseInt(val, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Load to encoder button */}
          {result.type && INSTRUCTION_TYPES[result.type] && (
            <button
              onClick={() => onLoadToEncoder(result.type, result.values)}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
              style={{
                background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.3)',
                color: '#f97316',
                fontFamily: "'Space Mono', monospace",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 1v9M3 7l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 12h12" strokeLinecap="round"/>
              </svg>
              Load into Encoder
            </button>
          )}
        </div>
      )}

      {!result && !error && (
        <div
          className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center"
          style={{ border: '1px dashed #1e2230' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.3 }}>
            <rect x="4" y="8" width="24" height="16" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
            <path d="M10 13h4M10 16h8M10 19h6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-xs" style={{ color: '#4a5568' }}>
            Paste a hex instruction above to decode it<br/>into its RISC-V fields
          </p>
        </div>
      )}
    </div>
  );
}
