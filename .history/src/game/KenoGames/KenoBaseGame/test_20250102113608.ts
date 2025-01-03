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

export function evaluateRNGUniformity(
  rng: RNG,
  total: number,
  iterations: number
): {
  chiSquare: number;
  uniformity: boolean;
} {
  const frequency = new Array(total).fill(0);

  // Generate numbers and count occurrences
  for (let i = 0; i < iterations; i++) {
    const number = Math.floor(rng() * total);
    frequency[number]++;
  }

  // Calculate expected frequency for uniform distribution
  const expectedFrequency = iterations / total;

  // Calculate Chi-Square statistic
  let chiSquare = 0;
  for (const observed of frequency) {
    chiSquare += Math.pow(observed - expectedFrequency, 2) / expectedFrequency;
  }

  // Chi-Square critical value for df = total - 1 at α = 0.05
  const criticalValue = chiSquareCriticalValues[total - 1]; // Adjust for degrees of freedom
  const uniformity = chiSquare <= criticalValue;

  return { chiSquare, uniformity , expectedFrequency, fre};
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
  // Extend as needed
};


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
