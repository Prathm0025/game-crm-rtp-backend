import { randomBytes as nodeRandomBytes } from 'crypto';

class BBSRandomGenerator {
    n: number; // Product of primes p and q
    x: number; // Current state
    maxBits: number = 1024; // Maximum bits to generate at once

    constructor(p: number, q: number, seed?: number) {
        if (!this.isValidPrime(p) || !this.isValidPrime(q)) {
            throw new Error('Prime numbers must be congruent to 3 mod 4');
        }

        this.n = p * q;

        // Generate secure random seed if none provided
        if (!seed) {
            const randomSeed = nodeRandomBytes(4); // Use 4 bytes to stay within safe integer range
            seed = parseInt(randomSeed.toString('hex'), 16);
        }

        // Validate and set initial state
        if (!this.isValidSeed(seed)) {
            throw new Error('Invalid seed value');
        }

        this.x = (seed * seed) % this.n;
    }

    isValidPrime(num: number): boolean {
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

    isValidSeed(seed: number): boolean {
        return seed > 0 && seed < this.n;
    }

    nextBit(): boolean {
        this.x = (this.x * this.x) % this.n;
        return (this.x % 2) === 1;
    }

    generateBits(length: number): boolean[] {
        if (length <= 0 || length > this.maxBits) {
            throw new Error('Bit length must be between 1 and 1024');
        }

        const bits: boolean[] = [];
        for (let i = 0; i < length; i++) {
            bits.push(this.nextBit());
        }
        return bits;
    }

    generateNumber(min: number, max: number): number {
        if (min >= max) {
            throw new Error('Invalid range: min must be less than max');
        }

        const range = max - min + 1;
        const bitsNeeded = Math.ceil(Math.log2(range));
        const maxValue = 2 ** bitsNeeded - 1;

        while (true) {
            const bits = this.generateBits(bitsNeeded);
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

    reseed(seed: number): void {
        if (!this.isValidSeed(seed)) {
            throw new Error('Invalid seed value');
        }
        this.x = (seed * seed) % this.n;
    }
}

export default BBSRandomGenerator;
