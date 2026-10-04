export const medicines = [
  {
    id: 'm-001', name: 'Amoxicillin', genericName: 'Amoxicillin trihydrate', brandNames: ['Amoxil', 'Trimox'],
    strength: '500mg', form: 'Capsule', category: 'Antibiotics', manufacturer: 'Demo Pharma Ltd',
    requiresPrescription: true, description: 'Amoxicillin is a penicillin-type antibiotic used to treat certain bacterial infections.',
    uses: 'Commonly used to treat bacterial infections of the ear, nose, throat, urinary tract, and skin.',
    warnings: 'Do not use if allergic to penicillin. Inform your healthcare provider of any allergies before use.',
    sideEffects: 'May include nausea, diarrhoea, or rash. Seek professional advice if you experience severe reactions.',
    storageInstructions: 'Store at room temperature, away from moisture and heat.', contraindications: 'Allergy to penicillin or cephalosporin antibiotics.',
    dosageInfo: 'As directed by a qualified healthcare professional. Do not self-prescribe.', image: null, verificationCode: 'DEMO-AMX-001', createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'm-002', name: 'Paracetamol', genericName: 'Acetaminophen', brandNames: ['Panadol', 'Panamax'],
    strength: '500mg', form: 'Tablet', category: 'Analgesics / Antipyretics', manufacturer: 'Demo Pharma Ltd',
    requiresPrescription: false, description: 'Paracetamol is used to relieve mild to moderate pain and reduce fever.',
    uses: 'Commonly used for headache, muscle ache, fever, toothache, and minor pain relief.',
    warnings: 'Do not exceed the recommended dose. Avoid alcohol while taking this medicine. Consult a healthcare provider if symptoms persist.',
    sideEffects: 'Generally well tolerated at recommended doses. Overdose can cause serious liver damage.',
    storageInstructions: 'Store below 25°C, away from moisture.', contraindications: 'Severe liver disease. Known allergy to paracetamol.',
    dosageInfo: 'As directed on the label or by a qualified healthcare professional. Do not self-prescribe higher doses.', image: null, verificationCode: 'DEMO-PCM-002', createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'm-003', name: 'Ibuprofen', genericName: 'Ibuprofen', brandNames: ['Brufen', 'Advil', 'Nurofen'],
    strength: '200mg', form: 'Tablet', category: 'Anti-inflammatory / Analgesics', manufacturer: 'Demo Pharma Ltd',
    requiresPrescription: false, description: 'Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce fever, and decrease inflammation.',
    uses: 'Used for headache, dental pain, muscle pain, menstrual cramps, and arthritis.',
    warnings: 'May cause stomach upset. Take with food. Not recommended for people with stomach ulcers, kidney problems, or during pregnancy without medical advice.',
    sideEffects: 'May include stomach pain, heartburn, or nausea. Rarely, serious stomach bleeding may occur.',
    storageInstructions: 'Store below 30°C in a dry place.', contraindications: 'Active peptic ulcers. Severe kidney or liver impairment. Last trimester of pregnancy.',
    dosageInfo: 'As directed on the label or by a qualified healthcare professional.', image: null, verificationCode: 'DEMO-IBU-003', createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'm-004', name: 'Oral Rehydration Salts (ORS)', genericName: 'Oral Rehydration Salts', brandNames: ['Electrolyte', 'Rehydrat', 'ORS Sachets'],
    strength: 'Standard WHO Formula', form: 'Powder for oral solution', category: 'Rehydration', manufacturer: 'Demo Health Supplies',
    requiresPrescription: false, description: 'ORS is used to prevent or treat dehydration caused by diarrhoea and vomiting.',
    uses: 'Treatment and prevention of dehydration due to diarrhoea, vomiting, or excessive sweating.',
    warnings: 'Dissolve in the correct amount of clean water as directed. Do not add extra sugar or salt.',
    sideEffects: 'Generally safe and well tolerated when prepared correctly.',
    storageInstructions: 'Store sachets in a cool, dry place. Prepared solution should be used within 24 hours.', contraindications: 'Severe vomiting where oral intake is not possible (seek professional medical care).',
    dosageInfo: 'As directed on the packaging or by a healthcare professional.', image: null, verificationCode: 'DEMO-ORS-004', createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'm-005', name: 'Metformin', genericName: 'Metformin hydrochloride', brandNames: ['Glucophage'],
    strength: '500mg', form: 'Tablet', category: 'Antidiabetic', manufacturer: 'Demo Pharma Ltd',
    requiresPrescription: true, description: 'Metformin is used to treat type 2 diabetes. It helps control blood sugar levels.',
    uses: 'Management of type 2 diabetes mellitus, often in combination with diet and exercise.',
    warnings: 'Do not use if you have kidney problems or are having a radiological procedure with contrast dye. Consult your healthcare provider.',
    sideEffects: 'Common side effects include nausea, diarrhoea, stomach upset. Usually improve with time.',
    storageInstructions: 'Store at room temperature, away from moisture.', contraindications: 'Renal impairment, hepatic failure, diabetic ketoacidosis.',
    dosageInfo: 'As prescribed by a qualified healthcare professional. Do not adjust dose without medical advice.', image: null, verificationCode: 'DEMO-MET-005', createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'm-006', name: 'Chloroquine', genericName: 'Chloroquine phosphate', brandNames: ['Aralen'],
    strength: '250mg', form: 'Tablet', category: 'Antimalarials', manufacturer: 'Demo Pharma Ltd',
    requiresPrescription: true, description: 'Chloroquine is used to prevent and treat malaria in regions where it remains effective.',
    uses: 'Prevention and treatment of malaria. Consult a healthcare professional before use.',
    warnings: 'Not effective in all malaria regions. Consult a healthcare provider for guidance.',
    sideEffects: 'May include nausea, headache, dizziness, and blurred vision.',
    storageInstructions: 'Store at room temperature away from light.', contraindications: 'Known hypersensitivity. Pre-existing eye conditions. Consult your doctor.',
    dosageInfo: 'As prescribed by a qualified healthcare professional.', image: null, verificationCode: 'DEMO-CLQ-006', createdAt: '2024-01-01T00:00:00Z',
  },
];

