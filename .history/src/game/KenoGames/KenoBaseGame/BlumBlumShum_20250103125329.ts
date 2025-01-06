import { randomBytes as nodeRandomBytes } from 'crypto';

/**
 * Creates a Blum-Blum-Shub (BBS) random number generator function.
 * 
 * @param {number} p - First prime number (must be congruent to 3 mod 4)
 * @param {number} q - Second prime number (must be congruent to 3 mod 4)
 * @param {number} [seed] - Optional seed value. If not provided, a secure random seed will be generated
 * @returns {() => number} - A function that returns a random number between 0 and 1 when called
 */
export function bbsRNG(p: number, q: number, seed?: number): () => number {
  if (!isValidPrime(p) || !isValidPrime(q)) {
    throw new Error('Prime numbers must be congruent to 3 mod 4');
  }

  const n = p * q;
  let x: number; // Current state

  // Generate secure random seed if none provided
  if (!seed) {
    const randomSeed = nodeRandomBytes(4); // Use 4 bytes to stay within safe integer range
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
console.log();

  // Return a function that generates a random number between 0 and 1
  return function (): number {
    const bit = nextBit(); // Get the next bit (either 0 or 1)
    return bit ? 1 : 0; // Convert boolean to number (1 for true, 0 for false)
  };
}
