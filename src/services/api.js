import { medicines, pharmacies, inventory, initialOrders, firstAidGuides } from '../data/demoData';

// Simulated delay to mimic network latency
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Get or init local orders
const getLocalOrders = () => {
  try {
    const stored = localStorage.getItem('pathway_orders');
    return stored ? JSON.parse(stored) : initialOrders;
  } catch {
    return initialOrders;
  }
};

const saveOrders = (orders) => {
  localStorage.setItem('pathway_orders', JSON.stringify(orders));
};

const getUser = () => {
  try {
    const stored = localStorage.getItem('pathway_user');
    return stored ? JSON.parse(stored) : { id: 'demo-user-001' };
  } catch {
    return { id: 'demo-user-001' };
  }
};

// ── Medicines ─────────────────────────────────────────────────────────────────
export const medicinesApi = {
  search: async (params = {}) => {
    await delay();
    let results = [...medicines];
    const q = params.q?.toLowerCase()?.trim();
    if (q) {
      results = results.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        m.strength.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }
    return { medicines: results, total: results.length };
  },
  
  getById: async (id) => {
    await delay(200);
    const medicine = medicines.find((m) => m.id === id);
    if (!medicine) throw new Error('Medicine not found.');
    return { medicine };
  },

  getAvailability: async (id, params = {}) => {
    await delay();
    const medicine = medicines.find((m) => m.id === id);
    if (!medicine) throw new Error('Medicine not found.');

    const city = params.city?.toLowerCase();
    const availabilityList = inventory
      .filter((inv) => inv.medicineId === id)
      .map((inv) => {
        const pharmacy = pharmacies.find((p) => p.id === inv.pharmacyId);
        if (!pharmacy) return null;
        if (city && pharmacy.city.toLowerCase() !== city) return null;
        return {
          inventoryId: inv.id,
          pharmacyId: pharmacy.id,
          pharmacyName: pharmacy.name,
          pharmacyAddress: pharmacy.address,
          pharmacyVerified: pharmacy.verified,
          deliveryAvailable: pharmacy.deliveryAvailable,
          status: inv.status,
          stock: inv.stock,
          price: inv.price,
          lat: pharmacy.lat,
          lng: pharmacy.lng,
          openingHours: pharmacy.openingHours,
          lastUpdated: inv.lastUpdated,
        };
      })
      .filter(Boolean);

    return { medicine, availability: availabilityList };
  },

  getCategories: async () => {
    await delay(100);
    const categories = [...new Set(medicines.map((m) => m.category))];
    return { categories };
  },
};

