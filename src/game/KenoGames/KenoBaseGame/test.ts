import { getNNumbers } from "./helper";

export function evaluateRNG(total: number, n: number, iterations: number): { frequency: number[], mean: number, variance: number } {
  const frequency = new Array(total).fill(0);
  const results: number[] = [];

  // Run the RNG multiple times
  for (let i = 0; i < iterations; i++) {
    const numbers = getNNumbers(total, n);
    results.push(...numbers);

    // Count frequency of each number
    for (const number of numbers) {
      frequency[number - 1]++; // Adjusting index since numbers are 1-indexed
    }
  }

  // Calculate mean
  const mean = results.reduce((sum, value) => sum + value, 0) / results.length;

  // Calculate variance
  const variance = results.reduce((sum, value) => sum + (value - mean) ** 2, 0) / results.length;

  return {
    frequency,
    mean,
    variance,
  };
}


