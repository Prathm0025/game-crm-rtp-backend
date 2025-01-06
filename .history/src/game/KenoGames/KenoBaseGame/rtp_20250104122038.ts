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
export function hypergeometric(N: number, K: number, n: number, k: number): number {
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

export function generatePaytables(
    N: number, // Total pool size (e.g., 80)
    n: number, // Numbers drawn (e.g., 20)
    paytable: number[][] // Pre-defined paytable
) {
    const paytables: { [key: number]: { match: number; payout: number; probability: number }[] } = {};
    const rtps: { [key: number]: number } = {};

    for (let picks = 1; picks <= paytable.length; picks++) {
        const currentPaytable = paytable[picks - 1]; // Paytable for this pick count
        const maxMatches = currentPaytable.length - 1; // Max match level for this pick count
        const paytableForPick: { match: number; payout: number; probability: number }[] = [];
        let totalExpectedReturn = 0;

        for (let match = 0; match <= maxMatches; match++) {
            const probability = hypergeometric(N, picks, n, match); // Probability for this match level
            const payout = currentPaytable[match] || 0; // Payout from paytable (default to 0 if missing)

            totalExpectedReturn += probability * payout; // Accumulate expected return
            paytableForPick.push({ match, payout, probability });
        }

        paytables[picks] = paytableForPick;
        rtps[picks] = totalExpectedReturn * 100; // RTP as a percentage
    }

    return { paytables, rtps };
}

// Example


export function examplePayoutTable(match: number, picks: number): number {
    if (match === 0) return 0; // No payout for 0 matches
    if (match === picks) return 13; // Maximum payout for jackpot matches

    // Fixed payouts for intermediate matches
    if (match === Math.floor(picks * 0.5)) return 6; // Mid-range match
    if (match === Math.floor(picks * 0.75)) return 9; // High match, but not jackpot

    // Default low-tier payout
    return 1 + match; // Linear increase for small matches
}