export const pharmacies = [
  {
    id: 'ph-001', name: 'Demo Central Pharmacy', verified: true, address: '10 Samora Machel Ave, Harare (DEMO)',
    phone: '+263 77 000 0001', email: 'demo.central@pathway.demo', openingHours: 'Mon–Fri: 08:00–18:00 | Sat: 08:00–14:00 | Sun: Closed',
    deliveryAvailable: true, deliveryRadius: '10km', rating: 4.5, reviewCount: 38, lat: -17.8292, lng: 31.0522, city: 'Harare',
    description: 'A demonstration pharmacy for the Pathway platform. Not a real pharmacy.',
  },
  {
    id: 'ph-002', name: 'Demo Eastgate Pharmacy', verified: true, address: 'Eastgate Mall, Robert Mugabe Road, Harare (DEMO)',
    phone: '+263 77 000 0002', email: 'demo.eastgate@pathway.demo', openingHours: 'Mon–Sun: 09:00–19:00',
    deliveryAvailable: true, deliveryRadius: '8km', rating: 4.2, reviewCount: 24, lat: -17.8360, lng: 31.0624, city: 'Harare',
    description: 'A demonstration pharmacy for the Pathway platform. Not a real pharmacy.',
  },
  {
    id: 'ph-003', name: 'Demo Avenues Pharmacy', verified: false, address: '5 Baines Ave, Harare (DEMO)',
    phone: '+263 77 000 0003', email: 'demo.avenues@pathway.demo', openingHours: 'Mon–Fri: 07:30–17:30',
    deliveryAvailable: false, deliveryRadius: null, rating: 3.8, reviewCount: 12, lat: -17.8150, lng: 31.0488, city: 'Harare',
    description: 'A demonstration pharmacy for the Pathway platform. Not a real pharmacy.',
  },
  {
    id: 'ph-004', name: 'Demo Bulawayo Health Pharmacy', verified: true, address: 'Fort Street, Bulawayo (DEMO)',
    phone: '+263 77 000 0004', email: 'demo.bulawayo@pathway.demo', openingHours: 'Mon–Fri: 08:00–17:00 | Sat: 08:00–13:00',
    deliveryAvailable: true, deliveryRadius: '15km', rating: 4.7, reviewCount: 51, lat: -20.1500, lng: 28.5833, city: 'Bulawayo',
    description: 'A demonstration pharmacy for the Pathway platform. Not a real pharmacy.',
  },
];

