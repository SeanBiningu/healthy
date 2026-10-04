import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FiUser, FiMail, FiMapPin, FiEdit2, FiCheck,
  FiX, FiCamera, FiCheckCircle, FiLock,
} from 'react-icons/fi';

// ── Editable field row ────────────────────────────────────────────────────────
function EditableRow({ icon: Icon, label, value, field, onSave, readOnly = false }) {
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(value || '');
  const [saved,   setSaved]     = useState(false);
  const inputRef                = useRef(null);

  const start = () => {
    if (readOnly) return;
    setDraft(value || '');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value || '');
  };

  const save = () => {
    if (draft.trim() === '') return;
    onSave(field, draft.trim());
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return (
    <div
      className={[
        'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors group',
        editing   ? 'bg-green-50 ring-1 ring-green-200'
        : readOnly ? 'cursor-default'
        : 'hover:bg-gray-50 cursor-pointer',
      ].join(' ')}
      onClick={!editing && !readOnly ? start : undefined}
    >
      {/* Icon badge */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        editing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
      }`}>
        <Icon size={15} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none"
          />
        ) : (
          <p className="text-sm font-medium text-gray-900 truncate">{value || '—'}</p>
        )}
      </div>

      {/* Right actions */}
      <div className="shrink-0 flex items-center gap-1">
        {editing ? (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); save(); }}
              className="w-7 h-7 rounded-lg bg-green-800 text-white flex items-center justify-center hover:bg-green-900 transition-colors"
              title="Save"
            >
              <FiCheck size={13} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); cancel(); }}
              className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Cancel"
            >
              <FiX size={13} />
            </button>
          </>
        ) : readOnly ? (
          <FiLock size={13} className="text-gray-300" />
        ) : saved ? (
          <FiCheckCircle size={14} className="text-green-600" />
        ) : (
          <FiEdit2
            size={13}
            className="text-gray-300 group-hover:text-green-700 transition-colors"
          />
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [toast,       setToast]       = useState(null);  // { msg, type }
  const [avatarColor, setAvatarColor] = useState('#0d2d1e');

  const colors = ['#0d2d1e', '#1d4ed8', '#7c3aed', '#b45309', '#be123c', '#0f766e'];

  const handleSave = (field, value) => {
    updateUser({ [field]: value });
    showToast(`${fieldLabel(field)} updated`);
  };

  const fieldLabel = (f) => ({
    name: 'Full name', city: 'City',
  }[f] || f);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const initial    = user?.name?.[0]?.toUpperCase() || 'U';
  const memberDate = new Date(user?.createdAt || Date.now()).toLocaleDateString();

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* ── Header ── */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* ── Profile card ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">

        {/* Avatar + info */}
        <div className="flex items-center gap-5 mb-7">
          {/* Avatar with colour picker */}
          <div className="relative group">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white transition-all"
              style={{ backgroundColor: avatarColor }}
            >
              {initial}
            </div>
            {/* Camera overlay */}
            <button
              className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Change avatar colour"
              onClick={() => {
                // cycle colours on click
                const idx = colors.indexOf(avatarColor);
                setAvatarColor(colors[(idx + 1) % colors.length]);
                showToast('Avatar colour updated');
              }}
            >
              <FiCamera size={16} className="text-white" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-400 capitalize">{user?.role} Account</p>
            <p className="text-xs text-gray-300 mt-0.5">Member since {memberDate}</p>
          </div>

          {/* Colour swatches */}
          <div className="ml-auto flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { setAvatarColor(c); showToast('Avatar colour updated'); }}
                className={`w-5 h-5 rounded-full transition-all hover:scale-110 ${
                  avatarColor === c ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-1">
          <EditableRow
            icon={FiUser}
            label="Full Name"
            value={user?.name}
            field="name"
            onSave={handleSave}
          />
          <EditableRow
            icon={FiMail}
            label="Email Address"
            value={user?.email}
            field="email"
            onSave={handleSave}
            readOnly
          />
          <EditableRow
            icon={FiMapPin}
            label="City"
            value={user?.city || 'Harare'}
            field="city"
            onSave={handleSave}
          />
          <EditableRow
            icon={FiUser}
            label="Role"
            value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
            field="role"
            onSave={handleSave}
            readOnly
          />
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-300 mt-5 text-center">
          Click any editable field to update it · Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-400 text-[10px]">Enter</kbd> to save or <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-400 text-[10px]">Esc</kbd> to cancel
        </p>
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 flex items-center gap-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg z-50"
          style={{ animation: 'slideUp 0.2s ease both' }}
        >
          <FiCheckCircle size={15} className="text-green-400 shrink-0" />
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
