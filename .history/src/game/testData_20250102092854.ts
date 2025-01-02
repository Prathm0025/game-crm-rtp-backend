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
      [0],                         //1 pick
      [0,1.2],                      //2 picks
      [0,0.3,2],                    //3 picks
      [0,0.1,0.8,3.5],              //4 picks
      [0,0,0.4,2.1,5],              //5 picks
      [0,0,0.2,0.8,3.6,5],
      [0,0,0.1,0.4,2,4,5],
      [0,0,0.1,0.2,0.7,3,5,5],
      [0,0,0,0.2,0.5,2.2,4.5,5,5],
      [0,0,0,0.1,0.3,1.5,3,5,5,5]
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
   {
     "id": "SL-FM",
     "matrix": {
       "x": 5,
       "y": 3
     },

     "linesApiData": [
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 2, 2],
      [2, 2, 1, 0, 0],
      [0, 1, 2, 1, 0],
      [2, 1, 0, 1, 2],
      [1, 2, 1, 0, 1],
      [1, 0, 1, 2, 1],
  ],     
     "bonus":{
        "isEnabled":true,
        "incrementCount":10,
        "thunderIncrementCount":3
     },
     "wildCountsToFreeGames" : { 3: 1, 4: 2, 5: 3 },
     "bonusCountsToFreeGames" : { 3: 5, 4: 10, 5: 15 },
     "scatterCountsToMultiplier" : { 3: {
      "name":"Minor",
      "multiplier":400
     }, 4:{
      "name":"Major",
      "multiplier":500
     }, 5: {
      "name":"Grand",
      "multiplier":600
     } },
     "miniMultiplier":30,
     "minorMultiplier":100,
     "majorMultiplier":500,
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
     "Symbols": [
       {
         "Name": "0",
         "Id": 0,
         "reelInstance": {
           "0": 16,
           "1": 16,
           "2": 16,
           "3": 16,
           "4": 16
         },
         "useWildSub": true,
         "isBonusSymbol": false,
         "multiplier": [
           [
             7.50,
             0
           ],
           [
             2,
             0
           ],
           [
             0.5,
             0
           ]
         ]
       },
       {
         "Name": "1",
         "Id": 1,
         "reelInstance": {
           "0": 16,
           "1": 16,
           "2": 16,
           "3": 16,
           "4": 16
         },
         "useWildSub": true,
         "isBonusSymbol": false,
         "multiplier": [
           [
             7.50,
             0
           ],
           [
             2,
             0
           ],
           [
             0.5,
             0
           ]
         ]
       },
       {
         "Name": "2",
         "Id": 2,
         "reelInstance": {
           "0": 16,
           "1": 16,
           "2": 16,
           "3": 16,
           "4": 16
         },
         "useWildSub": true,
         "isBonusSymbol": false,
         "multiplier": [
           [
             5,
             0
           ],
           [
             2,
             0
           ],
           [
             0.5,
             0
           ]
         ]
       },
       {
         "Name": "3",
         "Id": 3,
         "reelInstance": {
           "0": 16,
           "1": 16,
           "2": 16,
           "3": 16,
           "4": 16
         },
         "useWildSub": true,
         "isBonusSymbol": false,
         "multiplier": [
           [
             5,
             0
           ],
           [
             2,
             0
           ],
           [
             0.5,
             0
           ]
         ]
       },
       {
         "Name": "4",
         "Id": 4,
         "reelInstance": {
           "0": 7,
           "1": 7,
           "2": 7,
           "3": 7,
           "4": 7
         },
         "useWildSub": true,
         "isBonusSymbol": false,
         "multiplier": [
           [
             40,
             0
           ],
           [
             20,
             0
           ],
           [
             2.50,
             0
           ]
         ]
       },
       {
         "Name": "5",
         "Id": 5,
         "reelInstance": {
           "0": 7,
           "1": 7,
           "2": 7,
           "3": 7,
           "4": 7
         },
         "useWildSub": true,
         "isBonusSymbol": false,
         "multiplier": [
           [
             30,
             0
           ],
           [
             15,
             0
           ],
           [
             2,
             0
           ]
         ]
       },
       {
         "Name": "6",
         "Id": 6,
         "reelInstance": {
           "0": 7,
           "1": 7,
           "2": 7,
           "3": 7,
           "4": 7
         },
         "useWildSub": true,
         "isBonusSymbol": false,
         "multiplier": [
           [
             20,
             0
           ],
           [
             10,
             0
           ],
           [
             1.5,
             0
           ]
         ]
       },
       {
         "Name": "7",
         "Id": 7,
         "reelInstance": {
           "0": 7,
           "1": 7,
           "2": 7,
           "3": 7,
           "4": 7
         },
         "useWildSub": true,
        "isBonusSymbol": false,
         "multiplier": [
           [
             15,
             0
           ],
           [
             5,
             0
           ],
           [
             1,
             0
           ]
         ]
       },
       {
         "Name": "Wild",
         "Id": 8,
         "reelInstance": {
           "0": 1,
           "1": 5,
           "2": 5,
           "3": 5,
           "4": 0
         },
         "useWildSub": false,
         "isBonusSymbol": false,
         "multiplier": [
           [
              50,
              0
            ],
            [
              25,
              0
            ],
            [
              5,
              0
            ]
         ]
       },
        {
          "Name": "Bonus",
          "Id":9,
          "reelInstance": {
            "0": 2,
            "1": 2,
            "2": 2,
            "3": 2,
            "4": 0
          },
          "useWildSub": false,
          "isBonusSymbol": false,
          "multiplier": [
            
          ]
        },
       {
        "Name": "Scatter",
        "Id": 10,
        "reelInstance": {
          "0": 3,
          "1": 3,
          "2": 3,
          "3": 3,
          "4": 3
          ,
        },

        "description": "",
        "useWildSub": false,
        "isBonusSymbol": true,
        "multiplier": []
      },
     ]
   }
  
  ]