const uuid = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const inventory = [
  { id: uuid(), pharmacyId: 'ph-001', medicineId: 'm-001', stock: 0, price: 3.50, status: 'out_of_stock', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-001', medicineId: 'm-002', stock: 200, price: 0.80, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-001', medicineId: 'm-003', stock: 50, price: 1.20, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-001', medicineId: 'm-004', stock: 80, price: 0.50, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-001', medicineId: 'm-005', stock: 8, price: 4.20, status: 'low_stock', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-002', medicineId: 'm-001', stock: 60, price: 3.80, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-002', medicineId: 'm-002', stock: 150, price: 0.90, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-002', medicineId: 'm-003', stock: 0, price: 1.30, status: 'out_of_stock', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-002', medicineId: 'm-006', stock: 30, price: 2.10, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-003', medicineId: 'm-001', stock: 25, price: 3.60, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-003', medicineId: 'm-004', stock: 5, price: 0.45, status: 'low_stock', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-004', medicineId: 'm-001', stock: 100, price: 3.40, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-004', medicineId: 'm-002', stock: 300, price: 0.75, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-004', medicineId: 'm-005', stock: 45, price: 4.00, status: 'available', lastUpdated: '2024-06-01T08:00:00Z' },
  { id: uuid(), pharmacyId: 'ph-004', medicineId: 'm-006', stock: 0, price: 2.20, status: 'out_of_stock', lastUpdated: '2024-06-01T08:00:00Z' },
];

export const initialOrders = [
  {
    id: 'ord-001', userId: 'demo-user-001', pharmacyId: 'ph-002', status: 'delivered', deliveryType: 'delivery', deliveryAddress: '15 Demo Street, Harare',
    items: [{ medicineId: 'm-001', medicineName: 'Amoxicillin 500mg', quantity: 2, price: 3.80, subtotal: 7.60 }], total: 7.60, notes: '', createdAt: '2024-05-28T10:00:00Z', updatedAt: '2024-05-28T14:00:00Z',
  },
  {
    id: 'ord-002', userId: 'demo-user-001', pharmacyId: 'ph-001', status: 'out_for_delivery', deliveryType: 'delivery', deliveryAddress: '15 Demo Street, Harare',
    items: [{ medicineId: 'm-002', medicineName: 'Paracetamol 500mg', quantity: 1, price: 0.80, subtotal: 0.80 }, { medicineId: 'm-003', medicineName: 'Ibuprofen 200mg', quantity: 1, price: 1.20, subtotal: 1.20 }],
    total: 2.00, notes: '', createdAt: '2024-06-01T09:00:00Z', updatedAt: '2024-06-01T11:30:00Z',
  },
];

export const firstAidGuides = [
  {
    id: 'fa-001', title: 'Minor Burns', icon: '🔥', category: 'Burns', severity: 'minor',
    steps: ['Cool the burn immediately by holding it under cool (not cold) running water for at least 10–20 minutes.', 'Remove jewellery or clothing near the burn — do this gently before any swelling begins.', 'Do not break blisters, as this increases the risk of infection.', 'Cover the burn loosely with a clean, non-fluffy material, such as a sterile dressing or cling wrap.', 'Take a mild painkiller if needed, following the manufacturer\'s instructions.'],
    doNots: ['Do NOT apply ice, butter, toothpaste, or any home remedy to the burn.', 'Do NOT use fluffy cotton wool directly on the burn.', 'Do NOT burst blisters.'],
    seekHelpIf: ['The burn is larger than the size of the person\'s hand.', 'The burn is on the face, hands, feet, genitals, or a major joint.', 'The burn is deep or has caused charring.', 'The person is a child or elderly.', 'You are uncertain about the severity.'],
  },
  {
    id: 'fa-002', title: 'Cuts & Bleeding', icon: '🩹', category: 'Wounds', severity: 'minor',
    steps: ['Clean your hands thoroughly before treating a wound.', 'Apply gentle pressure to the wound using a clean cloth or sterile dressing.', 'Maintain pressure for at least 10 minutes without lifting to check.', 'If possible, elevate the injured area above the level of the heart.', 'Once bleeding has stopped, clean the wound gently under clean running water.', 'Apply a sterile adhesive dressing or bandage.'],
    doNots: ['Do NOT remove an object embedded in a wound.', 'Do NOT apply a tourniquet unless professionally trained.', 'Do NOT use dirty materials to cover a wound.'],
    seekHelpIf: ['Bleeding does not stop after 10–15 minutes of firm pressure.', 'The wound is deep, large, or gaping.', 'The wound involves a joint, tendon, or bone.', 'There is an embedded object in the wound.', 'Signs of infection develop (redness, swelling, warmth, discharge, fever).'],
  },
  {
    id: 'fa-003', title: 'Fever', icon: '🌡️', category: 'Temperature', severity: 'moderate',
    steps: ['Rest in a cool, well-ventilated room.', 'Drink plenty of fluids to stay hydrated.', 'Wear light, comfortable clothing.', 'A cool (not cold) damp cloth on the forehead may help provide comfort.', 'Appropriate medication to reduce fever may be considered — consult a pharmacist or healthcare provider.'],
    doNots: ['Do NOT use cold baths or ice to cool the body rapidly.', 'Do NOT give aspirin to children under 16.', 'Do NOT ignore a high or persistent fever.'],
    seekHelpIf: ['Temperature is above 39.5°C (103°F) in an adult.', 'Any fever in a child under 3 months old.', 'Fever lasts more than 3 days.', 'Accompanied by severe headache, stiff neck, rash, or confusion.', 'The person has difficulty breathing or is unresponsive.'],
  },
  {
    id: 'fa-004', title: 'Choking', icon: '🫁', category: 'Emergency', severity: 'emergency',
    steps: ['Encourage the person to cough forcefully if they can.', 'Give up to 5 firm back blows between the shoulder blades using the heel of your hand.', 'If back blows do not work, give up to 5 abdominal thrusts (Heimlich manoeuvre) — for adults and children over 1 year.', 'Alternate between 5 back blows and 5 abdominal thrusts.', 'Call for emergency medical help immediately.'],
    doNots: ['Do NOT perform abdominal thrusts on infants under 1 year — use back blows only.', 'Do NOT perform abdominal thrusts on pregnant individuals.', 'Do NOT leave the person alone.'],
    seekHelpIf: ['The obstruction does not clear after back blows and abdominal thrusts.', 'The person loses consciousness.', 'The person cannot breathe, speak, or cough.', 'This is always an emergency — seek immediate medical help.'],
  },
];

export const initialUsers = [
  { id: 'demo-user-001', name: 'Demo Patient', email: 'patient@pathway.demo', password: 'demo1234', role: 'patient', city: 'Harare', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'demo-admin-001', name: 'Pathway Admin', email: 'admin@pathway.demo', password: 'admin1234', role: 'admin', city: 'Harare', createdAt: '2024-01-01T00:00:00Z' },
];
