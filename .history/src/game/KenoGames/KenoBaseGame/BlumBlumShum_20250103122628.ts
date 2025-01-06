import { randomBytes as nodeRandomBytes } from 'crypto';

/**
 * Function to create and use the BBS Random Generator.
 * 
 * @param {number} p - First prime number (must be congruent to 3 mod 4)
 * @param {number} q - Second prime number (must be congruent to 3 mod 4)
 * @param {number} [seed] - Optional seed value. If not provided, a secure random seed will be generated
 * @returns {object} An object containing methods to generate random bits and numbers
 */
export function createBBSRandomGenerator(p: number, q: number, seed?: number) {
    let n = p * q; // Product of primes p and q
    let x: number; // Current state
    const maxBits = 1024; // Maximum bits to generate at once

    // Check if the primes are valid
    if (!isValidPrime(p) || !isValidPrime(q)) {
        throw new Error('Prime numbers must be congruent to 3 mod 4');
    }

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

    // Validate if a number is prime and congruent to 3 mod 4
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

    // Validate if a seed value is valid
    function isValidSeed(seed: number): boolean {
        return seed > 0 && seed < n;
    }

    // Generate the next random bit
    function nextBit(): boolean {
        x = (x * x) % n;
        return (x % 2) === 1;
    }

    // Generate an array of random bits
    function generateBits(length: number): boolean[] {
        if (length <= 0 || length > maxBits) {
            throw new Error('Bit length must be between 1 and 1024');
        }

        const bits: boolean[] = [];
        for (let i = 0; i < length; i++) {
            bits.push(nextBit());
        }
        return bits;
    }

    // Generate a random number within a specified range
    function generateNumber(min: number, max: number): number {
        if (min >= max) {
            throw new Error('Invalid range: min must be less than max');
        }

        const range = max - min + 1;
        const bitsNeeded = Math.ceil(Math.log2(range));
        const maxValue = 2 ** bitsNeeded - 1;

        while (true) {
            const bits = generateBits(bitsNeeded);
            let value = 0;

            for (let i = 0; i < bits.length; i++) {
                if (bits[i]) {
                    value |= (1 << i);
                }
            }

            if (value <= maxValue - (maxValue % range)) {
                return min + (value % range);
            }
        }
    }

    // Reseed the generator with a new seed value
    function reseed(newSeed: number): void {
        if (!isValidSeed(newSeed)) {
            throw new Error('Invalid seed value');
        }
        x = (newSeed * newSeed) % n;
    }

    return {
        generateNumber,
        generateBits,
        reseed
    };
}

// Example usage
const p = 11; // Replace with a larger prime congruent to 3 mod 4
const q = 19; // Replace with a larger prime congruent to 3 mod 4
const seed = 7;

const bbsGenerator = createBBSRandomGenerator(p, q, seed);

const randomNum = bbsGenerator.generateNumber(1, 100);
console.log(randomNum); // Example: Generates a random number between 1 and 100
