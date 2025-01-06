// Function to calculate factorial
function factorial(n: number): number {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

// Function to calculate combinations (n choose k)
function combinations(n: number, k: number): number {
    if (k < 0 || k > n) return 0;
    return factorial(n) / (factorial(k) * factorial(n - k));
}

// Function to calculate hypergeometric probability
export function hypergeometric(N: number, K: number, n: number, k: number): number {
    const combinationsSuccess = combinations(K, k);
    const combinationsFailure = combinations(N - K, n - k);
    const totalCombinations = combinations(N, n);

    return (combinationsSuccess * combinationsFailure) / totalCombinations;
}

// Function to calculate RTP (Return to Player) for a specific pick size
export function calculateRTP(N: number, K: number, n: number, payouts: number[]): number {
    let totalExpectedReturn = 0;

    for (let k = 0; k <= K; k++) {
        const probability = hypergeometric(N, K, n, k);
        totalExpectedReturn += probability * payouts[k];
    }

    return totalExpectedReturn * 100; // RTP as a percentage
}

// Function to generate paytables and calculate RTPs for each pick size
export function generatePaytables(
    N: number,
    n: number,
    maxPicks: number,
    payoutMultiplier: (k: number, picks: number) => number
) {
    const paytables: { [key: number]: { match: number; payout: number; probability: number }[] } = {};
    const rtps: { [key: number]: number } = {};

    for (let picks = 1; picks <= maxPicks; picks++) {
        const paytable: { match: number; payout: number; probability: number }[] = [];
        let totalExpectedReturn = 0;

        for (let match = 0; match <= picks; match++) {
            const probability = hypergeometric(N, picks, n, match);
            const payout = payoutMultiplier(match, picks); // Use multiplier-based payouts
            totalExpectedReturn += probability * payout;

            paytable.push({ match, payout, probability });
        }

        paytables[picks] = paytable;
        rtps[picks] = totalExpectedReturn * 100; // RTP as a percentage
    }

    // Calculate overall RTP
    const overallRTP = Object.values(rtps).reduce((sum, rtp) => sum + rtp, 0) / maxPicks;

    return { paytables, rtps, overallRTP };
}

// Example multiplier function for realistic keno payouts
export function examplePayoutMultiplier(match: number, picks: number): number {
    const baseMultiplier = Math.pow(2, match); // Exponentially increase multiplier based on matches
    const scalingFactor = 0.76; // Slightly adjusted scaling factor to keep payouts reasonable

    // Adjusted multiplier to keep payouts in a balanced range
    const adjustedMultiplier = match === 0 ? 0 : baseMultiplier * scalingFactor / (picks / 2);

    // Ensure multiplier isn't too small, providing reasonable payouts
    return Math.max(adjustedMultiplier, 0);
}




// Example usage
const N = 80; // Total numbers
const n = 20; // Numbers drawn
const maxPicks = 10; // Maximum number of picks

const { paytables, rtps, overallRTP } = generatePaytables(N, n, maxPicks, examplePayoutMultiplier);

// Print results
console.log(`Overall RTP for the game: ${overallRTP.toFixed(2)}%`);
for (let picks = 1; picks <= maxPicks; picks++) {
    console.log(`Paytable for ${picks} picks:`);
    console.table(paytables[picks]);

    console.log(`RTP for ${picks} picks: ${rtps[picks].toFixed(2)}%`);
}
