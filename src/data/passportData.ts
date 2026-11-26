export interface OriginTier {
  id: string;
  tierLabel: string;
  title: string;
  facility: string;
  location: string;
  badgeText: string;
  summary: string;
  verifiedTimestamp: string;
  batchCode: string;
  certification: string;
  fairlyMadeAuditId: string;
  auraAnchorHash: string;
  artisanNote: string;
}

export interface ImpactMetric {
  id: string;
  label: string;
  headlineValue: string;
  sublabel: string;
  progressPercent: number;
  barColor: 'emerald' | 'gold';
  policyReference: string;
}

export interface LogbookEntry {
  id: string;
  date: string;
  title: string;
  location: string;
  category: 'activation' | 'care' | 'inspection' | 'appointment';
  conditionGrade: string;
  artisanOrAdvisor: string;
  notes: string;
  blockNumber: string;
  txHash: string;
}

export interface SpaServiceOption {
  id: string;
  title: string;
  priceLabel: string;
  duration: string;
  description: string;
  highlightBadge?: string;
}

export interface PassportRecord {
  brand: string;
  program: string;
  consortiumSubtitle: string;
  bagName: string;
  collection: string;
  retailPrice: string;
  serialId: string;
  liveBagAgePill: string;
  statusBadge: string;
  owner: {
    displayName: string;
    encryptedToken: string;
    gdprNotice: string;
    boutiqueOfOrigin: string;
    purchaseDateLabel: string;
    ageSummary: string;
    ownershipLineage: string;
  };
  certificate: {
    certificateId: string;
    auraHashShort: string;
    auraHashFull: string;
    dualHardwareVerification: string;
    nfcChipId: string;
    qrTagId: string;
    network: string;
  };
  careSnapshot: string;
  metrics: {
    structuralRepairs: number;
    complimentaryConditionings: number;
    resaleConditionScore: string;
  };
  originTiers: OriginTier[];
  impactMetrics: ImpactMetric[];
  impactPolicyFooter: string;
  logbookEntries: LogbookEntry[];
  vipBoutique: {
    name: string;
    address: string;
    conciergePhone: string;
    hours: string;
    services: SpaServiceOption[];
    availableDates: string[];
    availableTimeSlots: string[];
  };
}

