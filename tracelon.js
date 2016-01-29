//Brainstorming for Avalon Trace


//Game Play
//Set the bad players, good players and Merlin
//Inform bad players of each other
//Inform Merlin of the bad players
//Create board with status
//Game Play
//1. Assign random starter, Lady to left of starter
//2. Player picks people to go on quest
//3. Everyone votes to approve or reject the quest
//4. Tally votes
//5. If quest, those on quest decide wether it is a success or failure (really just the bad person votes)
//    If not quest, track failures up to 5, next turn goes without votes
//6. If one failure, bad win quest, otherwise good win
//7. Repeat Turn
//8. Lady - can ask someone if they are are good or bad - they are informed of that peron's role
//9. Repeat Turn, Lady Until one team has 3 quests
//10. Bad try to guess Merlin



function Person (name) {
  this.name = name;
  this.team = null; //'Good' || 'Bad'
  this.merlin = false;
  this.hasLady = false;
  this.isTurn = false; 
}



function Game () {
  this.players = []; //Array of players
  this.goodWins = 0;
  this.badWins = 0;
  this.currentRejects = 0; //number of quest trials for current turn
}

Game.prototype.addPlayers = function(playerObj) {
  //Add a player to the game
  this.player.push(playerObj);
};

Game.prototype.assignPlayers = function() {
  //Set the bad players, good players and Merlin
  //It's ugly
  var bad_index1 = Math.floor(Math.random()*6);
  var bad_index2 = Math.floor(Math.random()*6);
  var merlin_index = Math.floor(Math.random()*6);
  while (bad_index2 === bad_index1) {
    bad_index2 = Math.floor(Math.random()*6);
  }
  while (merlin_index === bad_index1 || merlin_index == bad_index2) {
    merlin_index = Math.floor(Math.random()*6);   
  }
  this.players[bad_index1].team = "bad";
  this.players[bad_index2].team = "bad";
  this.players[merlin_index].team = "good";
  this.players[merlin_index].merlin = true;
  this.players.forEach(function(player) {
    if(!player.team) player.team = 'good';
  });
};

Game.prototype.informPlayers = function() {
  //Inform bad players of each other
  //Inform Merlin of the bad players
};

Game.prototype.showBoard = function() {
  //Visual depiction of board - with status
  console.log('Good Wins: ' + this.goodWins);
  console.log('Bad Wins: ' + this.badWins);
  console.log('Current trys: ' + this.currentRejects);
};

Game.prototype.starter = function() {
  //Assigs the starter used a random number to each player. order from low to high for order
  this.players.forEach(function (player) {
    player.random = Math.random();
  });
  this.players.sort(function(a, b) {
    return a.random - b.random;
  });
  this.players[0].isTurn = true;
  this.players[1].hasLady = true;
};



