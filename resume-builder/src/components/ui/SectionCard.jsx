import { useState } from 'react'
import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical } from 'lucide-react'

// ─── Collapsible section wrapper used in FormPanel ────────────────────────────
export function SectionCard({ title, icon, enabled, onToggle, defaultOpen = true, children, badge }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`form-section transition-opacity ${!enabled ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100 cursor-pointer select-none"
        onClick={() => setOpen(o => !o)}>
        <span className="text-base">{icon}</span>
        <span className="flex-1 text-sm font-semibold text-slate-700">{title}</span>
        {badge !== undefined && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{badge}</span>
        )}
        {onToggle && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onToggle() }}
            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
            title={enabled ? 'Hide section' : 'Show section'}
          >
            {enabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
        <span className="text-slate-400">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </div>
      {/* Content */}
      {open && <div className="p-4">{children}</div>}
    </div>
  )
}

// ─── Small card for individual entries (experience item, education item, etc.) ─
export function EntryCard({ children, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 relative group">
      <div className="flex gap-1 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={onMoveUp} disabled={!canMoveUp}
          className="p-1 rounded hover:bg-slate-200 text-slate-400 disabled:opacity-30 transition-colors">
          <ChevronUp size={13} />
        </button>
        <button type="button" onClick={onMoveDown} disabled={!canMoveDown}
          className="p-1 rounded hover:bg-slate-200 text-slate-400 disabled:opacity-30 transition-colors">
          <ChevronDown size={13} />
        </button>
        <button type="button" onClick={onRemove}
          className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
          ✕
        </button>
      </div>
      {children}
    </div>
  )
}

// ─── Form field primitives ────────────────────────────────────────────────────
export function Field({ label, children, hint }) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-input"
    />
  )
}

export function TextArea({ value, onChange, placeholder, rows = 4, hint }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="form-input resize-none"
    />
  )
}

export function Select({ value, onChange, options }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} className="form-input">
      {options.map(opt => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  )
}

export function AddButton({ onClick, label = 'Add Entry' }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full mt-1 py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500
                 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-150 font-medium">
      + {label}
    </button>
  )
}