export const PASSPORT_DATA: PassportRecord = {
  brand: 'BVLGARI',
  program: 'BVLGARI ETERNAL',
  consortiumSubtitle: 'AURA BLOCKCHAIN CONSORTIUM • ETERNAL DPP',
  bagName: 'Serpenti Forever Mini Top Handle Bag',
  collection: 'Serpenti Eternal • Emerald Calfskin Edition',
  retailPrice: '£5,200 / €6,100',
  serialId: '#BVL-SRP-2026-8841',
  liveBagAgePill: 'Crafted: Oct 2026 • Age: 1 Month (Mint Condition)',
  statusBadge: '100% AUTHENTICATED • AURA BLOCKCHAIN',
  owner: {
    displayName: 'Shreeta S.',
    encryptedToken: '#BVL-VIP-90421',
    gdprNotice: 'GDPR Protected • Zero-Knowledge Identity Vault',
    boutiqueOfOrigin: 'Bvlgari — Selfridges Exchange Square, Manchester',
    purchaseDateLabel: 'Purchased 25 October 2026',
    ageSummary: 'Age: 31 Days / 1 Month Old • 1st Registered Owner — Never Resold',
    ownershipLineage: '1st Registered Owner — Never Resold',
  },
  certificate: {
    certificateId: 'CERT-AURA-BVL-2026-8841',
    auraHashShort: '0x9f84c71a...88e31c',
    auraHashFull:
      '0x9f84c71a4d22b910e6318c77a502d44e19c3b8057a12e8f64d091177c288e31c',
    dualHardwareVerification:
      'NXP NTAG DNA NFC Chip in Serpenti Clasp + Avery Dennison Serialized Interior QR Tag',
    nfcChipId: 'NXP-DNA-04E2-8841-9A',
    qrTagId: 'AD-QR-BVL-2026-8841',
    network: 'Aura Blockchain Consortium Mainnet',
  },
  careSnapshot:
    '0 Structural Repairs • 1 Complimentary Conditioning • 100% Resale Condition Score',
  metrics: {
    structuralRepairs: 0,
    complimentaryConditionings: 1,
    resaleConditionScore: '100%',
  },
  originTiers: [
    {
      id: 'tier-3',
      tierLabel: 'TIER 3 • RAW LEATHER SOURCING',
      title: 'LWG Gold-Rated Italian Calfskin Tannery',
      facility: 'Conceria Val d’Arno S.p.A.',
      location: 'Tuscany, Italy',
      badgeText: 'Batch #IT-409',
      summary:
        'Full-grain European calfskin vegetable-retanned in closed-loop water recycling drums with chromium-free mineral finishing.',
      verifiedTimestamp: '2026-09-18 09:42:11 CET',
      batchCode: 'IT-409-CALF-EMR',
      certification: 'Leather Working Group (LWG) Gold Rated • ISO 14001',
      fairlyMadeAuditId: 'FM-TUS-2026-4091',
      auraAnchorHash: '0x41c8...92b1',
      artisanNote: 'Water recycling rate: 96% • Traceable hide lot certified.',
    },
    {
      id: 'tier-2',
      tierLabel: 'TIER 2 • HARDWARE CASTING',
      title: 'Gold-Plated Brass Serpenti Snakehead Clasp',
      facility: 'Bvlgari Gioielli Precision Foundry',
      location: 'Valenza, Italy',
      badgeText: 'NXP NTAG DNA Embedded',
      summary:
        'Lost-wax cast recycled brass sculpted into the signature Serpenti snakehead with hand-set malachite enamel scales and 18k champagne gold plating.',
      verifiedTimestamp: '2026-09-29 14:15:38 CET',
      batchCode: 'VLZ-HW-2026-118',
      certification: 'RJC Chain-of-Custody Certified Brass & Enamel',
      fairlyMadeAuditId: 'FM-VLZ-2026-1184',
      auraAnchorHash: '0x72b0...5d04',
      artisanNote:
        'Cryptographic NXP NTAG DNA silicon sealed inside clasp cavity prior to plating.',
    },
    {
      id: 'tier-1',
      tierLabel: 'TIER 1 • ARTISAN CRAFTSMANSHIP',
      title: 'Hand-Assembled in Florence Workshop',
      facility: 'Manifattura Bvlgari Pelletteria',
      location: 'Florence, Italy',
      badgeText: '42 Hours of Craftsmanship',
      summary:
        'Cut, skived, hand-edged with five coats of botanical resin, and stitched by a Master Maroquinerie Artisan with serialized Avery Dennison interior tag integration.',
      verifiedTimestamp: '2026-10-11 17:08:52 CET',
      batchCode: 'FLR-ATELIER-8841',
      certification: 'SA8000 Ethical Atelier • 100% Italian Craftsmanship',
      fairlyMadeAuditId: 'FM-FLR-2026-8841',
      auraAnchorHash: '0x9f84...88e31c',
      artisanNote:
        'Master Artisan Signature #MA-214 • Passed 38-point tension & clasp alignment QA.',
    },
  ],
  impactMetrics: [
    {
      id: 'traceability',
      label: 'Supply Chain Traceability',
      headlineValue: '100% Verified Tier 1–4',
      sublabel: 'Audited by Fairly Made® from raw hide farm & brass foundry to Florence atelier.',
      progressPercent: 100,
      barColor: 'emerald',
      policyReference: 'Bvlgari 2023 Environmental Policy • Pillar I (Full Provenance)',
    },
    {
      id: 'carbon',
      label: 'Carbon Footprint',
      headlineValue: '14.2 kg CO₂e',
      sublabel: 'Offset via LVMH Forestry Initiative (Verified Carbon Standard)',
      progressPercent: 86,
      barColor: 'gold',
      policyReference: 'Scope 1–3 Cradle-to-Boutique Ledger • Net-Zero Compensated',
    },
    {
      id: 'circularity',
      label: 'Circularity Score',
      headlineValue: '92% Recyclable Brass Hardware & Chrome-Free Lining',
      sublabel:
        'Modular Serpenti clasp assembly enables hardware refurbishment without structural leather loss.',
      progressPercent: 92,
      barColor: 'emerald',
      policyReference: 'Bvlgari Eternal Eco-Design Standard • 2026 Revision',
    },
  ],
  impactPolicyFooter:
    'Metrics audited against the Bvlgari 2023 Environmental Policy, LVMH LIFE 360 targets, and EU Digital Product Passport (ESPR) readiness guidelines.',
  logbookEntries: [
    {
      id: 'log-1',
      date: '25 Oct 2026',
      title: 'Initial Purchase & Aura Blockchain Passport Activation',
      location: 'Bvlgari Selfridges Manchester',
      category: 'activation',
      conditionGrade: 'Brand New / Mint',
      artisanOrAdvisor: 'Client Advisor: Matteo R. (#BVL-MCR-09)',
      notes:
        'Digital Product Passport minted on Aura Blockchain Consortium. Dual hardware pairing verified via NXP NTAG DNA clasp chip and interior Avery Dennison QR.',
      blockNumber: '#19,482,110',
      txHash: '0x9f84c71a...88e31c',
    },
    {
      id: 'log-2',
      date: '12 Nov 2026',
      title: 'Complimentary Protective Leather Conditioning & Clasp Check',
      location: 'Bvlgari Client Services',
      category: 'care',
      conditionGrade: 'Condition Grade: A+ / Mint',
      artisanOrAdvisor: 'Specialist: Elena V. (Leather Care Guild)',
      notes:
        'Beeswax & botanical emulsion protective treatment applied to emerald calfskin corners; Serpenti spring clasp torque calibrated to factory 4.2 N specification.',
      blockNumber: '#19,614,008',
      txHash: '0x3b12e90f...44d19a',
    },
  ],
  vipBoutique: {
    name: 'Bvlgari Selfridges Exchange Square, Manchester',
    address: '1 Exchange Square Central, Manchester M3 1BD, United Kingdom',
    conciergePhone: '+44 161 838 0650',
    hours: 'Mon–Sat 10:00–20:00 • Sun 11:30–18:00',
    services: [
      {
        id: 'vip-spa',
        title: 'Complimentary VIP Handbag Spa & Cleaning (£0)',
        priceLabel: '£0 • Complimentary VIP',
        duration: '45 mins',
        description:
          'Signature Bvlgari hydrating calfskin conditioning, hardware micro-polishing, and NFC clasp diagnostic at Selfridges Manchester.',
        highlightBadge: 'Included in Eternal DPP',
      },
      {
        id: 'artisan-repair',
        title: 'Official Artisan Leather & Clasp Repair',
        priceLabel: 'Complimentary Warranty / Quote',
        duration: '30 min Assessment',
        description:
          'Edge-paint restoration, lining care, or clasp tension calibration logged directly onto your immutable Aura Blockchain logbook.',
      },
      {
        id: 'eternal-trade-in',
        title:
          'Official Bvlgari Eternal Trade-In Valuation (Est. £3,650 credit based on 1-month age & Mint condition)',
        priceLabel: 'Est. £3,650 Credit',
        duration: '30 min Private Suite',
        description:
          'Instant boutique credit toward a new Bvlgari creation, backed by 100% Aura provenance & Grade A+ condition verification.',
        highlightBadge: '70.2% Value Retention',
      },
    ],
    availableDates: [
      'Thu 27 Nov',
      'Fri 28 Nov',
      'Sat 29 Nov',
      'Tue 02 Dec',
      'Thu 04 Dec',
    ],
    availableTimeSlots: ['10:30', '12:00', '14:30', '16:15', '17:45'],
  },
};
