/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Currency Utility Tests
 * Testing money formatting - critical for a banking app
 */

import {
  formatNumber,
  formatCurrency,
  formatCompactCurrency,
  parseCurrency,
  formatInputDisplay,
} from '../currency';

describe('formatNumber', () => {
  it('formats integers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(123456789)).toBe('123,456,789');
  });

  it('handles small numbers', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats with decimal places when specified', () => {
    expect(formatNumber(1234.56, 2)).toBe('1,234.56');
    expect(formatNumber(1000, 2)).toBe('1,000.00');
  });
});

describe('formatCurrency', () => {
  it('formats with RM symbol by default', () => {
    expect(formatCurrency(1234.56)).toBe('RM 1,234.56');
    expect(formatCurrency(0)).toBe('RM 0.00');
  });

  it('formats without symbol when specified', () => {
    expect(formatCurrency(1234.56, false)).toBe('1,234.56');
  });

  it('handles edge cases', () => {
    expect(formatCurrency(0.01)).toBe('RM 0.01');
    expect(formatCurrency(0.1)).toBe('RM 0.10');
    expect(formatCurrency(999999.99)).toBe('RM 999,999.99');
  });
});

describe('formatCompactCurrency', () => {
  it('formats thousands as K', () => {
    expect(formatCompactCurrency(1000)).toBe('RM 1.0K');
    expect(formatCompactCurrency(5500)).toBe('RM 5.5K');
    expect(formatCompactCurrency(999000)).toBe('RM 999.0K');
  });

  it('formats millions as M', () => {
    expect(formatCompactCurrency(1000000)).toBe('RM 1.0M');
    expect(formatCompactCurrency(2500000)).toBe('RM 2.5M');
  });

  it('keeps small numbers as-is', () => {
    expect(formatCompactCurrency(500)).toBe('RM 500.00');
    expect(formatCompactCurrency(999)).toBe('RM 999.00');
  });
});

describe('parseCurrency', () => {
  it('parses formatted currency strings', () => {
    expect(parseCurrency('RM 1,234.56')).toBe(1234.56);
    expect(parseCurrency('1,000.00')).toBe(1000);
    expect(parseCurrency('RM 0.50')).toBe(0.5);
  });

  it('handles edge cases', () => {
    expect(parseCurrency('')).toBe(0);
    expect(parseCurrency('abc')).toBe(0);
    expect(parseCurrency('RM')).toBe(0);
  });
});

describe('formatInputDisplay', () => {
  it('formats while user types', () => {
    expect(formatInputDisplay('1234')).toBe('1,234');
    expect(formatInputDisplay('1234567')).toBe('1,234,567');
  });

  it('preserves decimal input', () => {
    expect(formatInputDisplay('1234.5')).toBe('1,234.5');
    expect(formatInputDisplay('1234.56')).toBe('1,234.56');
  });

  it('preserves trailing dot for user input', () => {
    expect(formatInputDisplay('1234.')).toBe('1,234.');
  });

  it('handles empty and zero', () => {
    expect(formatInputDisplay('')).toBe('0');
    expect(formatInputDisplay('0')).toBe('0');
  });
});
