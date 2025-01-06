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
    N: number,
    n: number,
    maxPicks: number,
    desiredRTP: number,
    basePayoutMultiplier: (match: number, picks: number) => number
) {
    const paytables: { [key: number]: { match: number; payout: number; probability: number }[] } = {};
    const rtps: { [key: number]: number } = {};
    const scalingFactors: { [key: number]: number } = {};

    for (let picks = 1; picks <= maxPicks; picks++) {
        let scalingFactor = 1; // Start with no scaling
        let totalRTP = 0;

        // Adjust scaling factor iteratively to match desired RTP
        do {
            const paytable: { match: number; payout: number; probability: number }[] = [];
            let totalExpectedReturn = 0;

            for (let match = 0; match <= picks; match++) {
                const probability = hypergeometric(N, picks, n, match);
                const basePayout = basePayoutMultiplier(match, picks);
                const payout = Math.floor(basePayout * scalingFactor);

                totalExpectedReturn += probability * payout;

                paytable.push({ match, payout, probability });
            }

            totalRTP = totalExpectedReturn * 100; // RTP as a percentage
            if (totalRTP < desiredRTP) scalingFactor += 0.001; // Increase scaling if RTP is too low
            else if (totalRTP > desiredRTP) scalingFactor -= 0.001; // Decrease scaling if RTP is too high

            paytables[picks] = paytable;
            scalingFactors[picks] = scalingFactor;
        } while (Math.abs(totalRTP - desiredRTP) > 0.01); // Stop when RTP is close enough to the desired value

        rtps[picks] = totalRTP; // Store the final RTP for the current pick size
    }

    return { paytables, rtps, scalingFactors };
}

// Base payout multiplier (unchanged structure, payouts scaled dynamically)
export function examplePayoutMultiplier(match: number, picks: number): number {
    if (match === 0) return 0; // No payout for 0 matches
    if (match === picks) return 13; // Maximum payout for jackpot matches

    // Scale payouts for intermediate matches between 1 and picks - 1
    const baseReward = 1 + (12 * match) / picks; // Linearly scale between 1 and 13

    return Math.floor(baseReward); // Round down for simplicity
}