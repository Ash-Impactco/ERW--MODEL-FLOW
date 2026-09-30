export const PUBLIC_MODE = (() => {
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('public') === '1' || params.get('mode') === 'public') {
      return true;
    }
  }

  if (typeof process !== 'undefined' && process.env && process.env.PUBLIC_MODE === '1') {
    return true;
  }

  return false;
})();

export function sanitizePublicText(value = '') {
  if (!PUBLIC_MODE) {
    return value;
  }

  return String(value)
    .replace(/\bprivate\b/gi, 'public')
    .replace(/\bowner\b/gi, 'lead')
    .replace(/\bindividual\b/gi, 'person')
    .replace(/\bperson\b/gi, 'team member');
}

export const defaultInputs = {
  areaHa: 1500,
  applicationRate: 40,
  creditablePerT: 0.2,
  discount: 0.2,
  rockPricePerT: 23,
  mrvCostPerHa: 480,
  fixedMrvCost: 30000,
  creditPrice: 60,
  projectSentenceOne: 'Sustainable ERW deployment on acidic dairy pasture in the Azores.',
  projectSentenceTwo: 'Basalt fines spread to accelerate weathering and long-term carbon storage.',
  projectSentenceThree: 'Early-stage screening for a compliant, measurable carbon removal pathway.'
};

export const presetScenarios = {
  baseline: {
    label: 'Baseline',
    values: { ...defaultInputs }
  },
  reducedRate: {
    label: 'Reduced rate',
    values: {
      ...defaultInputs,
      areaHa: 1500,
      applicationRate: 20.8
    }
  },
  lowerMrv: {
    label: 'Lower MRV',
    values: {
      ...defaultInputs,
      mrvCostPerHa: 240
    }
  }
};

export const stakeholderFilters = [
  { id: 'all', label: 'All stakeholders' },
  { id: 'farmer', label: 'Farmer' },
  { id: 'investor', label: 'Investor' },
  { id: 'regulator', label: 'Regulator' },
  { id: 'research', label: 'Research' }
];

export const phaseData = [
  {
    id: 'scoping',
    title: 'Scoping',
    detail: 'Map land, basalt source and application window.'
  },
  {
    id: 'field',
    title: 'Field activity',
    detail: 'Apply fines and log application rates across paddocks.'
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    detail: 'Track weathering, soil conditions and carbon evidence.'
  }
];

export const mindMapNodes = [
  'Basalt quarry',
  'Farm spread',
  'Soil weathering',
  'MRV evidence',
  'Carbon credits'
];

export function getPublicCopy(copy) {
  return sanitizePublicText(copy);
}
