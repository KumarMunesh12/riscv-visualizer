import React, { useState } from 'react';
import { FIELD_COLORS, TOOLTIPS, validateField, padBinary, decToBin, REG_NAMES } from '../encoding.js';

function FieldInput({ field, value, onChange, error }) {
  const [mode, setMode] = useState('bin'); // 'bin' | 'dec' | 'reg'
  const colors = FIELD_COLORS[field.key] || FIELD_COLORS.opcode;
  const tooltip = TOOLTIPS[field.key] || '';
  const isRegField = ['rd','rs1','rs2'].includes(field.key);

  const handleBinChange = (e) => {
    const raw = e.target.value.replace(/[^01]/g, '').slice(0, field.bits);
    onChange(field.key, raw);
  };

  const handleDecChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') { onChange(field.key, ''); return; }
    const bin = decToBin(parseInt(raw), field.bits);
    onChange(field.key, bin);
  };

  const handleRegChange = (e) => {
    const idx = parseInt(e.target.value);
    const bin = decToBin(idx, field.bits);
    onChange(field.key, bin);
  };

  const currentDec = value ? parseInt(value, 2) : 0;
  const paddedValue = padBinary(value || '', field.bits);

  return (
    <div className="relative group flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: colors.hex, boxShadow: `0 0 6px ${colors.hex}88` }}
          />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: colors.text }}>
            {field.label}
          </span>
          <span className="text-xs" style={{ color: '#4a5568' }}>
            [{field.msb}:{field.lsb}]
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#1a1d26', color: '#4a5568' }}>
            {field.bits}b
          </span>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded overflow-hidden border" style={{ borderColor: '#1e2230' }}>
          {['bin', 'dec', ...(isRegField ? ['reg'] : [])].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-2 py-0.5 text-xs transition-colors"
              style={{
                background: mode === m ? colors.bg : 'transparent',
                color: mode === m ? colors.text : '#4a5568',
              }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="relative">
        {mode === 'reg' ? (
          <select
            value={currentDec}
            onChange={handleRegChange}
            className="field-input w-full rounded px-3 py-2 text-sm appearance-none cursor-pointer"
            style={{ borderColor: error ? '#f87171' : colors.border + '66' }}
          >
            {REG_NAMES.map((name, i) => (
              <option key={i} value={i}>{name}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={mode === 'bin' ? (value || '') : (value ? currentDec.toString() : '')}
            onChange={mode === 'bin' ? handleBinChange : handleDecChange}
            placeholder={mode === 'bin' ? '0'.repeat(field.bits) : `0–${Math.pow(2, field.bits) - 1}`}
            className="field-input w-full rounded px-3 py-2"
            style={{ borderColor: error ? '#f87171' : colors.border + '66' }}
            spellCheck={false}
          />
        )}

        {/* Bit count indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {mode === 'bin' && (
            <span className="text-xs" style={{ color: (value || '').length > field.bits ? '#f87171' : '#4a5568' }}>
              {(value || '').length}/{field.bits}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <span className="text-xs" style={{ color: '#f87171' }}>{error}</span>
      )}

      {/* Decoded value preview */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4a5568' }}>
        <span>→</span>
        <span className="font-mono" style={{ color: colors.text + 'aa' }}>
          {paddedValue}
        </span>
        {isRegField && (
          <span style={{ color: '#4a5568' }}>
            = {REG_NAMES[currentDec] || `x${currentDec}`}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute -top-2 left-0 right-0 -translate-y-full z-50 px-3 py-2 rounded text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: '#1a1d26', border: '1px solid ' + colors.border + '44', color: '#94a3b8', maxWidth: '320px' }}
        >
          <span style={{ color: colors.text, fontWeight: 700 }}>{field.label}: </span>
          {tooltip}
          <div
            className="absolute left-4 top-full w-0 h-0"
            style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid #1a1d26` }}
          />
        </div>
      )}
    </div>
  );
}

export default function InputForm({ fields, values, errors, onChange }) {
  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={values[field.key] || ''}
          error={errors[field.key]}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
