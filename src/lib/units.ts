import { useCallback } from 'react';

import { Currency, Units, useStore } from './store';

const num = (s: string) => parseFloat(s.replace(',', '.'));
const round = (n: number) => (n >= 20 ? Math.round(n / 5) * 5 : n >= 4 ? Math.round(n) : Math.round(n * 2) / 2);

/**
 * Converts metric amounts written in guide/app text ("15 cm", "10–15 cm", "2.5–5 kg") to
 * imperial. Percentages of bodyweight are left alone. Metric text is returned unchanged.
 */
export function localize(text: string, units: Units): string {
  if (units === 'metric' || !text) return text;
  return text
    .replace(/(\d+(?:[.,]\d+)?)(?:\s?[–-]\s?(\d+(?:[.,]\d+)?))?\s?cm\b/g, (_, a: string, b?: string) => {
      const x = round(num(a) / 2.54);
      return b ? `${x}–${round(num(b) / 2.54)} in` : `${x} in`;
    })
    .replace(/(\d+(?:[.,]\d+)?)(?:\s?[–-]\s?(\d+(?:[.,]\d+)?))?\s?kg\b/g, (_, a: string, b?: string) => {
      const x = round(num(a) * 2.2);
      return b ? `${x}–${round(num(b) * 2.2)} lb` : `${x} lb`;
    });
}

/** Rough local price for a USD amount (equipment tips only — not exact). */
const RATE: Record<Currency, { rate: number; fmt: (n: number) => string }> = {
  USD: { rate: 1, fmt: (n) => `$${n}` },
  EUR: { rate: 0.9, fmt: (n) => `€${n}` },
  GBP: { rate: 0.8, fmt: (n) => `£${n}` },
  SEK: { rate: 10, fmt: (n) => `${n} kr` },
};

export function price(usd: number, currency: Currency): string {
  const r = RATE[currency];
  const v = usd * r.rate;
  return r.fmt(v >= 100 ? Math.round(v / 50) * 50 : Math.round(v / 5) * 5);
}

/** `const u = useUnits(); u('Box ≈45 cm')` → "Box ≈18 in" for imperial users. */
export function useUnits() {
  const { state } = useStore();
  const units = state.settings.units;
  return useCallback((text: string) => localize(text, units), [units]);
}

export function usePrice() {
  const { state } = useStore();
  const currency = state.settings.currency;
  return useCallback((usd: number) => price(usd, currency), [currency]);
}
