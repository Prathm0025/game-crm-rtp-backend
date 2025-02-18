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
    "paytable": [
      {
        "combination": ["0", "1", "2"],
        "payout": 100
      },
      {
        "combination": ["6", "6", "6"],
        "payout": 20
      },
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
      {
        "combination": ["0", "1", "2"],
        "payout": 5
      },
      {
        "combination": ["0", "3"],
        "payout": 2
      },
      {
        "combination": ["1", "4"],
        "payout": 2
      },
      {
        "combination": ["2", "5"],
        "payout": 2
      },
      {
        "combination": ["3", "4", "5"],
        "payout": 0.5
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
          "3"
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
          "4"
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
          "5"
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
          "0": 2,
          "1": 2,
          "2": 2
        }
      },
    ]
  }
  ]