import React from 'react';

// ── Button ─────────────────────────────────────────────────────────────────────
export function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, className = '', ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus-ring disabled:opacity-60 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    primary:   'bg-green-900 text-white hover:bg-green-950 active:bg-green-950',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
    outline:   'border border-green-800 text-green-800 hover:bg-green-50 active:bg-green-100',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    ghost:     'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────────
export function Input({ label, id, error, prefix, suffix, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-400 pointer-events-none">{prefix}</span>
        )}
        <input
          id={id}
          {...props}
          className={`w-full border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''} ${className}`}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-400 pointer-events-none">{suffix}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, id, error, className = '', children, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        {...props}
        className={`w-full border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all ${className}`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`card p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3.5 w-full" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3, lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="text-4xl mb-4 text-gray-300">{icon}</div>
      )}
      <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message || 'We could not load this content. Please try again.'}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">Try Again</Button>
      )}
    </div>
  );
}

// ── Disclaimer ────────────────────────────────────────────────────────────────
export function MedicalDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <p className="text-xs text-gray-400 leading-relaxed">
        For educational purposes only. Consult a qualified healthcare professional before making any medical decision.
      </p>
    );
  }
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
      <p className="font-semibold mb-1">Healthcare Information Notice</p>
      <p>
        Pathway provides general healthcare information and does not replace professional medical advice,
        diagnosis, or treatment. Always consult a qualified healthcare professional or pharmacist for medical decisions.
      </p>
    </div>
  );
}

// ── Emergency Notice ──────────────────────────────────────────────────────────
export function EmergencyNotice() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
      <p className="font-semibold mb-1">🚨 Medical Emergency?</p>
      <p>If you believe you are experiencing a medical emergency, seek immediate professional medical assistance. Do not rely on this platform.</p>
    </div>
  );
}

// ── Demo Notice ───────────────────────────────────────────────────────────────
export function DemoNotice() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
      <strong>Demo Mode:</strong> All pharmacy, medicine availability, and pricing information shown is sample data for development purposes only. It does not reflect real availability or pricing.
    </div>
  );
}
