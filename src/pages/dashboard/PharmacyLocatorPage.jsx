import React, { useState, useEffect, useRef } from 'react';
import { pharmaciesApi } from '../../services/api';
import { PharmacyCard } from '../../components/Cards';
import { SkeletonList, ErrorState, EmptyState, DemoNotice } from '../../components/UI';
import { FiMapPin, FiX, FiPhone, FiClock, FiTruck } from 'react-icons/fi';
import { VerificationBadge } from '../../components/StatusBadge';

// Leaflet map - loaded dynamically to avoid SSR issues
let MapComponent = null;

export default function PharmacyLocatorPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    pharmaciesApi.getAll()
      .then((data) => setPharmacies(data.pharmacies || []))
      .catch(() => setError("We couldn't load pharmacies. Please try again."))
      .finally(() => setLoading(false));

    // Dynamically load Leaflet
    import('react-leaflet').then((m) => {
      MapComponent = m;
      setMapReady(true);
    }).catch(() => {});
  }, []);

  const filtered = pharmacies.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const matchCity = !filterCity || p.city === filterCity;
    return matchSearch && matchCity;
  });

  const cities = [...new Set(pharmacies.map((p) => p.city))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-4"><DemoNotice /></div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Pharmacy Locator</h1>
      <p className="text-sm text-gray-500 mb-6">Find nearby pharmacies and healthcare facilities</p>

      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6">
        {/* Map — shown second on mobile, first column on lg */}
        <div className="lg:col-span-3 lg:order-2">
          <div className="card overflow-hidden" style={{ height: 'clamp(260px, 45vw, 500px)' }}>
            {mapReady && MapComponent ? (
              <LeafletMap
                pharmacies={filtered}
                selected={selected}
                onSelect={setSelected}
                MapComponent={MapComponent}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
                <div className="text-center">
                  <p className="text-4xl mb-3">🗺️</p>
                  <p className="text-sm">Loading map...</p>
                  <p className="text-xs mt-2 text-gray-300">Demo map with pharmacy markers</p>
                </div>
              </div>
            )}
          </div>

          {/* Selected pharmacy card */}
          {selected && (
            <div className="card p-5 mt-4 relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <FiMapPin size={18} className="text-green-800" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{selected.name}</h3>
                    <VerificationBadge verified={selected.verified} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.address}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600"><FiPhone size={14} /> {selected.phone}</p>
                <p className="flex items-center gap-2 text-gray-600"><FiClock size={14} /> {selected.openingHours}</p>
                {selected.deliveryAvailable && (
                  <p className="flex items-center gap-2 text-green-800"><FiTruck size={14} /> Delivery available within {selected.deliveryRadius}</p>
                )}
              </div>
              {selected.description && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">{selected.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar list — shown first on mobile */}
        <div className="lg:col-span-2 lg:order-1 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FiMapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search pharmacies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-800 sm:w-auto w-full"
            >
              <option value="">All cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading && <SkeletonList count={3} />}
          {error && <ErrorState message={error} />}

          {!loading && !error && filtered.length === 0 && (
            <EmptyState icon="🗺️" title="No pharmacies found" description="Try adjusting your search or filter." />
          )}

          {!loading && filtered.map((p) => (
            <PharmacyCard
              key={p.id}
              pharmacy={p}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Leaflet map component
function LeafletMap({ pharmacies, selected, onSelect, MapComponent }) {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = MapComponent;

  // Default center: Harare, Zimbabwe
  const center = [-17.8292, 31.0522];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pharmacies.map((p) => (
        p.lat && p.lng ? (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            eventHandlers={{ click: () => onSelect(p) }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{p.name}</p>
                <p className="text-gray-500">{p.address}</p>
                {p.verified && <p className="text-green-600 font-medium">✓ Verified</p>}
              </div>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  );
}
