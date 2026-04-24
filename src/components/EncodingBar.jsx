import React, { useState } from 'react';
import { FIELD_COLORS, padBinary, TOOLTIPS } from '../encoding.js';

function BitCell({ bit, color, isActive }) {
  return (
    <div
      className="bit-cell select-none"
      style={{
        background: bit === '1' ? color + '33' : 'transparent',
        color: bit === '1' ? color : '#2d3748',
        fontWeight: bit === '1' ? 700 : 400,
      }}
    >
      {bit}
    </div>
  );
}

function FieldSegment({ field, value, isHovered, onHover, onLeave }) {
  const colors = FIELD_COLORS[field.key] || FIELD_COLORS.opcode;
  const paddedVal = padBinary(value || '', field.bits);
  const bits = paddedVal.split('');

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ flex: field.bits }}
      onMouseEnter={() => onHover(field.key)}
      onMouseLeave={onLeave}
    >
      {/* Bit number labels - top */}
      <div className="flex w-full justify-between px-0.5 mb-1">
        <span className="text-xs" style={{ color: '#2d3748', fontSize: '9px' }}>{field.msb}</span>
        <span className="text-xs" style={{ color: '#2d3748', fontSize: '9px' }}>{field.lsb}</span>
      </div>

      {/* The bit cells */}
      <div
        className="flex w-full rounded-sm overflow-hidden"
        style={{
          border: `1px solid ${isHovered ? colors.border : colors.border + '55'}`,
          background: isHovered ? colors.bg : 'rgba(0,0,0,0.3)',
          boxShadow: isHovered ? `0 0 16px ${colors.hex}44, inset 0 0 8px ${colors.hex}11` : 'none',
          transition: 'all 0.15s',
          transform: isHovered ? 'scaleY(1.06)' : 'scaleY(1)',
        }}
      >
        {bits.map((bit, i) => (
          <BitCell
            key={i}
            bit={bit}
            color={colors.hex}
            isActive={bit === '1'}
          />
        ))}
      </div>

      {/* Field label */}
      <div className="mt-1.5 flex flex-col items-center gap-0.5">
        <span
          className="text-xs font-bold tracking-wider"
          style={{
            color: isHovered ? colors.text : colors.text + 'aa',
            fontSize: '10px',
            transition: 'color 0.15s',
          }}
        >
          {field.label}
        </span>
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <div
          className="absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded text-xs leading-relaxed whitespace-nowrap pointer-events-none slide-in"
          style={{
            background: '#1a1d26',
            border: `1px solid ${colors.border}55`,
            color: '#94a3b8',
            maxWidth: '280px',
            whiteSpace: 'normal',
          }}
        >
          <div className="font-bold mb-0.5" style={{ color: colors.text }}>{field.label} [{field.msb}:{field.lsb}]</div>
          <div className="opacity-80">{TOOLTIPS[field.key]}</div>
          <div className="mt-1 font-mono" style={{ color: colors.text }}>
            = 0b{paddedVal} = {parseInt(paddedVal, 2)}
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45"
            style={{ background: '#1a1d26', border: `1px solid ${colors.border}55`, borderBottom: 'none', borderRight: 'none' }}
          />
        </div>
      )}
    </div>
  );
}

export default function EncodingBar({ fields, values }) {
  const [hoveredField, setHoveredField] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest uppercase" style={{ color: '#4a5568' }}>
          32-bit Instruction Layout
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#4a5568' }}>bit 31</span>
          <div className="h-px flex-1 w-16" style={{ background: 'linear-gradient(to right, #4a5568, transparent)' }} />
          <span className="text-xs" style={{ color: '#4a5568' }}>bit 0</span>
        </div>
      </div>

      {/* Main encoding bar */}
      <div
        className="flex w-full rounded-lg overflow-visible p-3"
        style={{ background: '#0d0f14', border: '1px solid #1e2230', minHeight: '80px' }}
      >
        <div className="flex w-full gap-px">
          {fields.map((field) => (
            <FieldSegment
              key={field.key}
              field={field}
              value={values[field.key]}
              isHovered={hoveredField === field.key}
              onHover={setHoveredField}
              onLeave={() => setHoveredField(null)}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-1">
        {fields.map((field) => {
          const colors = FIELD_COLORS[field.key] || FIELD_COLORS.opcode;
          const paddedVal = padBinary(values[field.key] || '', field.bits);
          return (
            <div
              key={field.key}
              className="flex items-center gap-1.5 px-2 py-1 rounded cursor-default"
              style={{
                background: hoveredField === field.key ? colors.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hoveredField === field.key ? colors.border : '#1e2230'}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={() => setHoveredField(field.key)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="w-2 h-2 rounded-sm" style={{ background: colors.hex }} />
              <span className="text-xs" style={{ color: colors.text + 'cc' }}>{field.label}</span>
              <span className="text-xs font-mono" style={{ color: colors.text }}>
                {parseInt(paddedVal, 2).toString(16).toUpperCase().padStart(Math.ceil(field.bits / 4), '0')}h
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
