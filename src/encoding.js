// RISC-V Instruction Format Definitions

export const FIELD_COLORS = {
  funct7:  { bg: 'rgba(255,170,32,0.18)',  border: '#ffaa20', text: '#ffaa20', glow: 'glow-yellow', hex: '#ffaa20' },
  rs2:     { bg: 'rgba(232,48,48,0.18)',   border: '#e83030', text: '#e83030', glow: 'glow-pink',   hex: '#e83030' },
  rs1:     { bg: 'rgba(255,106,0,0.18)',   border: '#ff6a00', text: '#ff6a00', glow: 'glow-blue',   hex: '#ff6a00' },
  funct3:  { bg: 'rgba(255,204,0,0.18)',   border: '#ffcc00', text: '#ffcc00', glow: 'glow-green',  hex: '#ffcc00' },
  rd:      { bg: 'rgba(255,140,0,0.18)',   border: '#ff8c00', text: '#ff8c00', glow: 'glow-purple', hex: '#ff8c00' },
  opcode:  { bg: 'rgba(255,69,0,0.18)',    border: '#ff4500', text: '#ff4500', glow: 'glow-orange', hex: '#ff4500' },
  imm:     { bg: 'rgba(255,112,67,0.18)',  border: '#ff7043', text: '#ff7043', glow: 'glow-red',    hex: '#ff7043' },
  imm_hi:  { bg: 'rgba(255,112,67,0.18)',  border: '#ff7043', text: '#ff7043', glow: 'glow-red',    hex: '#ff7043' },
  imm_lo:  { bg: 'rgba(255,112,67,0.22)',  border: '#ff9a80', text: '#ff9a80', glow: 'glow-red',    hex: '#ff9a80' },
  b_imm12: { bg: 'rgba(255,112,67,0.18)',  border: '#ff7043', text: '#ff7043', glow: 'glow-red',    hex: '#ff7043' },
  b_imm10: { bg: 'rgba(255,112,67,0.22)',  border: '#ff9a80', text: '#ff9a80', glow: 'glow-red',    hex: '#ff9a80' },
  b_imm4:  { bg: 'rgba(255,112,67,0.18)',  border: '#ff7043', text: '#ff7043', glow: 'glow-red',    hex: '#ff7043' },
  b_imm11: { bg: 'rgba(255,112,67,0.22)',  border: '#ff9a80', text: '#ff9a80', glow: 'glow-red',    hex: '#ff9a80' },
  imm_u:   { bg: 'rgba(255,112,67,0.18)',  border: '#ff7043', text: '#ff7043', glow: 'glow-red',    hex: '#ff7043' },
  j_imm20: { bg: 'rgba(255,112,67,0.18)',  border: '#ff7043', text: '#ff7043', glow: 'glow-red',    hex: '#ff7043' },
  j_imm10: { bg: 'rgba(255,112,67,0.22)',  border: '#ff9a80', text: '#ff9a80', glow: 'glow-red',    hex: '#ff9a80' },
  j_imm11: { bg: 'rgba(255,112,67,0.18)',  border: '#ff7043', text: '#ff7043', glow: 'glow-red',    hex: '#ff7043' },
  j_imm19: { bg: 'rgba(255,112,67,0.22)',  border: '#ff9a80', text: '#ff9a80', glow: 'glow-red',    hex: '#ff9a80' },
};

