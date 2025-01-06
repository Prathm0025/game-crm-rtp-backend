// Function to calculate factorial
function factorial(n: number): number {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

// Function to calculate combinations (n choose k)
function combinations(n: number, k: number): number {
    if (k < 0 || k > n) {
        return 0;
    }
    return factorial(n) / (factorial(k) * factorial(n - k));
}

// Function to calculate hypergeometric probability
function hypergeometric(N: number, K: number, n: number, k: number): number {
    const combinationsSuccess = combinations(K, k); // Ways to choose k successes
    const combinationsFailure = combinations(N - K, n - k); // Ways to choose the rest
    const totalCombinations = combinations(N, n); // Total ways to choose n items from N

    return (combinationsSuccess * combinationsFailure) / totalCombinations;
}

// Function to calculate RTP (Return to Player)
export function calculateRTP(N: number, K: number, n: number, payouts: number[]): number {
    let totalExpectedReturn = 0;

    // Calculate expected value for each possible outcome (matching k numbers)
    for (let k = 0; k <= K; k++) {
        const probability = hypergeometric(N, K, n, k);
        console.log(probability, "hypergeometric probability");
        
        totalExpectedReturn += probability * payouts[k];
    }

   
    return totalExpectedReturn * 100; 
}

// Example Game Setup:
const N = 80;  // Total numbers in the pool
const K = 10;  // Numbers selected by the player
const n = 20;  // Numbers drawn

// Example payout table (for 0 to 10 matching numbers)
const payouts = [
    0,  // 0 matches
    0,  // 1 match
    1,  // 2 matches
    2,  // 3 matches
    3, // 4 matches
    4, // 5 matches
    5, // 6 matches
    6, // 7 matches
    6.5, // 8 matches
    7, // 9 matches
    7.5, // 10 matches
];

const rtp = calculateRTP(N, K, n, payouts);
console.log(`The RTP of the game is: ${rtp.toFixed(2)}%`);
