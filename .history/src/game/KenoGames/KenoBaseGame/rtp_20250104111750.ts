const N = 80;  // Total numbers in the pool
const K = 10;  // Numbers selected by the player
const n = 20;  // Numbers drawn

// Example payout table (for 0 to 10 matching numbers)
const payouts = [
    0,  // 0 matches
    0,  // 1 match
    1,  // 2 matches
    5,  // 3 matches
    20, // 4 matches
    50, // 5 matches
    100, // 6 matches
    200, // 7 matches
    500, // 8 matches
    1000, // 9 matches
    10000, // 10 matches
];

const rtp = calculateRTP(N, K, n, payouts);
console.log(`The RTP of the game is: ${rtp.toFixed(2)}%`);