import React, { useState, useEffect } from 'react';
import { firstAidApi } from '../../services/api';
import { SkeletonList, ErrorState, EmergencyNotice } from '../../components/UI';
import { FiAlertCircle, FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';

const SEVERITY_COLORS = {
  minor: 'bg-green-100 text-green-700 border-green-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  emergency: 'bg-red-100 text-red-700 border-red-200',
};

export default function FirstAidPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    firstAidApi.getGuides()
      .then((data) => setGuides(data.guides || []))
      .catch(() => setError("We couldn't load first-aid guides. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (guide) => {
    try {
      const data = await firstAidApi.getGuideById(guide.id);
      setSelected(data.guide);
    } catch {
      setError("We couldn't load this guide. Please try again.");
    }
  };

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-800 mb-6 transition-colors"
        >
          <FiArrowLeft size={14} /> Back to guides
        </button>

        {selected.severity === 'emergency' && <EmergencyNotice />}

        <div className="card p-6 mt-4">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl">{selected.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{selected.title}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${SEVERITY_COLORS[selected.severity]}`}>
                  {selected.severity}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{selected.category}</p>
            </div>
          </div>

          {/* Steps */}
          <Section title="✅ What to do" expanded={expanded['steps']} onToggle={() => toggleSection('steps')}>
            <ol className="space-y-3">
              {selected.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-900 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="🚫 What NOT to do" expanded={expanded['donots']} onToggle={() => toggleSection('donots')}>
            <ul className="space-y-2">
              {selected.doNots.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-500 shrink-0">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="🏥 When to seek professional help" expanded={expanded['seek']} onToggle={() => toggleSection('seek')}>
            <ul className="space-y-2">
              {selected.seekHelpIf.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-amber-500 shrink-0">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          This guide provides general first-aid information only. For serious injuries or emergencies, seek immediate professional medical assistance.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <FiAlertCircle size={20} className="text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">First Aid Guide</h1>
          <p className="text-sm text-gray-500">Step-by-step guidance for common situations</p>
        </div>
      </div>

      <EmergencyNotice />

      <div className="mt-6">
        {loading && <SkeletonList count={4} lines={2} />}
        {error && <ErrorState message={error} />}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 gap-4">
            {guides.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSelect(g)}
                className={`card p-4 text-left hover:shadow-md transition-all border ${g.severity === 'emergency' ? 'border-red-200 hover:border-red-400' : 'hover:border-green-300'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{g.title}</p>
                    <p className="text-xs text-gray-500">{g.category}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${SEVERITY_COLORS[g.severity]}`}>
                  {g.severity}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, expanded, onToggle }) {
  return (
    <div className="mb-4 last:mb-0 border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {expanded ? <FiChevronUp size={16} className="text-gray-500" /> : <FiChevronDown size={16} className="text-gray-500" />}
      </button>
      {expanded && (
        <div className="px-4 py-4">{children}</div>
      )}
    </div>
  );
}
