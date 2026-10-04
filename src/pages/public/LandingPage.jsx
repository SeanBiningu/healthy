import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiSearch, FiShield, FiMapPin, FiHeart, FiTruck,
  FiCheckCircle, FiArrowRight, FiPackage,
  FiUsers, FiActivity, FiBox, FiUser, FiZap,
} from 'react-icons/fi';
import { DemoNotice } from '../../components/UI';

// ── Demo pharmacy results shown in hero ──────────────────────────────────────
const heroResults = [
  { name: 'HealthPlus Pharmacy', dist: '2.1 km · open until 8pm', price: '$4.M', status: 'in stock', statusColor: 'text-emerald-600 bg-emerald-50' },
  { name: 'Greenside Pharmacy',  dist: '3.2 km · Delivery available', price: '$4.26', status: 'in stock', statusColor: 'text-emerald-600 bg-emerald-50' },
  { name: 'City Centre Pharmacy', dist: '5.1 km',                    price: null,    status: 'Out of stock', statusColor: 'text-red-600 bg-red-50' },
];

// ── What Pathway does cards ──────────────────────────────────────────────────
const whatCards = [
  {
    title: 'Medicine locator',
    desc: 'Search any medicine and see real-time stock across nearby pharmacies, with the closest in-stock options surfaced first.',
    to: '/find-medicine',
  },
  {
    title: 'Authenticity verification',
    desc: "Scan a medicine code to confirm it\u2019s genuine, check its expiry, and see approved supplier information.",
    to: '/dashboard/verify',
  },
  {
    title: 'Medicine information',
    desc: 'Plain-language details on what a medicine is meant for, how to use it safely, and any warnings worth knowing.',
    to: '/dashboard/health-assistant',
  },
  {
    title: 'Delivery on request',
    desc: "Medicine delivery directly to your home, clinic, and hospital to fill gaps when getting to a pharmacy isn't viable.",
    to: '/dashboard/orders',
  },
];

// ── Supply-chain roles ───────────────────────────────────────────────────────
const roles = [
  { role: 'Patients',             desc: 'Search for medication, verify authenticity information, and request delivery.' },
  { role: 'Pharmacies',           desc: 'Keep stock and availability information current, and receive requests directly from nearby patients.' },
  { role: 'Medical suppliers',    desc: 'Provide verified medicines into the end-to-end supply chain, translate supply chaos.' },
  { role: "Delivery agents',      desc: 'Transport medication safely to patients who can't reach a pharmacy themselves." },
  { role: 'Healthcare providers', desc: 'Support and use recommendations and long-term patient availability for their practice.' },
];

// ── Interactive tabbed section ───────────────────────────────────────────────
const howSteps = [
  {
    n: '01',
    title: 'Search',
    desc: 'Type a medicine name or description. Pathway shows you which nearby pharmacies have it in stock right now.',
    icon: FiSearch,
    detail: 'Powered by real-time pharmacy inventory — no phone calls, no guessing.',
  },
  {
    n: '02',
    title: 'Check availability',
    desc: 'See distance, opening hours, price, and stock status across every participating pharmacy sorted nearest first.',
    icon: FiMapPin,
    detail: 'Filter by open now, delivery available, or lowest price.',
  },
  {
    n: '03',
    title: 'Verify authenticity',
    desc: 'Scan the code on the packaging. Pathway checks it against the verified supplier database in seconds.',
    icon: FiShield,
    detail: 'Flags expired, recalled, or counterfeit medicines before you take them.',
  },
  {
    n: '04',
    title: 'Get it delivered',
    desc: "Can't get to a pharmacy? Request home delivery directly through Pathway from a verified source.",
    icon: FiTruck,
    detail: 'Tracked from dispatch to door. Available from partnered delivery agents.',
  },
];

const whoRoles = [
  {
    role: 'Patients',
    icon: FiUser,
    desc: 'Search for medication, verify authenticity, and request home delivery — all from one place.',
    tags: ['Find medicine', 'Scan to verify', 'Home delivery'],
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    dot: 'bg-emerald-500',
  },
  {
    role: 'Pharmacies',
    icon: FiBox,
    desc: 'Keep your stock and availability visible to nearby patients. Receive and fulfil orders directly through the platform.',
    tags: ['Live stock updates', 'Receive orders', 'Verified listing'],
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    dot: 'bg-blue-500',
  },
  {
    role: 'Medical suppliers',
    icon: FiActivity,
    desc: 'Add verified medicines to the supply chain. Ensure downstream authenticity and reduce counterfeit entry points.',
    tags: ['Verified supply', 'Chain tracking', 'Batch records'],
    color: 'bg-violet-50 text-violet-700 border-violet-100',
    dot: 'bg-violet-500',
  },
  {
    role: 'Delivery agents',
    icon: FiTruck,
    desc: 'Transport medication safely to patients who cannot reach a pharmacy themselves. Managed dispatch and tracking.',
    tags: ['Dispatched orders', 'Route tracking', 'Safe handoff'],
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-500',
  },
  {
    role: 'Healthcare providers',
    icon: FiUsers,
    desc: 'Use Pathway recommendations and real-time availability data to support prescription decisions and patient access.',
    tags: ['Patient access', 'Medicine info', 'Availability data'],
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    dot: 'bg-rose-500',
  },
];

