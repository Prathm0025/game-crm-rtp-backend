export const gameData = [
  {
    "id": "SL-LLL",
    "isSpecial": true,
    "minMatchCount": 3,
    "matrix": {
      "x": 5,
      "y": 3
    },
    "linesApiData": [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2],
      [0, 1, 2, 1, 0],
      [2, 1, 0, 1, 2],
      [0, 0, 1, 2, 2],
      [2, 2, 1, 0, 0],
      [1, 0, 1, 2, 1],
      [1, 2, 1, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 2, 2, 2, 1],
      [2, 1, 1, 1, 2],
      [0, 1, 0, 1, 0],
      [2, 1, 2, 1, 2],
    ],
    "linesCount": [1, 5, 10, 15],
    "bets": [
      0.001,
      0.005,
      0.01,
      0.025,
      0.05,
      0.075,
      0.1,
      0.125,
      0.2,
      0.3,
      0.5,
      1,
      1.5,
      2,
      3,
      4
    ],
    "freeSpin": {
      "isEnabled": true,
      "incrementCount": 9,
      "diamondMultiplier": [
        { "range": [1, 5], "multiplier": 2 },
        { "range": [6, 10], "multiplier": 3 },
        { "range": [11, 15], "multiplier": 4 },
        { "range": [16, 20], "multiplier": 5 },
        { "range": [21, 25], "multiplier": 6 },
        { "range": [26, 30], "multiplier": 7 },
        { "range": [31, 35], "multiplier": 8 },
        { "range": [36, 40], "multiplier": 9 },
        { "range": [41, 45], "multiplier": 10 },
        { "range": [46, 100], "multiplier": 10 },
      ]
    },
    "Symbols": [
      {
        "Name": "0", //Ring
        "Id": 0,
        "useWildSub": true,
        "isFreeSpinMultiplier": true,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5
        },
        "multiplier": [
          [
            100,
            0
          ],
          [
            50,
            0
          ],
          [
            25,
            0
          ]
        ]
      },
      {
        "Name": "1", //Car
        "Id": 1,
        "useWildSub": true,
        "isFreeSpinMultiplier": false,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5
        },
        "multiplier": [
          [
            100,
            0
          ],
          [
            50,
            0
          ],
          [
            25,
            0
          ]
        ]
      },
      {
        "Name": "2", //yatch
        "Id": 2,
        "useWildSub": true,
        "isFreeSpinMultiplier": false,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5
        },
        "multiplier": [
          [
            100,
            0
          ],
          [
            50,
            0
          ],
          [
            25,
            0
          ]
        ]
      },
      {
        "Name": "3", //Plane
        "Id": 3,
        "useWildSub": true,
        "isFreeSpinMultiplier": false,
        "reelInstance": {
          "0": 5,
          "1": 5,
          "2": 5,
          "3": 5,
          "4": 5
        },
        "multiplier": [
          [
            100,
            0
          ],
          [
            50,
            0
          ],
          [
            25,
            0
          ]
        ]
      },
      {
        "Name": "4", //watch
        "Id": 4,
        "useWildSub": true,
        "isFreeSpinMultiplier": true,
        "reelInstance": {
          "0": 12,
          "1": 12,
          "2": 12,
          "3": 12,
          "4": 12
        },
        "multiplier": [
          [
            60,
            0
          ],
          [
            30,
            0
          ],
          [
            10,
            0
          ]
        ]
      },
      {
        "Name": "5", //Silver bar
        "Id": 5,
        "useWildSub": true,
        "isFreeSpinMultiplier": true,
        "reelInstance": {
          "0": 12,
          "1": 12,
          "2": 12,
          "3": 12,
          "4": 12
        },
        "multiplier": [
          [
            60,
            0
          ],
          [
            30,
            0
          ],
          [
            10,
            0
          ]
        ]
      },
      {
        "Name": "6", //Gold Bar
        "Id": 6,
        "useWildSub": true,
        "isFreeSpinMultiplier": true,
        "reelInstance": {
          "0": 12,
          "1": 12,
          "2": 12,
          "3": 12,
          "4": 12
        },
        "multiplier": [
          [
            60,
            0
          ],
          [
            30,
            0
          ],
          [
            10,
            0
          ]
        ]
      },
      {
        "Name": "7", //Triple Gold Bar
        "Id": 7,
        "useWildSub": true,
        "isFreeSpinMultiplier": true,
        "reelInstance": {
          "0": 12,
          "1": 12,
          "2": 12,
          "3": 12,
          "4": 12
        },
        "multiplier": [
          [
            60,
            0
          ],
          [
            30,
            0
          ],
          [
            10,
            0
          ]
        ]
      },
      {
        "Name": "Scatter",
        "Id": 8,
        "useWildSub": false,
        "reelInstance": {
          "0": 0,
          "1": 19,
          "2": 19,
          "3": 19,
          "4": 0
        },
        "multiplier": [

        ]
      },
      {
        "Name": "FreeSpin",
        "Id": 9,
        "useWildSub": false,
        "reelInstance": {
          "0": 0,
          "1": 30,
          "2": 30,
          "3": 30,
          "4": 0
        },
        "multiplier": [

        ]
      }
    ]
  }
]
