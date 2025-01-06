export const gameData = [
  {
    "id": "KN-test",
    "isSpecial": false,
    "total": 80,
    "draws": 20,
    "maximumPicks": 10,
    "bets":[
      0.1,
      0.2,
      0.3,
      0.4,
      0.5,
      1.0,
      2.0,
      3.0,
      4.0,
      5.0,
      10,
      20,
      30,
      40,
      50,
      100,
      200
    ],

    "paytable": [
      [2.8],                         //1 pick
      [1.4,2.8],                      //2 picks
      [0.9,1.9,3.7],                    //3 picks
      [0.7,1.4,2.8,5.6],              //4 picks
      [0.6,1.1,2.2,4.5,9],              //5 picks
      [0.5,0.9,1.9,3.7,7.5,14.9],        //6
      [0.4,0.8,1.6,3.2,6.4,12.8,25.6],              //7
      [0.3,0.7,1.4,2.8,5.6,11.2,22.4, 44.8],          //8
      [0.3,0.6,1.2,2.5,5,18,34, 61, 110],    //9
      [0,1,2,5,10,18,34, 61, 110, 198],    //10
    ]
  }
  // {
  //   "id": "SL-LLL",
  //   "isSpecial": true,
  //   "minMatchCount": 3,
  //   "matrix": {
  //     "x": 5,
  //     "y": 3
  //   },
  //   "linesCount": [
  //     25
  //   ],
  //   "bets": [
  //     0.0004,
  //     0.002,
  //     0.004,
  //     0.01,
  //     0.02,
  //     0.03,
  //     0.04,
  //     0.05,
  //     0.08,
  //     0.12,
  //     0.2,
  //     0.4,
  //     0.6,
  //     0.8,
  //     1.2,
  //     1.6,
  //     2
  //   ],
  //   "freeSpin": {
  //     "isEnabled": true,
  //     "incrementCount": 10
  //   },
  //   "Symbols": [
  //     {
  //       "Name": "0",
  //       "Id": 0,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": true,
  //       "reelInstance": {
  //         "0": 5,
  //         "1": 5,
  //         "2": 5,
  //         "3": 5,
  //         "4": 5
  //       },
  //       "multiplier": [
  //         [
  //           80,
  //           0
  //         ],
  //         [
  //           30,
  //           0
  //         ],
  //         [
  //           15,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "1",
  //       "Id": 1,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": true,
  //       "reelInstance": {
  //         "0": 5,
  //         "1": 5,
  //         "2": 5,
  //         "3": 5,
  //         "4": 5
  //       },
  //       "multiplier": [
  //         [
  //           80,
  //           0
  //         ],
  //         [
  //           30,
  //           0
  //         ],
  //         [
  //           15,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "2",
  //       "Id": 2,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": true,
  //       "reelInstance": {
  //         "0": 5,
  //         "1": 5,
  //         "2": 5,
  //         "3": 5,
  //         "4": 5
  //       },
  //       "multiplier": [
  //         [
  //           80,
  //           0
  //         ],
  //         [
  //           30,
  //           0
  //         ],
  //         [
  //           15,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "3",
  //       "Id": 3,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": true,
  //       "reelInstance": {
  //         "0": 5,
  //         "1": 5,
  //         "2": 5,
  //         "3": 5,
  //         "4": 5
  //       },
  //       "multiplier": [
  //         [
  //           80,
  //           0
  //         ],
  //         [
  //           30,
  //           0
  //         ],
  //         [
  //           15,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "4",
  //       "Id": 4,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": true,
  //       "reelInstance": {
  //         "0": 5,
  //         "1": 5,
  //         "2": 5,
  //         "3": 5,
  //         "4": 5
  //       },
  //       "multiplier": [
  //         [
  //           80,
  //           0
  //         ],
  //         [
  //           30,
  //           0
  //         ],
  //         [
  //           15,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "5",
  //       "Id": 5,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 10,
  //         "1": 10,
  //         "2": 10,
  //         "3": 10,
  //         "4": 10
  //       },
  //       "multiplier": [
  //         [
  //           40,
  //           0
  //         ],
  //         [
  //           20,
  //           0
  //         ],
  //         [
  //           10,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "6",
  //       "Id": 6,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 10,
  //         "1": 10,
  //         "2": 10,
  //         "3": 10,
  //         "4": 10
  //       },
  //       "multiplier": [
  //         [
  //           40,
  //           0
  //         ],
  //         [
  //           20,
  //           0
  //         ],
  //         [
  //           10,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "7",
  //       "Id": 7,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 10,
  //         "1": 10,
  //         "2": 10,
  //         "3": 10,
  //         "4": 10
  //       },
  //       "multiplier": [
  //         [
  //           40,
  //           0
  //         ],
  //         [
  //           20,
  //           0
  //         ],
  //         [
  //           10,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "8",
  //       "Id": 8,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 10,
  //         "1": 10,
  //         "2": 10,
  //         "3": 10,
  //         "4": 10
  //       },
  //       "multiplier": [
  //         [
  //           40,
  //           0
  //         ],
  //         [
  //           20,
  //           0
  //         ],
  //         [
  //           10,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "9",
  //       "Id": 9,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 10,
  //         "1": 10,
  //         "2": 10,
  //         "3": 10,
  //         "4": 10
  //       },
  //       "multiplier": [
  //         [
  //           40,
  //           0
  //         ],
  //         [
  //           20,
  //           0
  //         ],
  //         [
  //           10,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "10",
  //       "Id": 10,
  //       "useWildSub": true,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 10,
  //         "1": 10,
  //         "2": 10,
  //         "3": 10,
  //         "4": 10
  //       },
  //       "multiplier": [
  //         [
  //           40,
  //           0
  //         ],
  //         [
  //           20,
  //           0
  //         ],
  //         [
  //           10,
  //           0
  //         ]
  //       ]
  //     },
  //     {
  //       "Name": "Scatter",
  //       "Id": 11,
  //       "useWildSub": false,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 0,
  //         "1": 5,
  //         "2": 25,
  //         "3": 5,
  //         "4": 0
  //       },
  //       "multiplier": [
  //
  //       ]
  //     },
  //     {
  //       "Name": "FreeSpin",
  //       "Id": 12,
  //       "useWildSub": false,
  //       "isFreeSpinMultiplier": false,
  //       "reelInstance": {
  //         "0": 15,
  //         "1": 15,
  //         "2": 10,
  //         "3": 0,
  //         "4": 0
  //       },
  //       "multiplier": [
  //
  //       ]
  //     }
  //   ]
  // }

]
