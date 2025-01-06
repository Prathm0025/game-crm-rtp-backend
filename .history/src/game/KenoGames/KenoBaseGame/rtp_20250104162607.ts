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

// Function to generate paytables based on desired RTP
export function generatePaytables(
    N: number,
    n: number,
    maxPicks: number,
    desiredRTP: number, // Pass the desired RTP
    payoutMultiplier: (k: number, picks: number, scalingFactor: number) => number
) {
    const paytables: { [key: number]: { match: number; payout: number; probability: number }[] } = {};
    const rtps: { [key: number]: number } = {};

    // Iterate through pick sizes
    for (let picks = 1; picks <= maxPicks; picks++) {
        const paytable: { match: number; payout: number; probability: number }[] = [];
        let totalExpectedReturn = 0;
        let scalingFactor = 1.0; // Initial scaling factor

        // Generate paytable for each pick size
        for (let match = 0; match <= picks; match++) {
            const probability = hypergeometric(N, picks, n, match);
            const payout = payoutMultiplier(match, picks, scalingFactor); // Use multiplier-based payouts

            totalExpectedReturn += probability * payout;
            paytable.push({ match, payout, probability });
        }

        // Calculate the current RTP for this pick size
        const currentRTP = totalExpectedReturn * 100;

        // Calculate adjustment factor needed to achieve the desired RTP
        const adjustmentFactor = desiredRTP / currentRTP;

        // Apply the adjustment factor to the scaling factor
        scalingFactor *= adjustmentFactor;

        // Store paytable and RTP for this pick size
        rtps[picks] = currentRTP * adjustmentFactor; // Adjusted RTP for this pick size
        paytables[picks] = paytable; // Store the paytable for this pick size
    }

    // Calculate overall RTP across all pick sizes
    const overallRTP = Object.values(rtps).reduce((sum, rtp) => sum + rtp, 0) / maxPicks;

    return { paytables, rtps, overallRTP };
}

// Example payout multiplier function
// Adjust multiplier logic to fit the desired RTP
export function examplePayoutMultiplier(match: number, picks: number, scalingFactor: number): number {
    const baseMultiplier = match;  // Linear increase based on number of matches

    // Adjust the multiplier with scaling factor to ensure the desired RTP is met
    const adjustedMultiplier = match === 0 ? 0 : baseMultiplier * scalingFactor / (picks / 2);

    // Ensure multiplier isn't too small, providing reasonable payouts
    return Math.max(adjustedMultiplier, 1); // Keep payouts reasonable and above 1
}

// Example usage
const N = 80; // Total numbers
const n = 20; // Numbers drawn
const maxPicks = 10; // Maximum number of picks
const desiredRTP = 90; // Desired RTP (e.g., 90%)

const { paytables, rtps, overallRTP } = generatePaytables(N, n, maxPicks, desiredRTP, examplePayoutMultiplier);

// Print results
console.log(`Overall RTP for the game: ${overallRTP.toFixed(2)}%`);
for (let picks = 1; picks <= maxPicks; picks++) {
    console.log(`Paytable for ${picks} picks:`);
    console.table(paytables[picks]);

    console.log(`RTP for ${picks} picks: ${rtps[picks].toFixed(2)}%`);
}
