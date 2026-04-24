import React, { useState } from 'react';
import { binToHex, FIELD_COLORS, padBinary } from '../encoding.js';

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-2.5 py-1 rounded text-xs transition-all"
      style={{
        background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${copied ? '#34d399' : '#1e2230'}`,
        color: copied ? '#34d399' : '#4a5568',
      }}
    >
      {copied ? '✓ copied' : `copy ${label}`}
    </button>
  );
}

function GroupedBinaryDisplay({ binary, fields }) {
  // Build a map: bit index → field key
  const bitFieldMap = {};
  fields.forEach(f => {
    for (let b = f.lsb; b <= f.msb; b++) {
      bitFieldMap[b] = f.key;
    }
  });

  return (
    <div className="flex flex-wrap gap-x-0 font-mono text-sm select-all leading-none">
      {binary.split('').map((bit, i) => {
        const bitIndex = 31 - i; // MSB is bit 31
        const fieldKey = bitFieldMap[bitIndex];
        const colors = fieldKey ? (FIELD_COLORS[fieldKey] || FIELD_COLORS.opcode) : null;
        return (
          <span
            key={i}
            className="transition-colors"
            style={{
              color: colors ? (bit === '1' ? colors.text : colors.text + '55') : '#4a5568',
              borderBottom: colors ? `1px solid ${colors.border}44` : 'none',
              // Group separator every field boundary
              marginRight: fields.some(f => f.lsb === bitIndex) && i < 31 ? '4px' : '0',
            }}
          >
            {bit}
          </span>
        );
      })}
    </div>
  );
}

export default function OutputDisplay({ binary, fields, values }) {
  const hex = binToHex(binary);
  const decimal = parseInt(binary, 2);
  const isValid = binary.length === 32 && /^[01]+$/.test(binary);

  const groupedHex = hex.match(/.{1,4}/g)?.join(' ') || hex;

  return (
    <div className="flex flex-col gap-4">

      {/* Binary output */}
      <div
        className="rounded-lg p-4"
        style={{ background: '#0d0f14', border: '1px solid #1e2230' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs tracking-widest uppercase" style={{ color: '#4a5568' }}>
            Binary (32-bit)
          </span>
          <CopyButton text={binary} label="bin" />
        </div>
        <GroupedBinaryDisplay binary={binary} fields={fields} />
        {/* Grouped with spaces every 8 bits */}
        <div className="mt-2 font-mono text-xs" style={{ color: '#2d3748' }}>
          {binary.match(/.{1,8}/g)?.join(' ')}
        </div>
      </div>

      {/* Hex + Decimal row */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg p-4"
          style={{ background: '#0d0f14', border: '1px solid #1e2230' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-widest uppercase" style={{ color: '#4a5568' }}>Hex</span>
            <CopyButton text={`0x${hex}`} label="hex" />
          </div>
          <span className="font-mono text-lg font-bold" style={{ color: '#60a5fa' }}>
            0x{hex}
          </span>
          <div className="mt-1 text-xs font-mono" style={{ color: '#2d3748' }}>
            {groupedHex}
          </div>
        </div>

        <div
          className="rounded-lg p-4"
          style={{ background: '#0d0f14', border: '1px solid #1e2230' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-widest uppercase" style={{ color: '#4a5568' }}>Decimal</span>
            <CopyButton text={decimal.toString()} label="dec" />
          </div>
          <span className="font-mono text-lg font-bold" style={{ color: '#a78bfa' }}>
            {isValid ? decimal.toLocaleString() : '—'}
          </span>
          <div className="mt-1 text-xs font-mono" style={{ color: '#2d3748' }}>
            unsigned 32-bit
          </div>
        </div>
      </div>

      {/* Field breakdown table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: '1px solid #1e2230' }}
      >
        <table className="w-full text-xs font-mono">
          <thead>
            <tr style={{ background: '#111318', borderBottom: '1px solid #1e2230' }}>
              <th className="text-left px-3 py-2 font-semibold tracking-wider uppercase" style={{ color: '#4a5568' }}>Field</th>
              <th className="text-left px-3 py-2 font-semibold tracking-wider uppercase" style={{ color: '#4a5568' }}>Bits</th>
              <th className="text-left px-3 py-2 font-semibold tracking-wider uppercase" style={{ color: '#4a5568' }}>Binary</th>
              <th className="text-right px-3 py-2 font-semibold tracking-wider uppercase" style={{ color: '#4a5568' }}>Dec</th>
              <th className="text-right px-3 py-2 font-semibold tracking-wider uppercase" style={{ color: '#4a5568' }}>Hex</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, i) => {
              const colors = FIELD_COLORS[field.key] || FIELD_COLORS.opcode;
              const padded = padBinary(values[field.key] || '', field.bits);
              const dec = parseInt(padded, 2);
              const hexVal = dec.toString(16).toUpperCase().padStart(Math.ceil(field.bits / 4), '0');
              return (
                <tr
                  key={field.key}
                  style={{
                    background: i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent',
                    borderBottom: '1px solid #1e2230',
                  }}
                >
                  <td className="px-3 py-2 font-bold" style={{ color: colors.text }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm" style={{ background: colors.hex }} />
                      {field.label}
                    </div>
                  </td>
                  <td className="px-3 py-2" style={{ color: '#4a5568' }}>[{field.msb}:{field.lsb}]</td>
                  <td className="px-3 py-2" style={{ color: colors.text + 'cc' }}>{padded}</td>
                  <td className="px-3 py-2 text-right" style={{ color: '#94a3b8' }}>{dec}</td>
                  <td className="px-3 py-2 text-right" style={{ color: '#94a3b8' }}>0x{hexVal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
