export const gameData = [
//SL-BE
  {
    "id": "SL-BE",
    "matrix": {
      "x": 6,
      "y": 3
    },
    "linesApiData": [
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 2, 2, 0, 0],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 2, 2, 1, 1],
      [2, 2, 0, 0, 2, 2],
      [2, 2, 1, 1, 2, 2],
      [0, 0, 1, 1, 2, 2],
      [2, 2, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 2, 2, 2, 2, 0],
      [1, 2, 2, 2, 2, 1],
      [1, 0, 0, 0, 0, 1],
      [2, 0, 0, 0, 0, 2],
      [2, 1, 1, 1, 1, 2],
      [0, 1, 0, 0, 1, 0],
      [0, 2, 0, 0, 2, 0],
      [1, 0, 1, 1, 0, 1],
      [1, 2, 1, 1, 2, 1],
      [2, 0, 2, 2, 0, 2],
      [2, 1, 2, 2, 1, 2],
      [0, 1, 2, 2, 1, 0],
      [0, 2, 1, 1, 2, 0],
      [1, 0, 2, 2, 0, 1],
      [1, 2, 0, 0, 2, 1],
      [2, 0, 1, 1, 0, 2],
      [2, 1, 0, 0, 1, 2],
      [0, 1, 2, 1, 0, 1],
    ],
    "linesCount": [
      1,
      5,
      15,
      20,
      25,
      30
    ],
    "bets": [
      0.0005,
      0.0025,
      0.005,
      0.0125,
      0.025,
      0.0375,
      0.05,
      0.0625,
      0.1,
      0.15,
      0.25,
      0.5,
      0.75,
      1,
      1.5,
      2
    ],
    "bats": {
      "isEnabled": true,
      "multiplier": [  15, 6, 3, 1.2, 0.6, 0.5, 0, 0] 
    },
    "freeSpin": {
      "isEnabled": true,
      "countIncrement": 8,
      "bloodSplash": {
        "countProb": [20, 10, 10, 10, 20, 25] // prob of 1 ,2,3,4,5,6,7 or 8 bloodsplashes
      }
    },
    "bonus": {
      "type": "spin",
      "isEnabled": false,
      "noOfItem": 8,
      "payOut": [200, 100, 70, 50, 30, 20, 10, 5],
      "payOutProb": [0.05, 0.5, 1, 3, 10, 20, 25, 39.4]
    },
    "wild": {
      "isEnabled": true,
      "multiplier": [10, 20, 30, 40]
    },
    "gamble": {
      "isEnabled": true
    },
    "Symbols": [
      {
        "Name": "0",
        "Id": 0,
        "reelInstance": {
          "0": 10,
          "1": 10,
          "2": 10,
          "3": 10,
          "4": 10,
          "5": 10
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "1",
        "Id": 1,
        "reelInstance": {
          "0": 10,
          "1": 10,
          "2": 10,
          "3": 10,
          "4": 10,
          "5": 10
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "2",
        "Id": 2,
        "reelInstance": {
          "0": 10,
          "1": 10,
          "2": 10,
          "3": 10,
          "4": 10,
          "5": 10
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "3",
        "Id": 3,
        "reelInstance": {
          "0": 10,
          "1": 10,
          "2": 10,
          "3": 10,
          "4": 10,
          "5": 10
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "4",
        "Id": 4,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5,
          "5": 5
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "5",
        "Id": 5,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5,
          "5": 5
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "6",
        "Id": 6,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5,
          "5": 5
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "7",
        "Id": 7,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5,
          "5": 5
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "8",
        "Id": 8,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5,
          "5": 5
        },
        "useWildSub": true,
        "multiplier": [
          [
            100,
            0
          ],
          [
            75,
            0
          ],
          [
            45,
            0
          ],
          [
            15,
            0
          ]
        ]
      },
      {
        "Name": "Bat",
        "Id": 9,
        "reelInstance": {
          "0": 10,
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1
        },
        "useWildSub": false,
        "multiplier": [

        ]
      },
      {
        "Name": "BatX2",
        "Id": 10,
        "reelInstance": {
          "0": 1,
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1
        },
        "useWildSub": false,
        "multiplier": [

        ]
      },
      {
        "Name": "VampireMan",
        "Id": 11,
        "reelInstance": {
          "0": 0,
          "1": 20,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0
        },
        "useWildSub": false,
        "multiplier": [

        ]
      },
      {
        "Name": "VampireWoman",
        "Id": 12,
        "reelInstance": {
          "0": 0,
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 20,
          "5": 0
        },
        "useWildSub": false,
        "multiplier": [

        ]
      },
      {
        "Name": "HumanMan",
        "Id": 13,
        "reelInstance": {
          "0": 0,
          "1": 0,
          "2": 0,
          "3": 20,
          "4": 0,
          "5": 0
        },
        "useWildSub": false,
        "multiplier": [

        ]
      },
      {
        "Name": "HumanWoman",
        "Id": 14,
        "reelInstance": {
          "0": 0,
          "1": 0,
          "2": 20,
          "3": 0,
          "4": 0,
          "5": 0
        },
        "useWildSub": false,
        "multiplier": [

        ]
      },
    ]
  }
  // {
  //   "id": "SL-ONE",
  //   "isSpecial": true,
  //   "matrix": {
  //     "x": 1,
  //     "y": 1
  //   },
  //   "bets": [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ],
  //
  //   "linesApiData": [],
  //   "scatterPurple": {
  //     "isEnabled": true,
  //     "topSymbolProbs": [0, 140, 130, 120, 120, 110, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  //     //make sure special symbols and empty have 0
  //     "symbolsProbs": [5, 140, 130, 120, 120, 110, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // probability of each symbol
  //     //make sure special symbols have 0
  //     "featureProbs": [0, 40, 40, 40] // probability of each feature . index : 0 - no feature, 1 - level up, 2 - booster ,3 - both levelup and booster
  //   },
  //   "scatterBlue": {
  //     "isEnabled": true,
  //     "symbolsProbs": [250, 14, 13, 12, 12, 11, 11, 11, 11, 9, 9, 8, 5, 2, 0, 0, 0], // probability of each symbol
  //     "featureProbs": [0, 40, 40, 40] // probability of each feature . index : 0 - no feature, 1 - level up, 2 - booster ,3 - both levelup and booster
  //   },
  //   "booster": {
  //     "isEnabledSimple": true,
  //     "isEnabledExhaustive": true,
  //     "type": "",
  //     "typeProbs": [10, 15, 15], // index : 0 - no booster, 1 - simple booster, 2 - exhaustive booster
  //     "multiplier": [1, 2, 3, 5, 10, 15, 20, 25],// multiplier amt
  //     "multiplierProbs": [90, 70, 40, 20, 10, 4, 3, 1], // multiplier probability
  //   },
  //   "levelUp": {
  //     "isEnabled": true,
  //     "level": [0, 1, 2, 3, 4, 5, 6, 7],//increment symbol amounts . 0 - no level up
  //     "levelProbs": [6, 50, 40, 30, 20, 15, 14, 12],// increment symbol probability 
  //   },
  //   "joker": {
  //     "isEnabled": true,
  //     "payout": [50, 500, 5000],
  //     "blueRound": [8, 70, 60, 150],// 0 - no matches , 1 - only one match ...
  //     "greenRound": [8, 70, 60, 150],// 0 - no matches , 1 - only one match ...
  //     "redRound": [8, 70, 60, 50],// 0 - no matches , 1 - only one match ...
  //     // "blueRound": [100, 1, 100, 1, 100, 1, 100, 1, 100, 1, 100, 10], // all even including 0 is joker - 0,2,4,6,8,10
  //     // "greenRound": [100, 1, 1, 100, 1, 1, 100, 1, 1, 100, 1, 1],//all numbers divisible by 3 including 0 is joker - 0,3,6,9
  //     // "redRound": [100, 1, 1, 1, 1, 100, 1, 1, 1, 1, 100, 10],//all numbers divisible by 5 including 0 is joker - 0,5,10
  //
  //   },
  //   // bonus: {
  //   //   isEnabled: true,
  //   //   type: "",
  //   //   noOfItem: 0,
  //   //   payOut: [], // Ensure payOut is initialized
  //   //   payOutProb: [], // Ensure payOutProb is initialized
  //   //   payTable: [], // Ensure payTable is initialized
  //   // },
  //   "Symbols": [
  //     {
  //       //empty
  //       "Name": "empty",
  //       "Id": 0,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 9,
  //         "1": 9,
  //         "2": 9,
  //         "3": 9,
  //         "4": 9
  //       },
  //       "freeSpinCount": 0,
  //       "payout": 0,
  //     },
  //     {
  //       //banana
  //       "Name": "banana",
  //       "Id": 1,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 9,
  //         "1": 9,
  //         "2": 9,
  //         "3": 9,
  //         "4": 9
  //       },
  //       "freeSpinCount": 1,
  //       "payout": 1,
  //     },
  //     {
  //       //watermelon
  //       "Name": "watermelon",
  //       "Id": 2,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 9,
  //         "1": 9,
  //         "2": 9,
  //         "3": 9,
  //         "4": 9
  //       },
  //       "freeSpinCount": 1,
  //       "payout": 1,
  //     },
  //     {
  //       //cherry
  //       "Name": "cherry",
  //       "Id": 3,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 9,
  //         "1": 9,
  //         "2": 9,
  //         "3": 9,
  //         "4": 9
  //       },
  //       "freeSpinCount": 1,
  //       "payout": 2,
  //     },
  //     {
  //       //grapes
  //       "Name": "grapes",
  //       "Id": 4,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 9,
  //         "1": 9,
  //         "2": 9,
  //         "3": 9,
  //         "4": 9
  //       },
  //       "freeSpinCount": 1,
  //       "payout": 2,
  //     },
  //     {
  //       //lemon
  //       "Name": "lemon",
  //       "Id": 5,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "freeSpinCount": 1,
  //       "payout": 2,
  //     },
  //     {
  //       //orange
  //       "Name": "orange",
  //       "Id": 6,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "freeSpinCount": 1,
  //       "payout": 4,
  //     },
  //     {
  //       //bell
  //       "Name": "bell",
  //       "Id": 7,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "freeSpinCount": 2,
  //       "payout": 5,
  //     },
  //     {
  //       //bar
  //       "Name": "bar",
  //       "Id": 8,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "payout": 10,
  //       "freeSpinCount": 2,
  //     },
  //     {
  //       //7
  //       "Name": "7",
  //       "Id": 9,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "payout": 15,
  //       "freeSpinCount": 2,
  //     },
  //
  //     {
  //       //double bar
  //       "Name": "doubleBar",
  //       "Id": 10,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "freeSpinCount": 2,
  //       "payout": 20,
  //     },
  //     {
  //       //double 7
  //       "Name": "double7",
  //       "Id": 11,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "freeSpinCount": 2,
  //       "payout": 30,
  //     },
  //
  //     {
  //       //triple bar
  //       "Name": "tripleBar",
  //       "Id": 12,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "freeSpinCount": 0,
  //       "payout": 50,
  //     },
  //
  //     {
  //       //triple 7
  //       "Name": "triple7",
  //       "Id": 13,
  //       "isSpecial": false,
  //       "reelInstance": {
  //         "0": 4,
  //         "1": 4,
  //         "2": 4,
  //         "3": 4,
  //         "4": 4
  //       },
  //       "freeSpinCount": 0,
  //       "payout": 200,
  //     },
  //     {
  //       "Name": "ScatterBlue",
  //       "Id": 14,
  //       "isSpecial": true,
  //       "reelInstance": {
  //         "0": 1,
  //         "1": 1,
  //         "2": 1,
  //         "3": 1,
  //         "4": 1
  //       },
  //       "description": "Scatter: Respin free games",
  //       "freeSpinCount": 0,
  //       "payout": 0,
  //     },
  //     {
  //       "Name": "ScatterPurple",
  //       "Id": 15,
  //       "isSpecial": true,
  //       "reelInstance": {
  //         "0": 2,
  //         "1": 2,
  //         "2": 2,
  //         "3": 2,
  //         "4": 2
  //       },
  //       "description": "Scatter: fruit free games",
  //       "freeSpinCount": 0,
  //       "payout": 0,
  //     },
  //
  //     {
  //       "Name": "Joker",
  //       "Id": 16,
  //       "isSpecial": true,
  //       "reelInstance": {
  //         "0": 62,
  //         "1": 62,
  //         "2": 62,
  //         "3": 62,
  //         "4": 62
  //       },
  //       "description": "Joker",
  //       "freeSpinCount": 0,
  //       "payout": 0,
  //     },
  //   ]
  // }
]
