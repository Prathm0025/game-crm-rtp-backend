import * as fs from 'fs';
import { randomBytes as nodeRandomBytes } from 'crypto';


export function bbsRNG(p: number, q: number, seed?: number): () => number {
  if (!isValidPrime(p) || !isValidPrime(q)) {
    throw new Error('Prime numbers must be congruent to 3 mod 4');
  }

  const n = p * q;
  let x: number;

  if (!seed) {
    const randomSeed = nodeRandomBytes(4); 
    seed = parseInt(randomSeed.toString('hex'), 16);
  }

  // Validate the seed
  if (!isValidSeed(seed)) {
    throw new Error('Invalid seed value');
  }

  // Initial state
  x = (seed * seed) % n;

  // Helper function to validate if a number is prime and congruent to 3 mod 4
  function isValidPrime(num: number): boolean {
    if (num <= 1 || num % 4 !== 3) {
      return false;
    }
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }

  // Helper function to validate if a seed value is valid
  function isValidSeed(seed: number): boolean {
    return seed > 0 && seed < n;
  }

  // Generate the next random bit
  function nextBit(): boolean {
    x = (x * x) % n;
    return (x % 2) === 1;
  }

  // Return a function that generates a random floating-point number between 0 and 1
  return function ():  {
    let value = 0;
    for (let i = 0; i < 32; i++) { // Collect 32 bits of randomness
      value = (value << 1) | (nextBit() ? 1 : 0);
    }
    return value / Math.pow(2, 32); // Normalize to a floating-point number between 0 and 1
  };
}


export function lcg(initialSeed: number): () => number {
  let seed = initialSeed >>> 0;
  const a = 1664525;
  const c = 1013904223;
  return () => {
    seed = (a * seed + c) >>> 0;
    return seed * (1.0 / 4294967296.0);
  };
}

export function xorshift(seed: number): () => number {
  return () => {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xFFFFFFFF;
  };
}

import { randomBytes } from 'crypto';
export function cryptoRNG(): () => number {
  return () => {
    const randomValue = parseInt(randomBytes(4).toString('hex'), 16);
    return randomValue / 0x100000000;
  };
}

type RNG = () => number;

interface RNGMetrics {
  frequency: number[];
  mean: number;
  variance: number;
  chiSquare: number;
  chiSquarePValue: number;
  uniformityScore: number;
}

export function evaluateRNG(
  rng: RNG,
  total: number,
  n: number,
  iterations: number
): RNGMetrics {
  const frequency = new Array(total).fill(0);
  const results: number[] = [];
  const csv: number[][] = []
  

  // Collect samples
  for (let i = 0; i < iterations; i++) {
    const numbers = getNNumbers(total, n, rng);
    csv.push(numbers)

    results.push(...numbers);
    for (const number of numbers) {
      frequency[number - 1]++;
    }
  }

  writeMultipleArraysToCSV("data.csv", csv)

  // Basic statistics
  const mean = results.reduce((sum, value) => sum + value, 0) / results.length;
  const variance = results.reduce((sum, value) => sum + (value - mean) ** 2, 0) / results.length;

  // Chi-square test
  const expectedFrequency = (iterations * n) / total;
  
  const chiSquare = frequency.reduce((sum, observed) => {
    const difference = observed - expectedFrequency;
    return sum + (difference * difference) / expectedFrequency;
  }, 0);

  // Calculate chi-square p-value (using Wilson–Hilferty approximation)
  const degreesOfFreedom = total - 1;
  const z = Math.sqrt(2 * chiSquare) - Math.sqrt(2 * degreesOfFreedom - 1);
  const chiSquarePValue = 1 - normalCDF(z);

  // Uniformity score (0 to 1, where 1 is perfect uniformity)
  const maxDeviation = Math.max(...frequency) - Math.min(...frequency);
  const worstPossibleDeviation = iterations * n;
  const uniformityScore = 1 - (maxDeviation / worstPossibleDeviation);
  return {
    frequency,
    mean,
    variance,
    chiSquare,
    chiSquarePValue,
    uniformityScore
  };
}

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

// Helper function for calculating normal CDF (using error function approximation)
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

// Error function approximation
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}


function writeMultipleArraysToCSV(filename: string, data: number[][]): void {  
  try {
    const csvContent = data.map(row => row.join(',')).join('\n');
    fs.writeFileSync(filename, csvContent);
    console.log(`Successfully wrote data to ${filename}`);
  } catch (error) {
    console.error('Error writing CSV file:', error);
    throw error;
  }
}
