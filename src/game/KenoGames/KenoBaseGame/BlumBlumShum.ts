//
//
// import { randomBytes } from 'crypto';
//
// /**
//  * Implementation of the Blum-Blum-Shub (BBS) pseudorandom number generator.
//  * This generator is cryptographically secure when properly initialized with
//  * appropriate prime numbers and seed value.
//  */
// class BBSRandomGenerator {
//     private readonly n: bigint;  // Product of primes p and q
//     private x: bigint;          // Current state
//     private readonly maxBits: number = 1024; // Maximum bits to generate at once
//
//     /**
//      * Creates a new instance of the BBS random number generator.
//      * 
//      * @param p - First prime number (must be congruent to 3 mod 4)
//      * @param q - Second prime number (must be congruent to 3 mod 4)
//      * @param seed - Optional seed value. If not provided, a secure random seed will be generated
//      * @throws Error if the input parameters are invalid
//      */
//     constructor(p: bigint, q: bigint, seed?: bigint) {
//         if (!this.isValidPrime(p) || !this.isValidPrime(q)) {
//             throw new Error('Prime numbers must be congruent to 3 mod 4');
//         }
//
//         this.n = p * q;
//
//         // Generate secure random seed if none provided
//         if (!seed) {
//             const randomSeed = randomBytes(32);
//             seed = BigInt('0x' + randomSeed.toString('hex'));
//         }
//
//         // Validate and set initial state
//         if (!this.isValidSeed(seed)) {
//             throw new Error('Invalid seed value');
//         }
//
//         this.x = (seed * seed) % this.n;
//     }
//
//     /**
//      * Validates if a number is prime and congruent to 3 mod 4
//      * Note: This is a basic primality test. For production use,
//      * implement a more robust primality test like Miller-Rabin
//      */
//     private isValidPrime(num: bigint): boolean {
//         if (num <= 1n || num % 4n !== 3n) {
//             return false;
//         }
//
//         for (let i = 2n; i * i <= num; i++) {
//             if (num % i === 0n) {
//                 return false;
//             }
//         }
//         return true;
//     }
//
//     /**
//      * Validates if a seed value is appropriate for use
//      * @param seed - The seed value to validate
//      */
//     private isValidSeed(seed: bigint): boolean {
//         return seed > 0n && seed < this.n;
//     }
//
//     /**
//      * Generates the next random bit in the sequence
//      * @returns A boolean representing the least significant bit
//      */
//     public nextBit(): boolean {
//         this.x = (this.x * this.x) % this.n;
//         return (this.x % 2n) === 1n;
//     }
//
//     /**
//      * Generates an array of random bits
//      * @param length - Number of bits to generate (must be > 0 and <= maxBits)
//      * @returns Array of boolean values representing random bits
//      * @throws Error if length is invalid
//      */
//     public generateBits(length: number): boolean[] {
//         if (length <= 0 || length > this.maxBits) {
//             throw new Error(`Bit length must be between 1 and ${this.maxBits}`);
//         }
//
//         const bits: boolean[] = new Array(length);
//         for (let i = 0; i < length; i++) {
//             bits[i] = this.nextBit();
//         }
//         return bits;
//     }
//
//     /**
//      * Generates a random number within a specified range
//      * @param min - Minimum value (inclusive)
//      * @param max - Maximum value (inclusive)
//      * @returns Random number within the specified range
//      * @throws Error if range is invalid
//      */
//     public generateNumber(min: number, max: number): number {
//         if (min >= max) {
//             throw new Error('Invalid range: min must be less than max');
//         }
//
//         const range = max - min + 1;
//         const bitsNeeded = Math.ceil(Math.log2(range));
//         const maxValue = 2 ** bitsNeeded - 1;
//
//         while (true) {
//             const bits = this.generateBits(bitsNeeded);
//             let value = 0;
//
//             for (let i = 0; i < bits.length; i++) {
//                 if (bits[i]) {
//                     value |= (1 << i);
//                 }
//             }
//
//             if (value <= maxValue - (maxValue % range)) {
//                 return min + (value % range);
//             }
//         }
//     }
//
//     /**
//      * Resets the generator with a new seed value
//      * @param seed - New seed value
//      * @throws Error if seed is invalid
//      */
//     public reseed(seed: bigint): void {
//         if (!this.isValidSeed(seed)) {
//             throw new Error('Invalid seed value');
//         }
//         this.x = (seed * seed) % this.n;
//     }
// }
//
// export default BBSRandomGenerator;