// ── Pharmacies ────────────────────────────────────────────────────────────────
export const pharmaciesApi = {
  getAll: async (params = {}) => {
    await delay();
    let results = [...pharmacies];
    if (params.city) {
      results = results.filter((p) => p.city.toLowerCase().includes(params.city.toLowerCase()));
    }
    
    // Enrich with inventory counts
    const enriched = results.map((p) => {
      const availCount = inventory.filter((inv) => inv.pharmacyId === p.id && inv.status === 'available').length;
      return { ...p, availableMedicineCount: availCount };
    });
    
    return { pharmacies: enriched, total: enriched.length };
  },

  getById: async (id) => {
    await delay();
    const pharmacy = pharmacies.find((p) => p.id === id);
    if (!pharmacy) throw new Error('Pharmacy not found.');
    return { pharmacy };
  }
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: async (data) => {
    await delay(600);
    const orders = getLocalOrders();
    const user = getUser();
    
    const newOrder = {
      id: `ord-${Math.random().toString(36).substring(2, 10)}`,
      userId: user.id,
      pharmacyId: data.pharmacyId,
      status: 'pending',
      deliveryType: data.deliveryType || 'pickup',
      deliveryAddress: data.deliveryAddress || null,
      items: data.items,
      total: data.total,
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    orders.unshift(newOrder); // Add to beginning
    saveOrders(orders);
    
    return { order: newOrder, message: 'Order placed successfully.' };
  },

  getAll: async () => {
    await delay();
    const orders = getLocalOrders();
    const user = getUser();
    const userOrders = orders
      .filter((o) => o.userId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { orders: userOrders, total: userOrders.length };
  },

  getById: async (id) => {
    await delay();
    const orders = getLocalOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found.');
    return { order };
  },
};

// ── Verification ──────────────────────────────────────────────────────────────
export const verificationApi = {
  verify: async (data) => {
    await delay(800);
    const searchCode = (data.code || data.barcode || data.qrCode || '').trim().toUpperCase();
    
    if (!searchCode) throw new Error('Verification code is required.');

    const medicine = medicines.find(
      (m) => m.verificationCode && m.verificationCode.toUpperCase() === searchCode
    );

    if (medicine) {
      return {
        result: 'verified',
        message: 'This product matches available verification information in the Pathway demo database.',
        notice: 'This is DEMO verification only. This system does not connect to a real national medicines regulatory authority database.',
        product: {
          name: medicine.name,
          genericName: medicine.genericName,
          strength: medicine.strength,
          form: medicine.form,
          manufacturer: medicine.manufacturer,
          verificationCode: medicine.verificationCode,
          category: medicine.category,
        },
        verifiedAt: new Date().toISOString(),
      };
    }

    if (searchCode === 'DEMO-ISSUE-999') {
      return {
        result: 'potential_issue',
        message: 'The verification information for this product does not match our records.',
        notice: 'Do not rely on this result alone. Please contact a qualified healthcare professional or relevant authority.',
        product: null,
        verifiedAt: new Date().toISOString(),
      };
    }

    return {
      result: 'unable_to_verify',
      message: 'We could not confirm this product using the Pathway demo database.',
      notice: 'Please consult a pharmacist or healthcare professional before using this medicine. This is a demonstration system and does not connect to real regulatory databases.',
      product: null,
      verifiedAt: new Date().toISOString(),
    };
  },
};

// ── Health assistant ──────────────────────────────────────────────────────────
const responseLibrary = [
  {
    keywords: ['headache', 'head ache', 'head pain'],
    response: `Headaches can have many causes, including tension, dehydration, fatigue, stress, or eye strain. Some general steps that may help include resting in a quiet, dark room, drinking water, and taking an appropriate over-the-counter painkiller if needed.\n\n**Important:** If your headache is sudden and extremely severe, follows a head injury, or is accompanied by fever, stiff neck, confusion, or vision changes, please seek professional medical attention immediately.\n\nA pharmacist or healthcare professional can advise you on appropriate treatment for your specific situation.`,
  },
  {
    keywords: ['fever', 'high temperature', 'temperature'],
    response: `A fever is the body's natural response to infection. General management includes rest, drinking plenty of fluids, wearing light clothing, and considering an appropriate fever-reducing medicine.\n\n**Important:** Seek medical attention if:\n- Temperature is above 39.5°C (103°F) in adults\n- Any fever in infants under 3 months\n- Fever lasts more than 3 days\n- Accompanied by severe headache, stiff neck, or rash\n\nA qualified healthcare professional can assess the cause of your fever and advise appropriate treatment.`,
  },
  {
    keywords: ['amoxicillin', 'antibiotic', 'antibiotics'],
    response: `Amoxicillin is a penicillin-type antibiotic used to treat certain bacterial infections. It is only effective against bacterial infections — it will not treat viral infections such as the common cold.\n\n**Important:** Antibiotics should only be taken when prescribed by a qualified healthcare professional. Taking antibiotics without a prescription, or not completing a prescribed course, can contribute to antibiotic resistance.\n\nPlease consult a doctor or pharmacist before taking any antibiotic.`,
  },
  {
    keywords: ['burn', 'burning', 'scald', 'scalded'],
    response: `For a minor burn, cool the affected area immediately under cool running water for 10–20 minutes. Do not use ice or cold water. Do not apply butter, toothpaste, or other home remedies.\n\n**Seek immediate medical attention if:**\n- The burn is larger than the palm of the hand\n- The burn is on the face, hands, feet, genitals, or over a major joint\n- The burn is deep or has caused charring\n- The person is a child or elderly\n\nFor serious burns, call for emergency medical help immediately.`,
  },
];

export const healthAssistantApi = {
  chat: async (msg) => {
    await delay(1000);
    const message = msg?.toLowerCase() || '';
    
    // Emergency detection
    if (['chest pain', 'breathe', 'bleeding', 'emergency'].some((kw) => message.includes(kw))) {
      return {
        type: 'emergency',
        response: `⚠️ **This sounds like it could be a medical emergency.**\n\nPlease seek **immediate professional medical help**. Do not delay. Call your local emergency services or go to the nearest emergency healthcare facility.`,
      };
    }

    // Sensitive request detection
    if (['prescribe', 'diagnose', 'what drug'].some((kw) => message.includes(kw))) {
      return {
        type: 'safe_redirect',
        response: `I understand you are looking for specific medical advice. However, the Pathway health assistant can only provide **general health information** — it cannot diagnose conditions or prescribe medication.\n\nFor a proper assessment and any prescription you may need, please speak with a **doctor, nurse, or pharmacist**.`,
        disclaimer: 'This information is for general purposes only and does not replace professional medical advice.',
      };
    }

    // Match response from library
    const matched = responseLibrary.find((entry) =>
      entry.keywords.some((kw) => message.includes(kw))
    );

    if (matched) {
      return {
        type: 'information',
        response: matched.response,
        disclaimer: 'This information is for general educational purposes only and does not replace professional medical advice.',
      };
    }

    return {
      type: 'general',
      response: `Thank you for your question. I can provide **general health information** to help you understand your options.\n\nBased on what you've described, I'd recommend speaking with a **pharmacist, doctor, or nurse** who can properly assess your situation and advise on appropriate care.\n\nIf you are experiencing a medical emergency, please seek immediate professional medical help.`,
      disclaimer: 'This information is for general educational purposes only and does not replace professional medical advice.',
    };
  },
};

// ── First aid ─────────────────────────────────────────────────────────────────
export const firstAidApi = {
  getGuides: async (params = {}) => {
    await delay();
    let results = [...firstAidGuides];
    if (params.category) results = results.filter((g) => g.category.toLowerCase().includes(params.category.toLowerCase()));
    if (params.severity) results = results.filter((g) => g.severity.toLowerCase() === params.severity.toLowerCase());
    
    const summaries = results.map(({ id, title, icon, category, severity }) => ({ id, title, icon, category, severity }));
    return { guides: summaries, total: summaries.length };
  },
  
  getGuideById: async (id) => {
    await delay();
    const guide = firstAidGuides.find((g) => g.id === id);
    if (!guide) throw new Error('First-aid guide not found.');
    return { guide };
  },
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: async () => {
    await delay(300);
    
    // Get latest data from localStorage or fallback to demoData
    const orders = getLocalOrders();
    
    let localUsers = [];
    try { localUsers = JSON.parse(localStorage.getItem('pathway_users')) || []; } 
    catch { localUsers = []; }
    if (localUsers.length === 0) localUsers = [{id: 1}, {id: 2}]; // fallback length 2 if missing entirely

    let localPharmacies = pharmacies;
    try { 
      const p = localStorage.getItem('pathway_pharmacies');
      if (p) localPharmacies = JSON.parse(p); 
    } catch {}

    let localMedicines = medicines;
    try {
      const m = localStorage.getItem('pathway_medicines');
      if (m) localMedicines = JSON.parse(m);
    } catch {}

    const availableItems = inventory.filter((i) => i.status === 'available').length;
    const lowStockItems = inventory.filter((i) => i.status === 'low_stock').length;
    const outOfStockItems = inventory.filter((i) => i.status === 'out_of_stock').length;

    const activeOrders = orders.filter((o) => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length;
    const verifiedPharmacies = localPharmacies.filter((p) => p.verified).length;
    const pendingPharmacies = localPharmacies.filter((p) => !p.verified);

    return {
      stats: {
        totalMedicines: localMedicines.length,
        totalPharmacies: localPharmacies.length,
        verifiedPharmacies,
        pendingVerifications: pendingPharmacies.length,
        pendingPharmaciesList: pendingPharmacies,
        availableInventoryItems: availableItems,
        lowStockItems,
        outOfStockItems,
        totalInventoryRecords: inventory.length,
        totalOrders: orders.length,
        activeOrders,
        totalUsers: localUsers.length,
        registeredSuppliers: 0,
        recentOrders: orders.slice(0, 10), // Return up to 10 recent orders
        pharmaciesList: localPharmacies,
      },
    };
  },

  verifyPharmacy: async (id) => {
    await delay(300);
    let localPharmacies = pharmacies;
    try {
      const p = localStorage.getItem('pathway_pharmacies');
      if (p) localPharmacies = JSON.parse(p);
    } catch {}
    const updated = localPharmacies.map((ph) =>
      ph.id === id ? { ...ph, verified: true } : ph
    );
    localStorage.setItem('pathway_pharmacies', JSON.stringify(updated));
    return { success: true };
  },
};

