import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiCheck } from 'react-icons/fi';
import { DemoNotice } from '../../components/UI';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          // Adjust scroll position if there is a sticky navbar
          const headerOffset = 64; // rough height of sticky header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
             top: offsetPosition,
             behavior: 'smooth'
          });
        }, 50);
      }
    }
  }, [location.hash]);

  return (
    <div className="bg-[#FAF7F2]">
      {/* Demo notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <DemoNotice />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-white mb-6 tracking-wider uppercase bg-[#0D6A46] px-3 py-1.5 rounded-md">
              A trust layer for medicine access
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              Find the medicine<br className="hidden sm:block" /> you need. Know it's<br className="hidden sm:block" /> genuine.
            </h1>

            <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-lg">
              Pathway connects you to verified pharmacies with real-time stock, checks medicine authenticity by scan, and arranges delivery when you can't get there yourself.
            </p>

            {/* Search bar */}
            <form action="/find-medicine" className="flex items-center gap-3 w-full border border-gray-900 rounded-lg p-1.5 bg-white mb-6 max-w-xl shadow-sm">
              <FiSearch size={18} className="text-gray-400 ml-3 shrink-0" />
              <input type="text" placeholder="Search for a medicine, e.g. Amoxicillin 500mg" className="flex-1 bg-transparent outline-none text-sm px-2 text-gray-900 placeholder:text-gray-400" />
              <button type="submit" className="bg-[#0D6A46] text-white text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-green-800 transition-colors">Search</button>
            </form>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="border border-blue-200 text-blue-900 bg-blue-50/70 rounded-full px-3 py-1.5">Verified pharmacies</span>
              <span className="border border-red-200 text-red-900 bg-red-50/70 rounded-full px-3 py-1.5">Live stock status</span>
              <span className="border border-amber-200 text-amber-900 bg-amber-50/70 rounded-full px-3 py-1.5">Scan to verify</span>
              <span className="border border-emerald-200 text-emerald-900 bg-emerald-50/70 rounded-full px-3 py-1.5">Delivery on request</span>
            </div>
          </div>

          {/* Right — live results preview */}
          <div className="relative lg:pt-4">
            {/* Decorative elements */}
            <div className="hidden sm:block absolute -top-8 left-10 w-8 h-8 bg-[#F09945] rounded-sm transform rotate-12 z-0 shadow-sm"></div>
            <div className="hidden sm:block absolute -bottom-6 left-16 w-5 h-5 bg-[#E06644] rounded-full z-0 shadow-sm"></div>
            <div className="hidden sm:block absolute top-1/2 -right-3 w-6 h-6 border-[3px] border-[#0D6A46] rounded-full translate-x-2 translate-y-2 z-20"></div>

            <div className="border-[3px] border-gray-900 rounded-xl overflow-hidden shadow-xl bg-white relative z-10 max-w-md mx-auto">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Amoxicillin 500mg — 3 results near you</span>
              </div>
              <div className="divide-y divide-gray-100 bg-white">
                <div className="flex items-center justify-between px-5 py-4 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">HealthPlus Pharmacy</p>
                    <p className="text-xs text-gray-500 mt-1">1.2 km · open until 8pm</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F5ED] text-[#0D6A46] uppercase tracking-wide">In stock</span>
                    <span className="text-sm font-bold text-gray-900">$4.50</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-4 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Greendale Pharmacy</p>
                    <p className="text-xs text-gray-500 mt-1">2.8 km · Delivery available</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F5ED] text-[#0D6A46] uppercase tracking-wide">In stock</span>
                    <span className="text-sm font-bold text-gray-900">$4.20</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-4 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">City Centre Pharmacy</p>
                    <p className="text-xs text-gray-500 mt-1">4.5 km</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 uppercase tracking-wide">Out of stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM SECTION ───────────────────────────────────────────────── */}
      <section className="border-t border-[#EAE3D5] py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-12">
              Getting medicine shouldn't<br className="hidden sm:block" /> be this hard
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-sm bg-[#0D6A46] shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Shortages and guesswork</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Patients travel between pharmacies with no way to know in advance which one has their medicine in stock.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-sm bg-[#0D6A46] shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Counterfeit and unsafe medication</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Fake or unsafe medicines enter the supply chain, and most patients have no way to check authenticity themselves.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-sm bg-[#0D6A46] shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Limited access for those who can't travel</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Elderly patients, people with disabilities, and those in remote areas struggle to reach a pharmacy at all.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-sm bg-[#0D6A46] shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">No transparency on price or source</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Pricing, usage information, and supplier details are rarely clear or consistent from one pharmacy to the next.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:pt-4 text-sm text-gray-600 leading-relaxed font-medium">
            Patients lose time and money visiting pharmacy after pharmacy, with no way to know what's genuine, what's in stock, or what it should cost — before they even walk in.
          </div>
        </div>
      </section>

      {/* ── WHAT PATHWAY DOES ─────────────────────────────────────────────── */}
      <section className="border-t border-[#EAE3D5] py-16 sm:py-24 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-12">What Pathway does</h2>
          <div className="grid sm:grid-cols-2 bg-white rounded-xl shadow-sm border border-[#EAE3D5] overflow-hidden">
            <div className="p-8 border-b sm:border-r border-[#EAE3D5]">
              <div className="border-l-[3px] border-[#0D6A46] pl-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2">Medicine locator</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Search a medicine and see real-time availability across nearby pharmacies, with the closest in-stock options surfaced first.</p>
              </div>
            </div>
            <div className="p-8 border-b border-[#EAE3D5]">
              <div className="border-l-[3px] border-[#0D6A46] pl-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2">Authenticity verification</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Scan a medicine's packaging to confirm it's genuine, check its expiry, and see approved supplier information.</p>
              </div>
            </div>
            <div className="p-8 sm:border-r border-[#EAE3D5]">
              <div className="border-l-[3px] border-[#0D6A46] pl-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2">Medicine information</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Plain-language details on what a medicine treats, how to use it safely, and any warnings worth knowing.</p>
              </div>
            </div>
            <div className="p-8">
              <div className="border-l-[3px] border-[#0D6A46] pl-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2">Delivery on request</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Verified delivery agents bring medicine to your home, clinic, or hospital when getting to a pharmacy isn't viable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCAN IT SECTION ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#1B4B36] rounded-xl px-8 py-16 sm:p-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">Scan it. Know it's real.</h2>
            <div className="space-y-4 text-sm text-white/90 leading-relaxed">
              <p>Every verified medicine on Pathway can be checked against supplier records in seconds — before you take it, not after.</p>
              <p>Confirms the medicine against approved supplier records.</p>
              <p>Checks expiry and batch information.</p>
              <p>Flags anything that doesn't match.</p>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-48 h-48 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-white/30 flex flex-col items-center justify-center text-white">
                <FiCheck size={28} className="mb-2" />
                <span className="text-[9px] tracking-[0.2em] text-center uppercase w-24 font-semibold">Verified Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW PATHWAY WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 border-t border-[#EAE3D5] bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-12">How Pathway works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <p className="text-[#0D6A46] font-bold text-sm mb-3">01</p>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Search</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Find the medicine you need by name or description.</p>
            </div>
            <div>
              <p className="text-[#0D6A46] font-bold text-sm mb-3">02</p>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Check availability</h3>
              <p className="text-sm text-gray-600 leading-relaxed">See which nearby pharmacies have it in stock, right now.</p>
            </div>
            <div>
              <p className="text-[#0D6A46] font-bold text-sm mb-3">03</p>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Verify</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Scan the packaging to confirm it's genuine before you buy.</p>
            </div>
            <div>
              <p className="text-[#0D6A46] font-bold text-sm mb-3">04</p>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Get it delivered</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Request delivery to your home, clinic, or hospital.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILT FOR EVERYONE ────────────────────────────────────────────── */}
      <section id="who-its-for" className="py-16 sm:py-24 px-4 border-t border-[#EAE3D5] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-12">Built for everyone in the supply chain</h2>
          <div className="flex flex-col border-t border-[#EAE3D5]">
            <div className="flex flex-col md:flex-row py-6 border-b border-[#EAE3D5] gap-2 md:gap-16 items-start md:items-center">
              <div className="md:w-1/4 font-bold text-gray-900 text-sm">Patients</div>
              <div className="md:w-3/4 text-sm text-gray-600">Search for medication, verify authenticity, view medicine information, and request delivery.</div>
            </div>
            <div className="flex flex-col md:flex-row py-6 border-b border-[#EAE3D5] gap-2 md:gap-16 items-start md:items-center">
              <div className="md:w-1/4 font-bold text-gray-900 text-sm">Pharmacies</div>
              <div className="md:w-3/4 text-sm text-gray-600">Keep stock and availability information current, and receive requests directly from nearby patients.</div>
            </div>
            <div className="flex flex-col md:flex-row py-6 border-b border-[#EAE3D5] gap-2 md:gap-16 items-start md:items-center">
              <div className="md:w-1/4 font-bold text-gray-900 text-sm">Medical suppliers</div>
              <div className="md:w-3/4 text-sm text-gray-600">Provide verified medication and maintain a trusted, traceable supply chain.</div>
            </div>
            <div className="flex flex-col md:flex-row py-6 border-b border-[#EAE3D5] gap-2 md:gap-16 items-start md:items-center">
              <div className="md:w-1/4 font-bold text-gray-900 text-sm">Delivery agents</div>
              <div className="md:w-3/4 text-sm text-gray-600">Transport medication safely to patients who can't reach a pharmacy themselves.</div>
            </div>
            <div className="flex flex-col md:flex-row py-6 border-b border-[#EAE3D5] gap-2 md:gap-16 items-start md:items-center">
              <div className="md:w-1/4 font-bold text-gray-900 text-sm">Healthcare providers</div>
              <div className="md:w-3/4 text-sm text-gray-600">Support medicine recommendations and help confirm availability for their patients.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIRST VERSION SCOPE + HEALTH ASSISTANT ────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 border-t border-[#EAE3D5] bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-8">First version scope</h2>
            <ul className="space-y-4 mb-8">
              {['User registration and login', 'Medicine search system', 'Pharmacy stock tracking', 'Pharmacy location mapping', 'Medicine verification scanner', 'Medication delivery requests'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                  <div className="w-3.5 h-3.5 border-2 border-[#0D6A46] rounded-sm shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2.5">
              <span className="text-[11px] font-medium text-gray-500 border border-gray-300 rounded-sm px-3 py-1 bg-white">Later: digital prescriptions</span>
              <span className="text-[11px] font-medium text-gray-500 border border-gray-300 rounded-sm px-3 py-1 bg-white">Later: online consultations</span>
              <span className="text-[11px] font-medium text-gray-500 border border-gray-300 rounded-sm px-3 py-1 bg-white">Later: medication reminders</span>
              <span className="text-[11px] font-medium text-gray-500 border border-gray-300 rounded-sm px-3 py-1 bg-white">Later: insurance integration</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Health Assistant</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Describe your symptoms and Pathway can point you toward general first-aid guidance and the kind of medicine that may help, based on your description.
            </p>
            <div className="bg-white border border-gray-200 p-5 rounded-lg border-l-4 border-l-red-500 text-sm text-gray-600 shadow-sm">
              <strong className="text-gray-900 block mb-1">Not a substitute for medical advice.</strong>
              Pathway provides general health information only and does not replace a qualified healthcare professional.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / QUOTE ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#1B4B36]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed mb-10">
            "A digital healthcare platform that connects patients with verified pharmacies, suppliers, and delivery agents — so medicine is easier to find, trust, and access."
          </p>
          <Link to="/register" className="inline-block bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-md hover:bg-gray-100 transition-colors shadow-sm">
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
