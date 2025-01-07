import * as fs from 'fs';

/**
 * Linear Congruential Generator (LCG) function
 * @param {number} initialSeed - The initial seed value
 * @returns {() => number} - A function that generates a pseudo-random number
 */
export function lcg(initialSeed: number): () => number {
  let seed = initialSeed >>> 0;
  const a = 1664525;
  const c = 1013904223;
  return () => {
    seed = (a * seed + c) >>> 0;
    return seed * (1.0 / 4294967296.0);
  };
}

/**
 * Xorshift random number generator function
 * @param {number} seed - The initial seed value
 * @returns {() => number} - A function that generates a pseudo-random number
 */
export function xorshift(seed: number): () => number {
  return () => {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xFFFFFFFF;
  };
}

import { randomBytes } from 'crypto';

/**
 * Cryptographically secure random number generator function
 * @returns {() => number} - A function that generates a pseudo-random number
 */
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

/**
 * Function to evaluate the quality of a random number generator
 * @param {RNG} rng - The random number generator function
 * @param {number} total - The total number of possible values
 * @param {number} n - The number of values to generate per iteration
 * @param {number} iterations - The number of iterations to perform
 * @returns {RNGMetrics} - The metrics evaluating the RNG quality
 */
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

/**
 * Function to generate an array of unique random numbers
 * @param {number} total - The total number of possible values
 * @param {number} n - The number of values to generate
 * @param {RNG} rng - The random number generator function
 * @returns {number[]} - An array of unique random numbers
 */
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

/**
 * Helper function for calculating normal CDF (using error function approximation)
 * @param {number} x - The value to calculate the CDF for
 * @returns {number} - The CDF value
 */
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

/**
 * Error function approximation
 * @param {number} x - The value to calculate the error function for
 * @returns {number} - The error function value
 */
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

/**
 * Function to write multiple arrays to a CSV file
 * @param {string} filename - The name of the CSV file
 * @param {number[][]} data - The data to write to the CSV file
 */
export function writeMultipleArraysToCSV(filename: string, data: number[][]): void {
  try {
    const csvContent = data.map(row => row.join(',')).join('\n');
    fs.writeFileSync(filename, csvContent);
    console.log(`Successfully wrote data to ${filename}`);
  } catch (error) {
    console.error('Error writing CSV file:', error);
    throw error;
  }
}

/**
 * Function to write an array to a CSV file
 * @param {string} filename - The name of the CSV file
 * @param {number[]} data - The data to write to the CSV file
 */
export function writeArrayToCSV(filename: string, data: number[]): void {
  try {
    let csvContent = "";
    data.forEach(row => {
      csvContent += row + ","
    })
    fs.writeFileSync(filename, csvContent);
    console.log(`Successfully wrote data to ${filename}`);
  } catch (error) {
    console.error('Error writing CSV file:', error);
    throw error;
  }
}