export const TOOLTIPS = {
  opcode:  'opcode [6:0] — 7 bits identifying the instruction class (e.g., 0110011 = OP)',
  rd:      'rd [11:7] — 5-bit destination register (x0–x31)',
  funct3:  'funct3 [14:12] — 3-bit function selector (differentiates instructions within a class)',
  rs1:     'rs1 [19:15] — 5-bit first source register (x0–x31)',
  rs2:     'rs2 [24:20] — 5-bit second source register (x0–x31)',
  funct7:  'funct7 [31:25] — 7-bit function extension (e.g., 0000000=ADD, 0100000=SUB)',
  imm:     'imm[11:0] — 12-bit sign-extended immediate value',
  imm_hi:  'imm[11:5] — Upper 7 bits of S-type immediate',
  imm_lo:  'imm[4:0] — Lower 5 bits of S-type immediate',
  b_imm12: 'imm[12] — Branch offset bit 12 (sign bit)',
  b_imm10: 'imm[10:5] — Branch offset bits 10–5',
  b_imm4:  'imm[4:1] — Branch offset bits 4–1',
  b_imm11: 'imm[11] — Branch offset bit 11',
  imm_u:   'imm[31:12] — Upper 20-bit immediate (shifted left 12 on use)',
  j_imm20: 'imm[20] — Jump offset bit 20 (sign bit)',
  j_imm10: 'imm[10:1] — Jump offset bits 10–1',
  j_imm11: 'imm[11] — Jump offset bit 11',
  j_imm19: 'imm[19:12] — Jump offset bits 19–12',
};

