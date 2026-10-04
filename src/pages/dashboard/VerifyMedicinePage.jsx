import React, { useState, useRef, useEffect } from 'react';
import { verificationApi } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Button, DemoNotice } from '../../components/UI';
import { FiCamera, FiSearch, FiShield, FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const RESULT_CONFIG = {
  verified:         { icon: <FiCheckCircle size={32} />, color: 'text-green-600', bg: 'bg-green-50 border-green-200', title: 'Verification Found' },
  unable_to_verify: { icon: <FiAlertTriangle size={32} />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', title: 'Unable to Verify' },
  potential_issue:  { icon: <FiXCircle size={32} />, color: 'text-red-600', bg: 'bg-red-50 border-red-200', title: 'Potential Issue Detected' },
};

export default function VerifyMedicinePage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null);

  const handleVerify = async (searchCode) => {
    const c = (searchCode || code).trim();
    if (!c) {
      setError('Please enter a verification code.');
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const data = await verificationApi.verify({ code: c });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // QR/Barcode scanner setup
  const startScanner = async () => {
    setScannerOpen(true);
    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      setTimeout(() => {
        if (scannerRef.current) {
          const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
          );
          scanner.render(
            (decodedText) => {
              setCode(decodedText);
              scanner.clear();
              setScannerOpen(false);
              handleVerify(decodedText);
            },
            (err) => { /* ignore scan errors */ }
          );
          scannerInstance.current = scanner;
        }
      }, 100);
    } catch {
      setError('Camera scanner is not available. Please enter the code manually.');
      setScannerOpen(false);
    }
  };

  const stopScanner = () => {
    scannerInstance.current?.clear().catch(() => {});
    setScannerOpen(false);
  };

  const cfg = result ? RESULT_CONFIG[result.result] : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-4"><DemoNotice /></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <FiShield size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Medicine</h1>
          <p className="text-sm text-gray-500">Scan a QR code, barcode, or enter a verification code</p>
        </div>
      </div>

      {/* Demo codes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800">
        <p className="font-semibold mb-1">Demo Verification Codes</p>
        <p>Try: <code className="bg-amber-100 px-1 rounded">DEMO-AMX-001</code> (Amoxicillin) or <code className="bg-amber-100 px-1 rounded">DEMO-PCM-002</code> (Paracetamol)</p>
        <p className="mt-1">For "potential issue": <code className="bg-amber-100 px-1 rounded">DEMO-ISSUE-999</code></p>
      </div>

      {/* Input */}
      <div className="card p-6 mb-6">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); setResult(null); }}
              placeholder="Enter verification code or scan..."
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800 font-mono"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => handleVerify()}
            loading={loading}
            className="flex-1"
          >
            <FiShield size={16} /> Verify Code
          </Button>
          <Button
            variant="outline"
            onClick={scannerOpen ? stopScanner : startScanner}
            className="flex-1"
          >
            <FiCamera size={16} /> {scannerOpen ? 'Stop Camera' : 'Scan QR / Barcode'}
          </Button>
        </div>
      </div>

      {/* Camera scanner */}
      {scannerOpen && (
        <div className="card p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FiCamera size={16} className="text-green-800" /> Point camera at QR code or barcode
          </p>
          <div id="qr-reader" ref={scannerRef} className="rounded-xl overflow-hidden" />
        </div>
      )}

      {/* Result */}
      {result && cfg && (
        <div className={`border rounded-2xl p-6 ${cfg.bg}`}>
          <div className={`flex items-center gap-3 mb-4 ${cfg.color}`}>
            {cfg.icon}
            <h2 className="text-xl font-bold">{cfg.title}</h2>
          </div>

          <p className="text-gray-700 text-sm mb-3">{result.message}</p>
          <p className="text-xs text-gray-500 mb-4 italic">{result.notice}</p>

          {result.product && (
            <div className="bg-white/70 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Product Information</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {Object.entries({
                  'Name': result.product.name,
                  'Generic Name': result.product.genericName,
                  'Strength': result.product.strength,
                  'Form': result.product.form,
                  'Manufacturer': result.product.manufacturer,
                  'Category': result.product.category,
                  'Code': result.product.verificationCode,
                }).map(([label, value]) => value ? (
                  <div key={label}>
                    <span className="text-xs text-gray-400 block">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {(result.result === 'unable_to_verify' || result.result === 'potential_issue') && (
            <div className="bg-white/70 rounded-xl p-3 text-sm text-gray-700">
              <p className="font-semibold mb-1">What to do next</p>
              <ul className="space-y-1 text-xs">
                <li>• Consult a pharmacist or healthcare professional before using this medicine</li>
                <li>• Do not rely solely on this result</li>
                {result.result === 'potential_issue' && <li>• Consider reporting to your national medicines regulatory authority</li>}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3">
            Verified at: {new Date(result.verifiedAt).toLocaleString()}
          </p>

          <Button variant="secondary" className="mt-4" onClick={() => { setResult(null); setCode(''); }}>
            Verify Another
          </Button>
        </div>
      )}

      {/* Educational note */}
      {!result && (
        <div className="card p-5 bg-blue-50 border-blue-100 text-sm text-blue-800">
          <p className="font-semibold mb-2 flex items-center gap-2"><FiShield size={16} /> About Medicine Verification</p>
          <p className="text-xs leading-relaxed">
            Pathway's verification system compares entered codes against available demo data.
            In a production environment, this would connect to authorized national regulatory databases.
            Verification results should be used as a guide only — always consult a qualified pharmacist or healthcare professional.
          </p>
        </div>
      )}
    </div>
  );
}
