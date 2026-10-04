import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { medicinesApi } from '../../services/api';
import { useDebounce } from '../../hooks/useAsync';
import { MedicineCard } from '../../components/Cards';
import { SkeletonList, EmptyState, ErrorState, DemoNotice } from '../../components/UI';
import { FiSearch, FiFilter } from 'react-icons/fi';

const POPULAR = ['Amoxicillin', 'Paracetamol', 'Ibuprofen', 'ORS', 'Metformin', 'Chloroquine'];

export default function FindMedicinePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setMedicines([]);
      setSearched(false);
      return;
    }
    setSearched(true);
    setLoading(true);
    setError('');
    medicinesApi.search({ q })
      .then((data) => setMedicines(data.medicines || []))
      .catch(() => setError("We couldn't search for medicines. Please try again."))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handlePopular = (term) => {
    setQuery(term);
    setSearchParams({ q: term });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <DemoNotice />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Medicine</h1>
      <p className="text-sm text-gray-500 mb-6">Search by name, generic name, or brand name</p>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchParams(e.target.value ? { q: e.target.value } : {});
          }}
          placeholder="Search medicines — e.g. Amoxicillin 500mg, Paracetamol..."
          className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent shadow-sm"
          autoFocus
        />
      </div>

      {/* Popular searches */}
      {!query && (
        <div className="mb-8">
          <p className="text-xs font-medium text-gray-500 mb-3">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((term) => (
              <button
                key={term}
                onClick={() => handlePopular(term)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-full text-gray-600 hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading && <SkeletonList count={4} />}

      {error && <ErrorState message={error} onRetry={() => setQuery(debouncedQuery)} />}

      {!loading && !error && searched && medicines.length === 0 && (
        <EmptyState
          icon="💊"
          title="No medicines found"
          description={`We couldn't find "${debouncedQuery}". Try searching using the generic or brand name.`}
          action={
            <button
              onClick={() => setQuery('')}
              className="text-sm text-green-800 font-medium hover:underline"
            >
              Clear search
            </button>
          }
        />
      )}

      {!loading && medicines.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-3">{medicines.length} result{medicines.length !== 1 ? 's' : ''} found</p>
          <div className="space-y-3">
            {medicines.map((m) => (
              <MedicineCard key={m.id} medicine={m} />
            ))}
          </div>
        </div>
      )}

      {/* Info box */}
      {!searched && (
        <div className="mt-8 card p-6 bg-green-50 border-green-100">
          <h3 className="font-semibold text-green-900 mb-2">How medicine search works</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Search by brand name, generic name, or strength</li>
            <li>• View which pharmacies have the medicine in stock</li>
            <li>• Check prices, delivery availability, and verified pharmacies</li>
            <li>• Request delivery directly from the platform</li>
          </ul>
        </div>
      )}
    </div>
  );
}