// Instruction type definitions: fields in MSB→LSB order
export const INSTRUCTION_TYPES = {
  'R-type': {
    label: 'R-type',
    description: 'Register-Register Operations (ADD, SUB, AND, OR, XOR, SLL, SRL, SRA, SLT, SLTU)',
    fields: [
      { key: 'funct7', bits: 7,  msb: 31, lsb: 25, label: 'funct7' },
      { key: 'rs2',    bits: 5,  msb: 24, lsb: 20, label: 'rs2' },
      { key: 'rs1',    bits: 5,  msb: 19, lsb: 15, label: 'rs1' },
      { key: 'funct3', bits: 3,  msb: 14, lsb: 12, label: 'funct3' },
      { key: 'rd',     bits: 5,  msb: 11, lsb: 7,  label: 'rd' },
      { key: 'opcode', bits: 7,  msb: 6,  lsb: 0,  label: 'opcode' },
    ],
    defaults: { funct7: '0000000', rs2: '00000', rs1: '00000', funct3: '000', rd: '00000', opcode: '0110011' },
    presets: [
      { name: 'ADD',  values: { funct7: '0000000', funct3: '000', opcode: '0110011' } },
      { name: 'SUB',  values: { funct7: '0100000', funct3: '000', opcode: '0110011' } },
      { name: 'AND',  values: { funct7: '0000000', funct3: '111', opcode: '0110011' } },
      { name: 'OR',   values: { funct7: '0000000', funct3: '110', opcode: '0110011' } },
      { name: 'XOR',  values: { funct7: '0000000', funct3: '100', opcode: '0110011' } },
      { name: 'SLL',  values: { funct7: '0000000', funct3: '001', opcode: '0110011' } },
      { name: 'SRL',  values: { funct7: '0000000', funct3: '101', opcode: '0110011' } },
      { name: 'SRA',  values: { funct7: '0100000', funct3: '101', opcode: '0110011' } },
    ],
  },
  'I-type': {
    label: 'I-type',
    description: 'Immediate Operations (ADDI, ANDI, ORI, XORI, SLTI, Loads, JALR)',
    fields: [
      { key: 'imm',    bits: 12, msb: 31, lsb: 20, label: 'imm[11:0]' },
      { key: 'rs1',    bits: 5,  msb: 19, lsb: 15, label: 'rs1' },
      { key: 'funct3', bits: 3,  msb: 14, lsb: 12, label: 'funct3' },
      { key: 'rd',     bits: 5,  msb: 11, lsb: 7,  label: 'rd' },
      { key: 'opcode', bits: 7,  msb: 6,  lsb: 0,  label: 'opcode' },
    ],
    defaults: { imm: '000000000000', rs1: '00000', funct3: '000', rd: '00000', opcode: '0010011' },
    presets: [
      { name: 'ADDI', values: { funct3: '000', opcode: '0010011' } },
      { name: 'ANDI', values: { funct3: '111', opcode: '0010011' } },
      { name: 'ORI',  values: { funct3: '110', opcode: '0010011' } },
      { name: 'XORI', values: { funct3: '100', opcode: '0010011' } },
      { name: 'LW',   values: { funct3: '010', opcode: '0000011' } },
      { name: 'LB',   values: { funct3: '000', opcode: '0000011' } },
      { name: 'JALR', values: { funct3: '000', opcode: '1100111' } },
    ],
  },
  'S-type': {
    label: 'S-type',
    description: 'Store Instructions (SW, SH, SB)',
    fields: [
      { key: 'imm_hi', bits: 7,  msb: 31, lsb: 25, label: 'imm[11:5]' },
      { key: 'rs2',    bits: 5,  msb: 24, lsb: 20, label: 'rs2' },
      { key: 'rs1',    bits: 5,  msb: 19, lsb: 15, label: 'rs1' },
      { key: 'funct3', bits: 3,  msb: 14, lsb: 12, label: 'funct3' },
      { key: 'imm_lo', bits: 5,  msb: 11, lsb: 7,  label: 'imm[4:0]' },
      { key: 'opcode', bits: 7,  msb: 6,  lsb: 0,  label: 'opcode' },
    ],
    defaults: { imm_hi: '0000000', rs2: '00000', rs1: '00000', funct3: '010', imm_lo: '00000', opcode: '0100011' },
    presets: [
      { name: 'SW', values: { funct3: '010', opcode: '0100011' } },
      { name: 'SH', values: { funct3: '001', opcode: '0100011' } },
      { name: 'SB', values: { funct3: '000', opcode: '0100011' } },
    ],
  },
  'B-type': {
    label: 'B-type',
    description: 'Branch Instructions (BEQ, BNE, BLT, BGE, BLTU, BGEU) — PC-relative offset',
    fields: [
      { key: 'b_imm12', bits: 1,  msb: 31, lsb: 31, label: 'imm[12]' },
      { key: 'b_imm10', bits: 6,  msb: 30, lsb: 25, label: 'imm[10:5]' },
      { key: 'rs2',     bits: 5,  msb: 24, lsb: 20, label: 'rs2' },
      { key: 'rs1',     bits: 5,  msb: 19, lsb: 15, label: 'rs1' },
      { key: 'funct3',  bits: 3,  msb: 14, lsb: 12, label: 'funct3' },
      { key: 'b_imm4',  bits: 4,  msb: 11, lsb: 8,  label: 'imm[4:1]' },
      { key: 'b_imm11', bits: 1,  msb: 7,  lsb: 7,  label: 'imm[11]' },
      { key: 'opcode',  bits: 7,  msb: 6,  lsb: 0,  label: 'opcode' },
    ],
    defaults: { b_imm12: '0', b_imm10: '000000', rs2: '00000', rs1: '00000', funct3: '000', b_imm4: '0000', b_imm11: '0', opcode: '1100011' },
    presets: [
      { name: 'BEQ',  values: { funct3: '000', opcode: '1100011' } },
      { name: 'BNE',  values: { funct3: '001', opcode: '1100011' } },
      { name: 'BLT',  values: { funct3: '100', opcode: '1100011' } },
      { name: 'BGE',  values: { funct3: '101', opcode: '1100011' } },
      { name: 'BLTU', values: { funct3: '110', opcode: '1100011' } },
      { name: 'BGEU', values: { funct3: '111', opcode: '1100011' } },
    ],
  },
  'U-type': {
    label: 'U-type',
    description: 'Upper Immediate (LUI, AUIPC) — loads 20-bit immediate into upper 20 bits of register',
    fields: [
      { key: 'imm_u',  bits: 20, msb: 31, lsb: 12, label: 'imm[31:12]' },
      { key: 'rd',     bits: 5,  msb: 11, lsb: 7,  label: 'rd' },
      { key: 'opcode', bits: 7,  msb: 6,  lsb: 0,  label: 'opcode' },
    ],
    defaults: { imm_u: '00000000000000000000', rd: '00000', opcode: '0110111' },
    presets: [
      { name: 'LUI',   values: { opcode: '0110111' } },
      { name: 'AUIPC', values: { opcode: '0010111' } },
    ],
  },
  'J-type': {
    label: 'J-type',
    description: 'Jump (JAL) — PC-relative jump with 21-bit offset, bits scrambled like B-type',
    fields: [
      { key: 'j_imm20', bits: 1,  msb: 31, lsb: 31, label: 'imm[20]' },
      { key: 'j_imm10', bits: 10, msb: 30, lsb: 21, label: 'imm[10:1]' },
      { key: 'j_imm11', bits: 1,  msb: 20, lsb: 20, label: 'imm[11]' },
      { key: 'j_imm19', bits: 8,  msb: 19, lsb: 12, label: 'imm[19:12]' },
      { key: 'rd',      bits: 5,  msb: 11, lsb: 7,  label: 'rd' },
      { key: 'opcode',  bits: 7,  msb: 6,  lsb: 0,  label: 'opcode' },
    ],
    defaults: { j_imm20: '0', j_imm10: '0000000000', j_imm11: '0', j_imm19: '00000000', rd: '00000', opcode: '1101111' },
    presets: [
      { name: 'JAL', values: { opcode: '1101111' } },
    ],
  },
};

