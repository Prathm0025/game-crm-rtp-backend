export const gameData = [
   {
     "id": "SL-WB",
     "matrix": {
       "x": 5,
       "y": 4
     },

     "linesApiData": [
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2],
      [0, 0, 0, 0, 0],
      [3, 3, 3, 3, 3],
      [1, 2, 3, 2, 1],
      [2, 1, 0, 1, 2],
      [0, 1, 2, 1, 0],
      [3, 2, 1, 2, 3],
      [2, 3, 2, 3, 2],
      [1, 0, 1, 0, 1],
      [1, 1, 2, 3, 3],
      [2, 2, 1, 0, 0],
      [3, 2, 2, 2, 3],
      [0, 1, 1, 1, 0],
      [1, 2, 1, 0, 1],
      [2, 1, 2, 3, 2],
      [1, 0, 0, 1, 2],
      [2, 3, 3, 2, 1],
      [1, 2, 2, 2, 1],
      [2, 1, 1, 1, 2],
      [2, 2, 3, 2, 1],
      [1, 1, 0, 1, 2],
      [0, 1, 0, 1, 0],
      [3, 2, 3, 2, 3],
      [0, 0, 1, 0, 0],
      [3, 3, 2, 3, 3],
      [1, 1, 2, 1, 1],
      [2, 2, 1, 2, 2],
      [0, 0, 1, 2, 2],
      [3, 3, 2, 1, 1],
      [1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2],
      [2, 3, 2, 1, 2],
      [1, 0, 1, 2, 1],
      [1, 0, 0, 0, 1],
      [2, 3, 3, 3, 2],
      [1, 1, 1, 2, 3],
      [2, 2, 2, 1, 0],
      [0, 1, 2, 3, 2],
      [3, 2, 1, 0, 1],
      [1, 2, 3, 3, 3],
      [2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2],
      [3, 3, 3, 2, 1],
      [3, 2, 2, 1, 0],
      [0, 1, 1, 2, 3],
      [1, 2, 2, 3, 3],
      [2, 1, 1, 0, 0],
      [0, 1, 0, 1, 2],
      [3, 2, 3, 2, 1],
  ],     
     "bonus":{
        "isEnabled":true,
        "incrementCount":10,
        "thunderIncrementCount":3
     },
     "miniMultiplier":30,
     "minorMultiplier":100,
     "majorMultiplier":500,
     "grandMultiplier":5000,
     "smallWheelFeature": {
     "featureValues":[
        8,10,12,15,//freespin
        20,40,60,80//multiplier
      ],
     "featureProbs":[
        2,60,40,20, //freespin
        2,2,2,2//multiplier
      ]
    },
    "bonusTriggerCount":3,
    "bonusCount":[3,4,5],
    "bonusTriggerCountDuringFreeSpin":2,
    "bonusCountDuringFreeSpins":[2, 3, 4, 5],
    "freeSpinDuringBonus":[5,8,15,20],
    "mediumWheelFeature": {
      "featureValues":[
        12,15,17,20,//freespin
        20,40,60,80//multiplier

      ],
      "featureProbs":[
        2,2,2,2, //freespin
        20,40,60,80//multiplier
      ]
    },
    "largeWheelFeature": {
      "featureValues":[
        15,20,25,30,//freespin
        20,40,60,80//multiplier
      ],
      "featureProbs":[
        2,2,2,2, //freespin
        20,40,60,80//multiplier
      ]
    },
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
         "Name": "8",
         "Id": 8,
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
         "Name": "9",
         "Id": 9,
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
         "Name": "10",
         "Id": 10,
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
         "Id": 11,
         "reelInstance": {
           "0": 0,
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
          "Id": 12,
          "reelInstance": {
            "0": 25,
            "1": 0,
            "2": 25,
            "3": 25,
            "4": 0
          },
          "useWildSub": false,
          "isBonusSymbol": false,
          "multiplier": [
            
          ]
        },
       {
        "Name": "GoldenBonus",
        "Id": 13,
        "reelInstance": {
          "0": 0,
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
        },

        "description": "",
        "useWildSub": false,
        "isBonusSymbol": true,
        "multiplier": []
      },
     ]
   }
  
  ]