function InteractiveSection() {
  const [tab, setTab] = useState('how');
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();

  // When the URL hash changes, switch the correct tab and scroll to the section
  useEffect(() => {
    const hash = location.hash;
    if (hash === '#how-it-works') {
      setTab('how');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (hash === '#who-its-for') {
      setTab('who');
      setTimeout(() => {
        document.getElementById('who-its-for')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [location.hash]);

  return (
    <section id="how-it-works" className="border-t border-gray-100 py-16 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-12 border-b border-gray-200">
          {[
            { id: 'how', label: 'How it works' },
            { id: 'who', label: "Who it's for" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                'relative pb-3 px-1 mr-6 text-sm font-medium transition-colors duration-200 focus:outline-none',
                tab === id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600',
              ].join(' ')}
            >
              {label}
              {tab === id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-800 rounded-full"
                  style={{ transition: 'all 0.2s ease' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── HOW IT WORKS panel ── */}
        <div
          style={{
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            opacity: tab === 'how' ? 1 : 0,
            transform: tab === 'how' ? 'translateY(0)' : 'translateY(8px)',
            display: tab === 'how' ? 'block' : 'none',
          }}
        >
          {/* Step cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howSteps.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeStep === i;
              return (
                <button
                  key={s.n}
                  onClick={() => setActiveStep(i)}
                  className={[
                    'text-left rounded-xl border p-5 transition-all duration-200 focus:outline-none group',
                    isActive
                      ? 'border-green-800 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-green-400 hover:shadow-sm bg-white',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={[
                      'text-xs font-bold tracking-widest uppercase',
                      isActive ? 'text-green-800' : 'text-gray-400',
                    ].join(' ')}>{s.n}</span>
                    <span className={[
                      'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200',
                      isActive ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-green-100 group-hover:text-green-800',
                    ].join(' ')}>
                      <Icon size={14} />
                    </span>
                  </div>
                  <h3 className={[
                    'text-sm font-semibold mb-1.5 transition-colors duration-200',
                    isActive ? 'text-green-900' : 'text-gray-900',
                  ].join(' ')}>{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Active step detail callout */}
          <div
            key={activeStep}
            className="mt-6 border border-green-200 bg-green-50 rounded-xl px-6 py-4 flex items-start gap-4"
            style={{ animation: 'fadeSlideIn 0.25s ease both' }}
          >
            <span className="w-7 h-7 rounded-full bg-green-800 flex items-center justify-center shrink-0 mt-0.5">
              {React.createElement(howSteps[activeStep].icon, { size: 13, className: 'text-white' })}
            </span>
            <div>
              <p className="text-xs font-semibold text-green-900 mb-0.5">{howSteps[activeStep].title}</p>
              <p className="text-xs text-green-800 leading-relaxed">{howSteps[activeStep].detail}</p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mt-5">
            {howSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={[
                  'transition-all duration-200 rounded-full focus:outline-none',
                  i === activeStep ? 'w-5 h-2 bg-green-800' : 'w-2 h-2 bg-gray-200 hover:bg-gray-400',
                ].join(' ')}
              />
            ))}
          </div>
        </div>

        {/* ── WHO IT'S FOR panel ── */}
        <div
          id="who-its-for"
          style={{
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            opacity: tab === 'who' ? 1 : 0,
            transform: tab === 'who' ? 'translateY(0)' : 'translateY(8px)',
            display: tab === 'who' ? 'block' : 'none',
          }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whoRoles.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.role}
                  className="border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-sm transition-all duration-200 group cursor-default"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center border ${r.color}`}>
                      <Icon size={15} />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                      <p className="text-sm font-semibold text-gray-900">{r.role}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{r.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full border ${r.color}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Keyframe for detail callout animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const scopeItems = [
  'User registration and login',
  'Medicine search system',
  'Pharmacy stock tracking',
  'Pharmacy location mapping',
  'Medicine verification scanner',
  'Medicine ordering and delivery requests',
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Demo notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <DemoNotice />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 mb-5 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              A first layer for medicine access
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.15] mb-6">
              Find the medicine<br className="hidden sm:block" /> you need. Know it's<br className="hidden sm:block" /> genuine.
            </h1>

            <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-lg">
              Pathway connects you to verified pharmacies with real-time stock, checks medicine authenticity by scan, and arranges delivery when you can't get there yourself.
            </p>

            {/* Search bar */}
            <Link
              to="/find-medicine"
              className="flex items-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-green-800 hover:shadow-sm transition-all text-gray-400 mb-4 max-w-xl"
            >
              <FiSearch size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm">Search for a medicine, e.g. Amoxicillin 500 mg</span>
              <span className="ml-auto shrink-0">
                <span className="bg-green-900 text-white text-xs font-medium px-3 py-1.5 rounded-md">Search</span>
              </span>
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {['Verified pharmacies', 'Live stock status', 'Scan to verify', 'Delivery on request'].map((t) => (
                <span key={t} className="flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1">
                  <FiCheckCircle size={11} className="text-green-700" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — live results preview */}
          <div className="lg:pt-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Header bar */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Amoxicillin 500mg — 1 results · sort</span>
              </div>
              {/* Results */}
              <div className="divide-y divide-gray-100 bg-white">
                {heroResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3.5 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.dist}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {r.price && (
                        <span className="text-sm font-bold text-gray-900">{r.price}</span>
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.statusColor}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM SECTION ───────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-10">
              Getting medicine shouldn't<br className="hidden sm:block" /> be this hard
            </h2>

            <div className="space-y-7">
              {[
                {
                  title: 'Shortages and guesswork',
                  desc: "Patients move between pharmacies with no way to know in advance which one has their medicine in stock.",
                },
                {
                  title: 'Counterfeit and unsafe medication',
                  desc: "Fake or unsafe medicines enter the supply chain, and most patients have no way to check authenticity themselves.",
                },
                {
                  title: 'Limited options for those who can\'t travel',
                  desc: "Elderly patients, people with disabilities, and those in remote areas struggle to reach a pharmacy at all.",
                },
                {
                  title: 'No transparency on price or source',
                  desc: "Pricing, supply information, and supplier details are rarely, or at best difficult to find, on one pharmacy platform or the next.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-1 w-4 h-4 rounded-full bg-green-900 shrink-0 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="lg:pt-2">
            <p className="text-sm text-gray-500 leading-relaxed">
              Pathway fixes these problems by making pharmacy offer pharmacy, will-we-may
              show what's got stock, what's in stock, or what it should cost — before they
              even reach it.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT PATHWAY DOES ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">What Pathway does</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {whatCards.map((card) => (
              <Link
                key={card.title}
                to={card.to}
                className="border border-gray-200 rounded-xl p-5 hover:border-green-800 hover:shadow-sm transition-all block group"
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-green-900 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCAN IT SECTION ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4" style={{ backgroundColor: '#0d2d1e' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Scan it. Know it's real.
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p>Scan the verification code on the verified against in applied records in seconds — before you take it, not after.</p>
              <p>Confirms the medicine is up to and approved supply of records.</p>
              <p>Gives expiry and batch information.</p>
              <p>Flags anything that doesn't match.</p>
            </div>

            <Link
              to="/dashboard/verify"
              className="inline-flex items-center gap-2 mt-8 border border-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiShield size={15} /> Scan medicine
            </Link>
          </div>

          {/* Right — QR graphic */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 border-white/20 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-white/20 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: [0,2,6,8].includes(i) ? 'white' : (i === 4 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)') }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE HOW IT WORKS / WHO IT'S FOR TABS ──────────────────── */}
      <InteractiveSection />

      {/* ── FIRST VERSION SCOPE + HEALTH ASSISTANT ────────────────────────── */}
      <section className="border-t border-gray-100 py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Scope */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">First version scope</h2>
            <ul className="space-y-3">
              {scopeItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <FiCheckCircle size={15} className="text-green-800 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-8 leading-relaxed">
              Later: medicine scheduling · Secure to in-person prescription management
            </p>
          </div>

          {/* Health Assistant */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Health Assistant</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              An in-app guide driven by AI that Pathway can point you toward general first-aid, medicine information, and the risk of medicines at home. Help based on your description.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800 leading-relaxed">
              <strong className="block mb-1">Not a substitute for medical advice.</strong>
              Pathway provides general health information only. Always consult a qualified healthcare professional or pharmacist for decisions.
            </div>
            <Link
              to="/dashboard/health-assistant"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-green-900 hover:underline"
            >
              <FiHeart size={14} /> Try Health Assistant <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA / QUOTE ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ backgroundColor: '#0d2d1e' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed mb-10 italic">
            "A digital healthcare platform that connects patients with verified pharmacies, suppliers, and delivery agents — so medicine is easier to find, trust, and access."
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-green-900 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get started <FiArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