// Validate a binary string value fits the given bit count
export function validateField(value, bits) {
  if (!/^[01]*$/.test(value)) return { valid: false, msg: 'Only 0 and 1 allowed' };
  if (value.length > bits) return { valid: false, msg: `Max ${bits} bits` };
  return { valid: true, msg: '' };
}

// Pad a binary string to the left with zeros
export function padBinary(value, bits) {
  return value.padStart(bits, '0');
}

// Build 32-bit binary string from field values (MSB→LSB order per format)
export function buildInstruction(fields, values) {
  return fields.map(f => padBinary(values[f.key] || '', f.bits)).join('');
}

// Convert binary string to hex
export function binToHex(bin) {
  if (bin.length !== 32) return '????????';
  const num = parseInt(bin, 2);
  return num.toString(16).toUpperCase().padStart(8, '0');
}

// Convert decimal to binary with bit width
export function decToBin(dec, bits) {
  const num = parseInt(dec);
  if (isNaN(num)) return '0'.repeat(bits);
  const bin = (num >>> 0).toString(2);
  return bin.slice(-bits).padStart(bits, '0');
}

// Convert binary to decimal (unsigned)
export function binToDec(bin) {
  return parseInt(bin, 2);
}

// Convert binary to signed decimal (two's complement)
export function binToSignedDec(bin, bits) {
  const unsigned = parseInt(bin, 2);
  if (bin[0] === '1') return unsigned - Math.pow(2, bits);
  return unsigned;
}

// Register name lookup (ABI names)
export const REG_NAMES = [
  'x0/zero','x1/ra','x2/sp','x3/gp','x4/tp',
  'x5/t0','x6/t1','x7/t2','x8/s0','x9/s1',
  'x10/a0','x11/a1','x12/a2','x13/a3','x14/a4','x15/a5',
  'x16/a6','x17/a7','x18/s2','x19/s3','x20/s4','x21/s5',
  'x22/s6','x23/s7','x24/s8','x25/s9','x26/s10','x27/s11',
  'x28/t3','x29/t4','x30/t5','x31/t6',
];

export function regName(idx) {
  return REG_NAMES[idx] ? REG_NAMES[idx].split('/')[1] || `x${idx}` : `x${idx}`;
}

// ─── Hex / Binary Decoder ──────────────────────────────────────────────────

/**
 * Decode a 32-bit binary string into field values + detected type.
 * Returns { type, values, fields, mnemonic, assembly, error }
 */
