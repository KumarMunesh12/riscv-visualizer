# RISC-V Instruction Encoding Visualizer

A professional, interactive tool that visually represents 32-bit RISC-V instruction encoding formats. Built with React + Vite + Tailwind CSS.

---

## What is RISC-V Instruction Encoding?

RISC-V is an open-source ISA (Instruction Set Architecture). Every instruction is exactly **32 bits wide** and divided into named **fields** that the CPU hardware decodes:

### Instruction Formats

#### R-type (Register–Register)
Used for arithmetic/logical operations (ADD, SUB, AND, OR, etc.)

```
 31      25 24   20 19   15 14  12 11   7 6      0
┌─────────┬───────┬───────┬──────┬───────┬────────┐
│  funct7 │  rs2  │  rs1  │funct3│  rd   │ opcode │
│  7 bits │ 5 bits│ 5 bits│3 bits│ 5 bits│ 7 bits │
└─────────┴───────┴───────┴──────┴───────┴────────┘
```

#### I-type (Immediate)
Used for immediate arithmetic, loads, JALR

```
 31          20 19   15 14  12 11   7 6      0
┌─────────────┬───────┬──────┬───────┬────────┐
│  imm[11:0]  │  rs1  │funct3│  rd   │ opcode │
│   12 bits   │ 5 bits│3 bits│ 5 bits│ 7 bits │
└─────────────┴───────┴──────┴───────┴────────┘
```

#### S-type (Store)
Used for store instructions (SW, SH, SB)

```
 31      25 24   20 19   15 14  12 11   7 6      0
┌─────────┬───────┬───────┬──────┬───────┬────────┐
│imm[11:5]│  rs2  │  rs1  │funct3│imm[4:0]│opcode │
│  7 bits │ 5 bits│ 5 bits│3 bits│ 5 bits│ 7 bits │
└─────────┴───────┴───────┴──────┴───────┴────────┘
```

### Field Descriptions

| Field   | Bits | Description                                         |
|---------|------|-----------------------------------------------------|
| opcode  | 7    | Identifies the instruction class                    |
| rd      | 5    | Destination register (x0–x31)                       |
| funct3  | 3    | Further differentiates instructions within a class  |
| rs1     | 5    | First source register (x0–x31)                      |
| rs2     | 5    | Second source register (R/S-type only)              |
| funct7  | 7    | Further differentiates (R-type only)                |
| imm     | var  | Immediate value (I/S/B/U/J-type)                    |

---

## How the Tool Works

1. **Select instruction format** — R-type, I-type, or S-type
2. **Enter field values** — In binary (0/1), decimal, or register name
3. **Real-time visualization** — The 32-bit layout updates instantly
4. **Hover over segments** — Tooltips explain each field's role
5. **Copy output** — One-click copy for binary, hex, or decimal

### Presets
Click any instruction mnemonic (ADD, SUB, ADDI, LW, SW, etc.) to auto-fill the opcode/funct3/funct7 fields — then just set the register values.

---

## Setup & Running

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install

```bash
# Clone / unzip the project
cd riscv-visualizer

# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
riscv-visualizer/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Root component, state management
│   ├── encoding.js       # ISA constants, bit logic, validation
│   ├── index.css         # Global styles + Tailwind
│   └── components/
│       ├── InputForm.jsx     # Per-field inputs (bin/dec/reg modes)
│       ├── EncodingBar.jsx   # 32-bit visual bar with hover
│       └── OutputDisplay.jsx # Binary/hex/dec output + table
```

---

## Tech Stack

- **React 18** — Hooks-based, no class components
- **Vite 5** — Fast HMR dev server
- **Tailwind CSS 3** — Utility-first styling
- **JetBrains Mono / Space Mono** — Monospace fonts for ISA legibility

---

## Features

- ✅ R-type, I-type, S-type instruction formats
- ✅ Binary / decimal / register-name input modes
- ✅ Real-time 32-bit visual encoding bar
- ✅ Field-level bit validation
- ✅ Hover tooltips on each field
- ✅ Instruction presets (ADD, SUB, ADDI, LW, SW, ...)
- ✅ One-click copy: binary, hex, decimal
- ✅ Field breakdown table with individual field values
- ✅ Color-coded fields across all views
- ✅ Reset button

---

## References

- [RISC-V Unprivileged ISA Specification](https://github.com/riscv/riscv-isa-manual)
- [RISC-V International](https://riscv.org)
