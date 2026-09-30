import { describe, it, expect } from 'vitest';
import { calculateModel } from './model.js';

describe('calculateModel', () => {
  it('matches the default known benchmark at 1500 ha and 40 t/ha', () => {
    const result = calculateModel({
      areaHa: 1500,
      applicationRate: 40,
      creditablePerT: 0.2,
      discount: 0.2,
      rockPricePerT: 23,
      mrvCostPerHa: 480,
      fixedMrvCost: 30000,
      creditPrice: 60
    });

    expect(result.basaltTonnes).toBeCloseTo(60000, 5);
    expect(result.credits).toBeCloseTo(9600, 5);
    expect(result.costPerCredit).toBeCloseTo(222.87, 0);
  });

  it('matches the second benchmark at 20.8 t/ha', () => {
    const result = calculateModel({
      areaHa: 1500,
      applicationRate: 20.8,
      creditablePerT: 0.2,
      discount: 0.2,
      rockPricePerT: 23,
      mrvCostPerHa: 480,
      fixedMrvCost: 30000,
      creditPrice: 60
    });

    expect(result.basaltTonnes).toBeCloseTo(31200, 5);
    expect(result.credits).toBeCloseTo(4992, 5);
    expect(result.costPerCredit).toBeCloseTo(294.0, 0);
  });

  it('matches the MRV benchmark at 40 t/ha and 240 €/ha', () => {
    const result = calculateModel({
      areaHa: 1500,
      applicationRate: 40,
      creditablePerT: 0.2,
      discount: 0.2,
      rockPricePerT: 23,
      mrvCostPerHa: 240,
      fixedMrvCost: 30000,
      creditPrice: 60
    });

    expect(result.costPerCredit).toBeCloseTo(184.37, 1);
  });

  it('reports break-even area and the no-break-even case', () => {
    const profitable = calculateModel({
      areaHa: 1500,
      applicationRate: 40,
      creditablePerT: 0.2,
      discount: 0.2,
      rockPricePerT: 23,
      mrvCostPerHa: 480,
      fixedMrvCost: 30000,
      creditPrice: 60
    });

    expect(profitable.breakEvenArea).not.toBeNull();
    expect(profitable.breakEvenArea).toBeGreaterThan(0);

    const losing = calculateModel({
      areaHa: 1500,
      applicationRate: 5,
      creditablePerT: 0.2,
      discount: 0.2,
      rockPricePerT: 23,
      mrvCostPerHa: 480,
      fixedMrvCost: 30000,
      creditPrice: 60
    });

    expect(losing.alwaysLoss).toBe(true);
  });

  it('handles edge cases', () => {
    expect(calculateModel({ areaHa: 0, applicationRate: 40 }).basaltTonnes).toBe(0);
    expect(calculateModel({ areaHa: 1500, applicationRate: 0 }).credits).toBe(0);
    expect(calculateModel({ areaHa: 1500, applicationRate: 40, discount: 0.99 }).credits).toBeLessThan(120);
    expect(calculateModel({}).credits).toBe(0);
    expect(calculateModel({ areaHa: -10, applicationRate: -10 }).basaltTonnes).toBe(0);
    expect(calculateModel({ areaHa: 1500, applicationRate: 40, rockPricePerT: 100 }).costPerCredit).toBeGreaterThan(0);
  });

  it('supports custom price scenarios', () => {
    const result = calculateModel({
      areaHa: 1500,
      applicationRate: 40,
      creditablePerT: 0.2,
      discount: 0.2,
      rockPricePerT: 23,
      mrvCostPerHa: 480,
      fixedMrvCost: 30000,
      creditPrice: 100
    });

    expect(result.netMargin).toBeGreaterThan(0);
  });
});
