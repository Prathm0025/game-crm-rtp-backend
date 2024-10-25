export const gameData = [

//   {
//     "id": "SL-LOL",
//     "isSpecial": true,
//     "minMatchCount": 3,
//     "matrix": {
//       "x": 5,
//       "y": 3
//     },
//     "linesCount": [
//       1,
//       5,
//       15,
//       20
//     ],
//     "bets": [
//       0.1,
//       0.25,
//       0.5,
//       0.75,
//       1
//     ],
//     "gamble": {
//       "type": "BLACKRED",
//       "isEnabled": true
//     },
//     "freeSpin": {
//       "isEnabled": true,
//       "losPollosValues": [2, 3, 4, 5, 7],
//       "losPollosProbs": [20, 2, 2, 2, 2]
//     },
//     "bonus": {
//       "type": "spin",
//       "isEnabled": false,
//       "noOfItem": 8,
//       "jackpot":5000,
//     },
//     "Symbols": [
//       {
//         "Name": "Jet",
//         "Id": 0,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":true,
//         "reelInstance": {
//           "0": 2,
//           "1": 2,
//           "2": 2,
//           "3": 2,
//           "4": 2
//         },
//         "multiplier": [
//           [100, 0],
//           [50, 0],
//           [10, 0]
//         ],
//       },
//       {
//         "Name": "Yacht",
//         "Id": 1,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":true,
//         "reelInstance": {
//           "0": 3,
//           "1": 3,
//           "2": 3,
//           "3": 3,
//           "4": 3
//         },
//         "multiplier": [
//           [50, 0],
//           [25, 0],
//           [5, 0]
//         ],
//       },
//       {
//         "Name": "Car",
//         "Id": 2,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":true,
//         "reelInstance": {
//           "0": 4,
//           "1": 4,
//           "2": 4,
//           "3": 4,
//           "4": 4
//         },
//         "multiplier": [
//           [250, 0],
//           [100, 0],
//           [25, 0]
//         ],
//       },
//       {
//         "Name": "Watch",
//         "Id": 3,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":true,
//         "reelInstance": {
//           "0": 5,
//           "1": 5,
//           "2": 5,
//           "3": 5,
//           "4": 5
//         },
//         "multiplier": [
//           [100, 0],
//           [50, 0],
//           [10, 0]
//         ],
//       },
//       {
//         "Name": "Diamond",
//         "Id": 4,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":true,
//         "reelInstance": {
//           "0": 6,
//           "1": 6,
//           "2": 6,
//           "3": 6,
//           "4": 6
//         },
//         "multiplier": [
//           [50, 0],
//           [25, 0],
//           [5, 0]
//         ],
//       },
//       {
//         "Name": "A",
//         "Id": 5,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 4,
//           "1": 2,
//           "2": 2,
//           "3": 2,
//           "4": 2
//         },
//         "multiplier": [
//           [7, 0],
//           [5, 0],
//           [1, 0]
//         ],
//       },
//       {
//         "Name": "K",
//         "Id": 6,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 4,
//           "1": 2,
//           "2": 2,
//           "3": 2,
//           "4": 2
//         },
//         "multiplier": [
//           [5, 0],
//           [4, 0],
//           [1, 0]
//         ],
//       },
//       {
//         "Name": "Q",
//         "Id": 7,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 4,
//           "1": 2,
//           "2": 2,
//           "3": 2,
//           "4": 2
//         },
//         "multiplier": [
//           [5, 0],
//           [3, 0],
//           [1, 0]
//         ],
//       },
//       {
//         "Name": "J",
//         "Id": 8,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 4,
//           "1": 2,
//           "2": 2,
//           "3": 2,
//           "4": 2
//         },
//         "multiplier": [
//           [5, 0],
//           [2, 0],
//           [1, 0]
//         ],
//       },
//       {
//         "Name": "10",
//         "Id": 9,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 4,
//           "1": 2,
//           "2": 2,
//           "3": 2,
//           "4": 2
//         },
//         "multiplier": [
//           [4, 0],
//           [2, 0],
//           [1, 0]
//         ],
//       },
//       {
//         "Name": "9",
//         "Id": 10,
//         "useWildSub": true,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 4,
//           "1": 2,
//           "2": 2,
//           "3": 2,
//           "4": 2
//         },
//         "multiplier": [
//           [3, 0],
//           [2, 0],
//           [1, 0]
//         ],
//       },
//       {
//         "Name": "Wild",
//         "Id": 11,
//         "description": "",
//         "useWildSub": false,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 0,
//           "1": 20,
//           "2": 20,
//           "3": 20,
//           "4": 0
//         },
//         "multiplier": [],
//       },
//       {
//         "Name": "FreeSpin",
//         "Id": 12,
//         "useWildSub": false,
//         "isFreeSpinMultiplier":false,
//         "reelInstance": {
//           "0": 0,
//           "1": 0,
//           "2": 0,
//           "3": 0,
//           "4": 0
//         },
//         "description": "",
//         "useHeisenberg": true,
//         "multiplier": [

//         ]
//       },
//       {
//         "Name": "PrizeCoin",
//         "Id": 15,
//         "reelInstance": {
//           "0": 0,
//           "1": 0,
//           "2": 0,
//           "3": 0,
//           "4": 0
//         },
//         "description": "",
//         "useWildSub": false,
//         "useHeisenberg": false,
//         "multiplier": [

//         ]
//       },
//       {
//         "Name": "LosPollos",
//         "Id": 16,
//         "reelInstance": {
//           "0": 100,
//           "1": 1,
//           "2": 1,
//           "3": 1,
//           "4": 1
//         },
//         "description": "",
//         "useWildSub": false,
//         "useHeisenberg": false,
//         "multiplier": [

//         ]
//       },
//     ]
//   }
{
   "id":"SL-CRZ",
   "isSpecial":true,
   "matrix":{
      "x":4,
      "y":3
   },
   "linesApiData":[
      [
         1,
         1,
         1
      ]
   ],
   "linesCount":[
      1
   ],
   "bets":[
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
   "Symbols":[
      {
         "Name":"Blank",
         "Id":0,
         "isSpecialCrz":false,
         "payout":0,
         "SpecialType":"",
         "mixedPayout":0,
         "canmatch":[
            
         ],
         "reelInstance":{
            "0":35,
            "1":35,
            "2":35,
            "3":35
         }
      },
      {
         "Name":"777",
         "Id":1,
         "payout":500,
         "mixedPayout":10,
         "isSpecialCrz":false,
         "SpecialType":"",
         "canmatch":[
            "1",
            "2",
            "3"
         ],
         "description":"",
         "reelInstance":{
            "0":1,
            "1":1,
            "2":1,
            "3":0
         }
      },
      {
         "Name":"77",
         "Id":2,
         "payout":100,
         "mixedPayout":10,
         "isSpecialCrz":false,
         "SpecialType":"",
         "canmatch":[
            "1",
            "2",
            "3"
         ],
         "description":"",
         "reelInstance":{
            "0":3,
            "1":3,
            "2":3,
            "3":0
         }
      },
      {
         "Name":"7",
         "Id":3,
         "payout":50,
         "mixedPayout":10,
         "isSpecialCrz":false,
         "SpecialType":"",
         "canmatch":[
            "1",
            "2",
            "3"
         ],
         "description":"",
         "reelInstance":{
            "0":5,
            "1":5,
            "2":5,
            "3":0
         }
      },
      {
         "Name":"bar/bar",
         "Id":4,
         "payout":30,
         "mixedPayout":4,
         "isSpecialCrz":false,
         "SpecialType":"",
         "canmatch":[
            "4",
            "5"
         ],
         "description":"",
         "reelInstance":{
            "0":13,
            "1":13,
            "2":13,
            "3":0
         }
      },
      {
         "Name":"bar",
         "Id":5,
         "payout":20,
         "mixedPayout":4,
         "isSpecialCrz":false,
         "SpecialType":"",
         "canmatch":[
            "4",
            "5"
         ],
         "description":"",
         "reelInstance":{
            "0":17,
            "1":17,
            "2":17,
            "3":0
         }
      },
      {
         "Name":"10x",
         "Id":6,
         "payout":10,
         "mixedPayout":0,
         "isSpecialCrz":true,
         "canmatch":[
            
         ],
         "SpecialType":"MULTIPLY",
         "description":"All payout this round are multiplied by the corresponding multiplier",
         "reelInstance":{
            "0":0,
            "1":0,
            "2":0,
            "3":0
         }
      },
      {
         "Name":"5X",
         "Id":7,
         "payout":5,
         "mixedPayout":0,
         "SpecialType":"MULTIPLY",
         "isSpecialCrz":true,
         "canmatch":[
            
         ],
         "description":"All payout this round are multiplied by the corresponding multiplier",
         "reelInstance":{
            "0":0,
            "1":0,
            "2":0,
            "3":1
         }
      },
      {
         "Name":"2X",
         "Id":8,
         "payout":2,
         "mixedPayout":0,
         "SpecialType":"MULTIPLY",
         "isSpecialCrz":true,
         "canmatch":[
            
         ],
         "description":"All payout this round are multiplied by the corresponding multiplier",
         "reelInstance":{
            "0":0,
            "1":0,
            "2":0,
            "3":3
         }
      },
      {
         "Name":"DOUBLE+",
         "Id":9,
         "payout":100,
         "mixedPayout":0,
         "SpecialType":"ADD",
         "isSpecialCrz":true,
         "canmatch":[
            
         ],
         "description":"Win extra payout according to the player's bet amount",
         "reelInstance":{
            "0":0,
            "1":0,
            "2":0,
            "3":1
         }
      },
      {
         "Name":"ADD",
         "Id":10,
         "payout":10,
         "mixedPayout":0,
         "SpecialType":"ADD",
         "isSpecialCrz":true,
         "canmatch":[
            
         ],
         "description":"Win extra payout according to the player's bet amount",
         "reelInstance":{
            "0":0,
            "1":0,
            "2":0,
            "3":3
         }
      },
      {
         "Name":"RESPIN",
         "Id":11,
         "payout":0,
         "mixedPayout":0,
         "SpecialType":"RESPIN",
         "isSpecialCrz":true,
         "canmatch":[
            
         ],
         "description":"Gain 3 to 5 respins randomly on the winning combination.",
         "reelInstance":{
            "0":0,
            "1":0,
            "2":0,
            "3":50
         }
      },
      {
         "Name":"default",
         "Id":12,
         "payout":2,
         "mixedPayout":0,
         "SpecialType":"",
         "isSpecialCrz":"",
         "canmatch":[
            
         ],
         "description":"",
         "reelInstance":{
            "0":0,
            "1":0,
            "2":0,
            "3":0
         }
      }
   ],
   "defaultPayout":2
}

]
