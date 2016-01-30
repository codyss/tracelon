//Brainstorming for Avalon Trace


//Setup
//Set the bad players, good players and Merlin
//Inform bad players of each other
//Inform Merlin of the bad players
//Create board with status
//Game Play
//1. Assign random starter, Lady to left of starter
//2. Player picks people to go on quest
//3. Everyone votes to approve or reject the quest
//4. Tally votes
//5. If quest, those on quest decide wether it is a success or failure (really just the bad player(s) votes)
//    If not quest, track failures up to 5, next turn goes without votes
//6. If one failure, bad win quest, otherwise good win
//7. Repeat Turn
//8. Lady - can ask someone if they are are good or bad - they are informed of that peron's role
//9. Repeat Turn, Lady Until one team has 3 quests
//10. Bad try to guess Merlin



function Player (name) {
  this.name = name;
  this.team = null; //'Good' || 'Bad'
  this.merlin = false;
  this.hasLady = false;
  this.isTurn = false;
  this.info = '';
}

Player.prototype.showInfo = function() {
  //Show this players information
  process.stdout.write(this.info);
};

Player.prototype.pickQuestMembers = function() {
  // body...

};


function Game () {
  this.players = []; //Array of players
  this.goodPlayers = []; //Array of good players
  this.badPlayers = []; //Array of bad players
  this.goodWins = 0;
  this.badWins = 0;
  this.currentRejects = 0; //number of quest trials for current turn
}

Game.prototype.addPlayers = function(playerObj) {
  //Add a player to the game
  //Or add an array of players
  var self = this;
  if(playerObj instanceof Player) {
    this.players.push(playerObj);
  } else if (playerObj instanceof Array) {
    playerObj.forEach(function(player) {
      self.players.push(player);
    })
  }
};

Game.prototype.assignPlayers = function() {
  //Set the bad players, good players and Merlin  
  //Dynamic Way
  var self = this;
  shuffleArray(self.players);
  var num_bad = TEAMSPLITS[self.players.length].bad;
  // var num_good = TEAMSPLITS[self.players.length].good; NOT NECESSARY
  self.players.forEach(function (player, index) {
    if(index === 0) {
      player.merlin = true;
      player.team = 'Good';
      self.goodPlayers.push(player);
    } else if (index <= num_bad) {
      player.team = 'Bad';
      self.badPlayers.push(player);
    } else {
      player.team = 'Good';
      self.goodPlayers.push(player);
    }
  });
  //Reshuffling so the order of names doesn't give away roles. Will also set the starting position
  shuffleArray(self.players);
  this.starter();
};

Game.prototype.informPlayers = function() {
  //Inform bad players of each other
  //Inform Merlin of the bad players
  //Put this information in the Player's info attribute
  var self = this;
  this.players.forEach(function (player, index, array) {
    if(player.team === 'Bad') {
      player.info +=  "You are bad. ";
      self.badPlayers.forEach(function (badPlayer) {
        player.info +=  badPlayer.name + " is bad. ";
      })
    } else if (player.merlin === true) {
      player.info +=  "You are Merlin. ";
      self.badPlayers.forEach(function (badPlayer) {
        player.info += badPlayer.name + " is bad. ";
      })  
    } else if (player.team === 'Good') {
      player.info += " You are Good.";
    } else if (player.hasLady === true) {
      player.info += ' You have the Lady.';
    }
  })
};

Game.prototype.showBoard = function() {
  //Visual depiction of board - with status
  output = 'Good Quest Wins: ' + this.goodWins + "\n" + 'Bad Quest Wins: ' + this.badWins + "\n" + 'Current trys: ' + this.currentRejects;
  process.stdout.write(output);
};

Game.prototype.starter = function() {
  //Assigns the starter used a random number to each player. order from low to high for order
  this.players[0].isTurn = true;
  this.players[this.players.length - 1].hasLady = true;
};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


var TEAMSPLITS = {
  //based on number of players, says how many good and bad
  5: {good: 3, bad: 2},
  6: {good: 4, bad: 2},
  7: {good: 4, bad: 3},
  8: {good: 5, bad: 3},
  9: {good: 6, bad: 3},
  10: {good: 6, bad: 4}
};

var QUESTSIZES = {
  //based on number of players, decides the game board
  5: [2,3,2,3,3],
  6: [2,3,4,3,4],
  7: [2,3,3,4,4],
  8: [3,4,4,5,5],
  9: [3,4,4,5,5],
  10: [3,4,4,5,5]
};



module.exports = {
  Player: Player,
  Game: Game
};
