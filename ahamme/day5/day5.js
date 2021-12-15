//Import ExpressJS Module
const express = require('express');
//Create express application object
const app = express()

app.set("view engine", "ejs");


class GameMatch {
  constructor() {
    this.id = gameList.length + 1000;
    this.turn = 0; // This is the index of this.players whose turn it is
    this.players = [];
    this.round = 0;
  }
}

class Character {
  constructor(name, race, profession) {
    this.id = characterList.length + 1000;
    this.name = name
    this.race = race
    this.profession = profession
    this.equipment = {
      head: {},
      chest: {},
      legs: {},
      arm_p: {},
      arm_s: {}
    }
    this.inventory = []
    this.abilities = []
    this.stats = {
      attack: 1,
      defense: 0,
      speed: 0,
      hp_current: 0,
      hp_max: 2,
    }
    //Searches for an item in the item list with this name and adds it to this character's inventory
    this.pickupItem = function(searchName) {
      for (var item of item_list) {
        console.log(item.name);
        if (item.name == searchName) {
          console.log("Found a match!");
          this.inventory.push(item)
          break;
        }
      }
    }
    //Searches for a given slot and overwrites it with an emtpy object
    this.unequipItem = function(slot) {
      for (var slotName in this.equipment) {
        console.log(slotName);
        if (slotName == slot) {
          console.log("Found item slot. Removing.");
          this.equipment.slotName = {};
          break;
        }
      }
    }

  }
}


//This holds all possible items
var item_list = [{
    name: 'Cool Hat',
    slot: 'head',
    bonuses: {
      defense: 0,
      hp_max: 3
    }
  },
  {
    name: 'Bag',
    slot: 'arm_s',
    bonuses: {
      defense: 1
    }
  }
];

var gameList = [];

// Create characterList is 2 default characters
var characterList = []
characterList.push(new Character('Steve Jobs', 'Kindergarden Dropout', 'CEO of Apple'))
characterList.push(new Character('Bill Gates', 'Kindergarden Dropout', 'CEO of Microsoft'))

for (var character of characterList) {
  character.pickupItem('Cool Hat');

}

//Create a GET endpoint
app.get('/game', (req, res) => {
  //search for the game in the gameList
  var foundGame = gameList.find(game => game.id == req.query.gameid)
  //If a game was found we can manipulate it
  if (foundGame) {
    //Check to see if the user sent the addcharacter query param (&addcharacter=xxxx)
    if (req.query.addcharacter) {
      // Check to see if there is room in this game's player list to add a character
      if (foundGame.players.length < 2) {
        //Find the character with the given addcharacter id
        var foundProfile = characterList.find(character => character.id == req.query.addcharacter)
        //If the character was found add it's id to this games character list
        if(foundProfile) {
          foundGame.players.push(foundProfile.id)
        }
      }
    }
    //Render a template called game from the views folder and send it a variable called "sendData"
    res.render('game', {
      sendData: foundGame
    })
  } else {
    res.redirect('/newgame');
  }
});

//This endpoints creates a new game
app.get('/newgame', (req, res) => {
  gameList.push(new GameMatch());
  res.redirect('/game/?gameid=' + gameList[gameList.length - 1].id)
});

//Create a GET endpoint
app.get('/profile', (req, res) => {
  var foundProfile = characterList.find(character => character.id == req.query.characterid)

  if (foundProfile) {
    //Render a template called profile from the views folder and send it a variable called "sendData"
    res.render('profile', {
      sendData: foundProfile
    })
  } else {
    res.redirect('/newprofile');
  }
});

//This endpoints creates a new character
app.get('/newprofile', (req, res) => {
  characterList.push(new Character('Job Steve', 'CEO of Apple', 'Guy'))
  res.redirect('/profile/?characterid=' + characterList[characterList.length - 1].id)
});

//Start an HTTP Listen Server
app.listen(3000)
