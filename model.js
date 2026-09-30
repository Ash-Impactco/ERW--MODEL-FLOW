export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

export function calculateModel(input = {}) {
  const areaHa = Math.max(0, toNumber(input.areaHa, 0));
  const applicationRate = Math.max(0, toNumber(input.applicationRate, 0));
  const creditablePerT = Math.max(0, toNumber(input.creditablePerT, 0.2));
  const discount = Math.max(0, Math.min(0.99, toNumber(input.discount, 0.2)));
  const rockPricePerT = Math.max(0, toNumber(input.rockPricePerT, 23));
  const mrvCostPerHa = Math.max(0, toNumber(input.mrvCostPerHa, 480));
  const fixedMrvCost = Math.max(0, toNumber(input.fixedMrvCost, 30000));
  const creditPrice = Math.max(0, toNumber(input.creditPrice, 60));

  const basaltTonnes = areaHa * applicationRate;
  const realisedCreditsPerTonne = creditablePerT * (1 - discount);
  const credits = Math.max(0, basaltTonnes * realisedCreditsPerTonne);

  const rockCost = basaltTonnes * rockPricePerT;
  const mrvCost = areaHa * mrvCostPerHa + fixedMrvCost;
  const totalCost = rockCost + mrvCost;
  const costPerCredit = credits > 0 ? totalCost / credits : 0;
  const revenue = credits * creditPrice;
  const netMargin = revenue - totalCost;

  const creditsPerHa = applicationRate * realisedCreditsPerTonne;
  const totalCostPerHa = applicationRate * rockPricePerT + mrvCostPerHa + fixedMrvCost / areaHa;
  const variableCostPerCredit = creditsPerHa > 0 ? totalCostPerHa / creditsPerHa : Number.POSITIVE_INFINITY;
  const breakEvenArea = creditPrice > 0 && Number.isFinite(variableCostPerCredit) && variableCostPerCredit < creditPrice
    ? fixedMrvCost / (creditPrice - variableCostPerCredit)
    : null;

  return {
    areaHa,
    applicationRate,
    creditablePerT,
    discount,
    rockPricePerT,
    mrvCostPerHa,
    fixedMrvCost,
    creditPrice,
    basaltTonnes,
    realisedCreditsPerTonne,
    credits,
    rockCost,
    mrvCost,
    totalCost,
    costPerCredit,
    revenue,
    netMargin,
    creditsPerHa,
    variableCostPerCredit,
    breakEvenArea,
    alwaysLoss: creditPrice <= variableCostPerCredit || !Number.isFinite(breakEvenArea)
  };
}
