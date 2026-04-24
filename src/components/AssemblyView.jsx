import React from 'react';
import { regName, padBinary } from '../encoding.js';

// Reconstruct assembly mnemonic from encoder fields + type
export function buildMnemonic(instrType, values, presets) {
  const v = values;
  const pad = (k, b) => padBinary(v[k] || '', b);

  const rd  = parseInt(pad('rd', 5), 2);
  const rs1 = parseInt(pad('rs1', 5), 2);
  const rs2 = parseInt(pad('rs2', 5), 2);
  const rdN  = regName(rd);
  const rs1N = regName(rs1);
  const rs2N = regName(rs2);

  const signExtend = (val, bits) => {
    const msb = 1 << (bits - 1);
    return (val & (msb - 1)) - (val & msb);
  };

  switch (instrType) {
    case 'R-type': {
      const funct3 = pad('funct3', 3);
      const funct7 = pad('funct7', 7);
      const rMap = {
        '000': { '0000000': 'ADD', '0100000': 'SUB' },
        '111': { '0000000': 'AND' }, '110': { '0000000': 'OR' },
        '100': { '0000000': 'XOR' }, '001': { '0000000': 'SLL' },
        '101': { '0000000': 'SRL', '0100000': 'SRA' },
        '010': { '0000000': 'SLT' }, '011': { '0000000': 'SLTU' },
      };
      const mn = rMap[funct3]?.[funct7];
      if (!mn) return { mnemonic: '?', assembly: `??? ${rdN}, ${rs1N}, ${rs2N}`, valid: false };
      return { mnemonic: mn, assembly: `${mn} ${rdN}, ${rs1N}, ${rs2N}`, valid: true };
    }

    case 'I-type': {
      const funct3 = pad('funct3', 3);
      const opcode = pad('opcode', 7);
      const imm12  = pad('imm', 12);
      const immVal = signExtend(parseInt(imm12, 2), 12);

      if (opcode === '0010011') {
        const funct7 = imm12.slice(0, 7);
        const iMap = {
          '000': 'ADDI', '111': 'ANDI', '110': 'ORI', '100': 'XORI',
          '010': 'SLTI', '011': 'SLTIU',
          '001': 'SLLI',
          '101': funct7 === '0100000' ? 'SRAI' : 'SRLI',
        };
        const mn = iMap[funct3];
        if (!mn) return { mnemonic: '?', assembly: `??? ${rdN}, ${rs1N}, ${immVal}`, valid: false };
        return { mnemonic: mn, assembly: `${mn} ${rdN}, ${rs1N}, ${immVal}`, valid: true };
      }
      if (opcode === '0000011') {
        const lMap = { '010': 'LW', '001': 'LH', '000': 'LB', '101': 'LHU', '100': 'LBU' };
        const mn = lMap[funct3];
        if (!mn) return { mnemonic: '?', assembly: `??? ${rdN}, ${immVal}(${rs1N})`, valid: false };
        return { mnemonic: mn, assembly: `${mn} ${rdN}, ${immVal}(${rs1N})`, valid: true };
      }
      if (opcode === '1100111') {
        return { mnemonic: 'JALR', assembly: `JALR ${rdN}, ${rs1N}, ${immVal}`, valid: true };
      }
      return { mnemonic: '?', assembly: `I-OP ${rdN}, ${rs1N}, ${immVal}`, valid: false };
    }

    case 'S-type': {
      const funct3 = pad('funct3', 3);
      const immHi  = pad('imm_hi', 7);
      const immLo  = pad('imm_lo', 5);
      const immVal = signExtend(parseInt(immHi + immLo, 2), 12);
      const sMap   = { '010': 'SW', '001': 'SH', '000': 'SB' };
      const mn     = sMap[funct3];
      if (!mn) return { mnemonic: '?', assembly: `??? ${rs2N}, ${immVal}(${rs1N})`, valid: false };
      return { mnemonic: mn, assembly: `${mn} ${rs2N}, ${immVal}(${rs1N})`, valid: true };
    }

    case 'B-type': {
      const funct3 = pad('funct3', 3);
      const b12 = pad('b_imm12', 1);
      const b10 = pad('b_imm10', 6);
      const b4  = pad('b_imm4', 4);
      const b11 = pad('b_imm11', 1);
      const immBin = b12 + b11 + b10 + b4 + '0';
      const immVal = signExtend(parseInt(immBin, 2), 13);
      const bMap = { '000':'BEQ','001':'BNE','100':'BLT','101':'BGE','110':'BLTU','111':'BGEU' };
      const mn = bMap[funct3];
      if (!mn) return { mnemonic: '?', assembly: `??? ${rs1N}, ${rs2N}, ${immVal}`, valid: false };
      return { mnemonic: mn, assembly: `${mn} ${rs1N}, ${rs2N}, ${immVal}`, valid: true };
    }

    case 'U-type': {
      const opcode = pad('opcode', 7);
      const imm20  = pad('imm_u', 20);
      const immVal = parseInt(imm20, 2);
      const mn = opcode === '0110111' ? 'LUI' : opcode === '0010111' ? 'AUIPC' : '?';
      const hexImm = immVal.toString(16).toUpperCase();
      return { mnemonic: mn, assembly: `${mn} ${rdN}, 0x${hexImm}`, valid: mn !== '?' };
    }

    case 'J-type': {
      const j20 = pad('j_imm20', 1);
      const j10 = pad('j_imm10', 10);
      const j11 = pad('j_imm11', 1);
      const j19 = pad('j_imm19', 8);
      const immBin = j20 + j19 + j11 + j10 + '0';
      const immVal = signExtend(parseInt(immBin, 2), 21);
      return { mnemonic: 'JAL', assembly: `JAL ${rdN}, ${immVal}`, valid: true };
    }

    default:
      return { mnemonic: '?', assembly: '???', valid: false };
  }
}

export default function AssemblyView({ instrType, values }) {
  const { mnemonic, assembly, valid } = buildMnemonic(instrType, values);

  return (
    <div
      className="rounded-xl p-4 flex items-center justify-between gap-4"
      style={{
        background: valid ? 'rgba(52,211,153,0.04)' : 'rgba(248,113,113,0.04)',
        border: `1px solid ${valid ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.15)'}`,
      }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-widest uppercase" style={{ color: '#4a5568' }}>Assembly</span>
          {!valid && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              unknown
            </span>
          )}
        </div>
        <code
          className="text-base font-bold"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: valid ? '#34d399' : '#f87171',
          }}
        >
          {assembly}
        </code>
      </div>
      <div
        className="text-xl font-black tracking-widest px-3 py-1 rounded flex-shrink-0"
        style={{
          fontFamily: "'Space Mono', monospace",
          color: valid ? '#34d399' : '#f87171',
          background: valid ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
          border: `1px solid ${valid ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.25)'}`,
          textShadow: valid ? '0 0 12px rgba(52,211,153,0.5)' : 'none',
        }}
      >
        {mnemonic}
      </div>
    </div>
  );
}
