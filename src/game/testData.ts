export const gameData = [
  {
    "id": "SL-LS",
    "matrix": {
      "x": 3,
      "y": 3
    },
    "linesApiData": [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
      [0, 1, 2],
      [2, 1, 0],
      [0, 1, 0],
      [2, 1, 2],
      [1, 0, 1],
      [1, 2, 1]
    ],
    "linesCount": [
      9
    ],
    "jackpotPayout": 100,
    "jackpotCombination": ["0", "1", "2"],
    "paytable": [
      // Wild
      {
        "combination": ["6", "6", "6"],
        "payout": 20
      },

      // 7 orange gray blue
      {
        "combination": ["0", "0", "0"],
        "payout": 12
      },
      {
        "combination": ["1", "1", "1"],
        "payout": 10
      },
      {
        "combination": ["2", "2", "2"],
        "payout": 6
      },

      // bar orange gray blue
      {
        "combination": ["3", "3", "3"],
        "payout": 3
      },
      {
        "combination": ["4", "4", "4"],
        "payout": 3
      },
      {
        "combination": ["5", "5", "5"],
        "payout": 3
      },

      // 7 any combination
      {
        "combination": ["0", "1", "2"],
        "payout": 5
      },
      {
        "combination": ["0", "2", "1"],
        "payout": 5
      },
      {
        "combination": ["1", "0", "2"],
        "payout": 5
      },
      {
        "combination": ["1", "2", "0"],
        "payout": 5
      },
      {
        "combination": ["2", "0", "1"],
        "payout": 5
      },
      {
        "combination": ["2", "1", "0"],
        "payout": 5
      },

      // 7 bar orange grey blue
      {
        "combination": ["0", "3"],
        "payout": 2
      },
      {
        "combination": ["3", "0"],
        "payout": 2
      },

      {
        "combination": ["1", "4"],
        "payout": 2
      },
      {
        "combination": ["4", "1"],
        "payout": 2
      },

      {
        "combination": ["2", "5"],
        "payout": 2
      },
      {
        "combination": ["5", "2"],
        "payout": 2
      },

      // bar any combination
      {
        "combination": ["3", "4", "5"],
        "payout": 1
      },
      {
        "combination": ["3", "5", "4"],
        "payout": 1
      },
      {
        "combination": ["4", "3", "5"],
        "payout": 1
      },
      {
        "combination": ["4", "5", "3"],
        "payout": 1
      },
      {
        "combination": ["5", "3", "4"],
        "payout": 1
      },
      {
        "combination": ["5", "4", "3"],
        "payout": 1
      },
    ],
    "bets": [
      0.02,
      0.04,
      0.1,
      0.2,
      0.3,
      0.5,
      1,
      1.5,
      3,
      7,
      10,
      15,
      20,
      32,
      64
    ],
    "Symbols": [
      {
        "Name": "OrangeSeven",
        "Id": 0,
        "canmatch": [
          "0",
          "1",
          "2",
          "3",
          "6"
        ],
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5
        }
      },
      {
        "Name": "GraySeven",
        "Id": 1,
        "canmatch": [
          "0",
          "1",
          "2",
          "4",
          "6"

        ],
        "description": "",
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5
        }
      },
      {
        "Name": "BlueSeven",
        "Id": 2,
        "canmatch": [
          "0",
          "1",
          "2",
          "5",
          "6"
        ],
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5
        }
      },
      {
        "Name": "OrangerBar",
        "Id": 3,
        "canmatch": [
          "3",
          "4",
          "5",
          "0"
        ],
        "description": "",
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5
        }
      },
      {
        "Name": "GrayBar",
        "Id": 4,
        "canmatch": [
          "3",
          "4",
          "5",
          "1"
        ],
        "description": "",
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5
        }
      },
      {
        "Name": "BlueBar",
        "Id": 5,
        "canmatch": [
          "3",
          "4",
          "5",
          "2"
        ],
        "description": "",
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5
        }
      },
      {
        "Name": "Wild",
        "Id": 6,
        "canmatch": [

        ],
        "description": "All payout this round are multiplied by the corresponding multiplier",
        "reelInstance": {
          "0": 4,
          "1": 4,
          "2": 4
        }
      },
    ]
  }
  ]