export function decodeInstruction(bin32) {
  if (bin32.length !== 32 || !/^[01]+$/.test(bin32)) {
    return { error: 'Need exactly 32 binary digits' };
  }

  // Extract bits [msb:lsb] from a 32-bit string (MSB is index 0 in string = bit 31)
  const bits = (msb, lsb) => bin32.slice(31 - msb, 32 - lsb);

  const opcode  = bits(6, 0);
  const funct3  = bits(14, 12);
  const funct7  = bits(31, 25);
  const rd      = parseInt(bits(11, 7), 2);
  const rs1     = parseInt(bits(19, 15), 2);
  const rs2     = parseInt(bits(24, 20), 2);

  const rdName  = regName(rd);
  const rs1Name = regName(rs1);
  const rs2Name = regName(rs2);

  // Sign-extend helper
  const signExtend = (val, bits) => {
    const msb = 1 << (bits - 1);
    return (val & (msb - 1)) - (val & msb);
  };

  switch (opcode) {
    case '0110011': { // R-type OP
      const mnemonics = {
        '000': { '0000000': 'ADD', '0100000': 'SUB' },
        '111': { '0000000': 'AND' },
        '110': { '0000000': 'OR'  },
        '100': { '0000000': 'XOR' },
        '001': { '0000000': 'SLL' },
        '101': { '0000000': 'SRL', '0100000': 'SRA' },
        '010': { '0000000': 'SLT' },
        '011': { '0000000': 'SLTU'},
      };
      const mnemonic = mnemonics[funct3]?.[funct7] || 'R-OP?';
      return {
        type: 'R-type',
        mnemonic,
        assembly: `${mnemonic} ${rdName}, ${rs1Name}, ${rs2Name}`,
        description: `${rdName} = ${rs1Name} ${opSymbol(mnemonic)} ${rs2Name}`,
        values: { funct7, rs2: bits(24,20), rs1: bits(19,15), funct3, rd: bits(11,7), opcode },
      };
    }

    case '0010011': { // I-type immediate ALU
      const imm12 = bits(31, 20);
      const immVal = signExtend(parseInt(imm12, 2), 12);
      const mnemonics = {
        '000': 'ADDI', '111': 'ANDI', '110': 'ORI', '100': 'XORI',
        '010': 'SLTI', '011': 'SLTIU', '001': 'SLLI',
        '101': funct7 === '0100000' ? 'SRAI' : 'SRLI',
      };
      const mnemonic = mnemonics[funct3] || 'I-ALU?';
      return {
        type: 'I-type',
        mnemonic,
        assembly: `${mnemonic} ${rdName}, ${rs1Name}, ${immVal}`,
        description: `${rdName} = ${rs1Name} ${opSymbol(mnemonic)} ${immVal}`,
        values: { imm: imm12, rs1: bits(19,15), funct3, rd: bits(11,7), opcode },
      };
    }

    case '0000011': { // I-type LOAD
      const imm12 = bits(31, 20);
      const immVal = signExtend(parseInt(imm12, 2), 12);
      const loads = { '010': 'LW', '001': 'LH', '000': 'LB', '101': 'LHU', '100': 'LBU' };
      const mnemonic = loads[funct3] || 'LOAD?';
      return {
        type: 'I-type',
        mnemonic,
        assembly: `${mnemonic} ${rdName}, ${immVal}(${rs1Name})`,
        description: `${rdName} = mem[${rs1Name} + ${immVal}]`,
        values: { imm: imm12, rs1: bits(19,15), funct3, rd: bits(11,7), opcode },
      };
    }

    case '1100111': { // JALR
      const imm12 = bits(31, 20);
      const immVal = signExtend(parseInt(imm12, 2), 12);
      return {
        type: 'I-type',
        mnemonic: 'JALR',
        assembly: `JALR ${rdName}, ${rs1Name}, ${immVal}`,
        description: `${rdName} = PC+4; PC = ${rs1Name} + ${immVal}`,
        values: { imm: imm12, rs1: bits(19,15), funct3, rd: bits(11,7), opcode },
      };
    }

    case '0100011': { // S-type STORE
      const immHi = bits(31, 25);
      const immLo = bits(11, 7);
      const immVal = signExtend(parseInt(immHi + immLo, 2), 12);
      const stores = { '010': 'SW', '001': 'SH', '000': 'SB' };
      const mnemonic = stores[funct3] || 'STORE?';
      return {
        type: 'S-type',
        mnemonic,
        assembly: `${mnemonic} ${rs2Name}, ${immVal}(${rs1Name})`,
        description: `mem[${rs1Name} + ${immVal}] = ${rs2Name}`,
        values: { imm_hi: immHi, rs2: bits(24,20), rs1: bits(19,15), funct3, imm_lo: immLo, opcode },
      };
    }

    case '1100011': { // B-type BRANCH
      const b12 = bits(31, 31);
      const b10 = bits(30, 25);
      const b4  = bits(11, 8);
      const b11 = bits(7, 7);
      const immBin = b12 + b11 + b10 + b4 + '0'; // bit 0 always 0
      const immVal = signExtend(parseInt(immBin, 2), 13);
      const branches = { '000':'BEQ','001':'BNE','100':'BLT','101':'BGE','110':'BLTU','111':'BGEU' };
      const mnemonic = branches[funct3] || 'BR?';
      return {
        type: 'B-type',
        mnemonic,
        assembly: `${mnemonic} ${rs1Name}, ${rs2Name}, ${immVal}`,
        description: `if (${rs1Name} ${branchCond(mnemonic)} ${rs2Name}) PC += ${immVal}`,
        values: { b_imm12: b12, b_imm10: b10, rs2: bits(24,20), rs1: bits(19,15), funct3, b_imm4: b4, b_imm11: b11, opcode },
      };
    }

    case '0110111': { // LUI
      const imm20 = bits(31, 12);
      return {
        type: 'U-type',
        mnemonic: 'LUI',
        assembly: `LUI ${rdName}, 0x${parseInt(imm20,2).toString(16).toUpperCase()}`,
        description: `${rdName} = 0x${parseInt(imm20,2).toString(16).toUpperCase()}000`,
        values: { imm_u: imm20, rd: bits(11,7), opcode },
      };
    }

    case '0010111': { // AUIPC
      const imm20 = bits(31, 12);
      return {
        type: 'U-type',
        mnemonic: 'AUIPC',
        assembly: `AUIPC ${rdName}, 0x${parseInt(imm20,2).toString(16).toUpperCase()}`,
        description: `${rdName} = PC + 0x${parseInt(imm20,2).toString(16).toUpperCase()}000`,
        values: { imm_u: imm20, rd: bits(11,7), opcode },
      };
    }

    case '1101111': { // JAL
      const j20 = bits(31, 31);
      const j10 = bits(30, 21);
      const j11 = bits(20, 20);
      const j19 = bits(19, 12);
      const immBin = j20 + j19 + j11 + j10 + '0';
      const immVal = signExtend(parseInt(immBin, 2), 21);
      return {
        type: 'J-type',
        mnemonic: 'JAL',
        assembly: `JAL ${rdName}, ${immVal}`,
        description: `${rdName} = PC+4; PC += ${immVal}`,
        values: { j_imm20: j20, j_imm10: j10, j_imm11: j11, j_imm19: j19, rd: bits(11,7), opcode },
      };
    }

    default:
      return {
        type: null,
        mnemonic: 'UNKNOWN',
        assembly: `??? (opcode=${opcode})`,
        description: 'Unrecognized opcode',
        values: {},
        error: `Unknown opcode: ${opcode} (0x${parseInt(opcode,2).toString(16)})`,
      };
  }
}

function opSymbol(m) {
  const map = { ADD:'+', SUB:'-', AND:'&', OR:'|', XOR:'^', SLL:'<<', SRL:'>>>', SRA:'>>', SLT:'<s', SLTU:'<u',
                ADDI:'+', ANDI:'&', ORI:'|', XORI:'^', SLLI:'<<', SRLI:'>>>', SRAI:'>>' };
  return map[m] || '?';
}

function branchCond(m) {
  const map = { BEQ:'==', BNE:'!=', BLT:'<s', BGE:'>=s', BLTU:'<u', BGEU:'>=u' };
  return map[m] || '?';
}
