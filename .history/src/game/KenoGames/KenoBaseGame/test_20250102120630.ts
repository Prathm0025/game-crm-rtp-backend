//
// function lcg(seed: number): () => number {
//   const a = 1664525;
//   const c = 1013904223;
//   const m = Math.pow(2, 32);
//   return () => {
//     seed = (a * seed + c) % m;
//     return seed / m; // Returns a number between 0 and 1
//   };
// }
//
//
// const randomLCG = lcg(Date.now());
//
// function getNNumbers(total: number, n: number): number[] {
//   if (n > total) {
//     throw new Error('n cannot be greater than total');
//   }
//
//   const result: number[] = [];
//   const usedNumbers = new Set<number>();
//
//
//   while (result.length < n) {
//     for (let i = 0; i < n - result.length; i++) {
//       const number = Math.floor(randomLCG() * total) + 1;
//
//       if (!usedNumbers.has(number)) {
//         usedNumbers.add(number);
//         result.push(number);
//       }
//     }
//   }
//
//   return result;
// }
//
// export function evaluateRNG(total: number, n: number, iterations: number): { frequency: number[], mean: number, variance: number } {
//   const frequency = new Array(total).fill(0);
//   const results: number[] = [];
//
//   // Run the RNG multiple times
//   for (let i = 0; i < iterations; i++) {
//     const numbers = getNNumbers(total, n);
//     results.push(...numbers);
//
//     // Count frequency of each number
//     for (const number of numbers) {
//       frequency[number - 1]++; // Adjusting index since numbers are 1-indexed
//     }
//   }
//
//   // Calculate mean
//   const mean = results.reduce((sum, value) => sum + value, 0) / results.length;
//
//   // Calculate variance
//   const variance = results.reduce((sum, value) => sum + (value - mean) ** 2, 0) / results.length;
//
//   return {
//     frequency,
//     mean,
//     variance,
//   };
// }
//
//
//
//
export function middleSquare(seed: number): () => number {
  return () => {
    const square = (seed ** 2).toString().padStart(8, '0');
    seed = parseInt(square.slice(2, 6), 10);
    return seed / 10000; // Returns a number between 0 and 1
  };
}

export function lcg(seed: number): () => number {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  return () => {
    seed = (a * seed + c) % m;
    return seed / m; // Returns a number between 0 and 1
  };
}
export function xorshift(seed: number): () => number {
  return () => {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xFFFFFFFF; // Returns a number between 0 and 1
  };
}

import { randomBytes } from 'crypto';

export function cryptoRNG(): () => number {
  return () => {
    const randomValue = parseInt(randomBytes(4).toString('hex'), 16);
    return randomValue / 0x100000000; // Normalize to [0, 1)
  };
}

type RNG = () => number;
export function evaluateRNG(
  rng: RNG,
  total: number,
  n: number,
  iterations: number
): {
  frequency: number[];
  expectedFrequency: number[];
  mean: number;
  variance: number;
  chiSquare: number;
  uniformity: boolean;
} {
  const frequency = new Array(total).fill(0);
  const expectedFrequency = new Array(total).fill((iterations * n) / total);
  const results: number[] = [];

  // Generate numbers and record frequencies
  for (let i = 0; i < iterations; i++) {
    const numbers = getNNumbers(total, n, rng);
    results.push(...numbers);

    for (const number of numbers) {
      frequency[number - 1]++;
    }
  }

  // Calculate mean and variance
  const mean = results.reduce((sum, value) => sum + value, 0) / results.length;
  const variance =
    results.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    results.length;

  // Perform Chi-Square Test
  const expectedFreq = (iterations * n) / total;
  let chiSquare = 0;

  for (const observed of frequency) {
    chiSquare += Math.pow(observed - expectedFreq, 2) / expectedFreq;
  }

  // Chi-Square critical value for degrees of freedom = total - 1 at α = 0.05
  const criticalValue = chiSquareCriticalValues[total - 1]; // Ensure the table covers this range
  const uniformity = chiSquare <= criticalValue;

  return { frequency, expectedFrequency, mean, variance, chiSquare, uniformity };
}

// Helper function to generate unique numbers
function getNNumbers(total: number, n: number, rng: RNG): number[] {
  if (n > total) {
    throw new Error('n cannot be greater than total');
  }

  const result: number[] = [];
  const usedNumbers = new Set<number>();

  while (result.length < n) {
    const number = Math.floor(rng() * total) + 1;

    if (!usedNumbers.has(number)) {
      usedNumbers.add(number);
      result.push(number);
    }
  }

  return result;
}



// Chi-Square critical values for α = 0.05
const chiSquareCriticalValues = {
  1: 3.841,
  2: 5.991,
  3: 7.815,
  4: 9.488,
  5: 11.070,
  6: 12.592,
  7: 14.067,
  8: 15.507,
  9: 16.919,
  10: 18.307,
  11: 19.675,
  12: 21.026,
  13: 22.362,
  14: 23.685,
  15: 24.996,
  16: 26.296,
  17: 27.587,
  18: 28.869,
  19: 30.144,
  20: 31.410,
  21: 32.671,
  22: 33.924,
  23: 35.172,
  24: 36.415,
  25: 37.652,
  26: 38.885,
  27: 40.113,
  28: 41.337,
  29: 42.557,
  30: 43.773,
  31: 44.985,
  32: 46.194,
  33: 47.400,
  34: 48.602,
  35: 49.802,
  36: 50.998,
  37: 52.192,
  38: 53.384,
  39: 54.572,
  40: 55.758,
  41: 56.942,
  42: 58.124,
  43: 59.303,
  44: 60.481,
  45: 61.656,
  46: 62.830,
  47: 64.001,
  48: 65.171,
  49: 66.339,
  50: 67.505,
  51: 68.669,
  52: 69.832,
  53: 70.993,
  54: 72.153,
  55: 73.311,
  56: 74.468,
  57: 75.624,
  58: 76.778,
  59: 77.931,
  60: 79.082,
  61: 80.232,
  62: 81.381,
  63: 82.529,
  64: 83.675,
  65: 84.821,
  66: 85.965,
  67: 87.108,
  68: 88.250,
  69: 89.391,
  70: 90.531,
  71: 91.670,
  72: 92.808,
  73: 93.945,
  74: 95.081,
  75: 96.217,
  76: 97.351,
  77: 98.484,
  78: 99.617,
  79: 100.749,
  80: 101.879,
};

