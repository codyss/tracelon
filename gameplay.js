var inquirer = require('inquirer');
var trace = require('./tracelon.js');
var Player = trace.Player;
var Game = trace.Game;
var Promise = require('bluebird');


//TEST MODE - true for test mode
//Auto loads members of Purple Trace to play
var test = false;


function promInquirer (promptArrOfObj) {
  //Gives Inquirer prompt promises to handle questions to multiple people
  return new Promise(function (resolve, reject) {
    inquirer.prompt(promptArrOfObj, function (answer) {
      resolve(answer);
    });
  });
}

function CLGame () {
  //create CL game object to attach methods to
  this.game = new Game();
  // this.gameMethods = Object.create(this.game);
}

CLGame.prototype.goOnQuest = function() {
  //Process Quest goers guesses
  var self = this;
  console.log('Quest Approved! Time to journey!');
  if(self.game.questers.length === 0) {
    self.endOfQuest();
  } else {
    promInquirer([{
        type: 'list',
        name: 'selection',
        message: self.game.questers[0] + " how do you vote?",
        choices: ['Success', 'Fail']
        }])
      .then(function (answer) {
         if(answer.selection === 'Success') {
          self.game.currentQuestVotes.success += 1;
        } else {
          self.game.currentQuestVotes.fail += 1;
        }
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        self.game.questers.shift();
        self.goOnQuest();
      });
  }
};

CLGame.prototype.endOfQuest = function() {
  // at end of each quest determine whether it succeeded or failed and reset board
  if(this.game.currentQuestVotes.fail > 0) {
    console.log('Quest Failed');
    this.game.badWins += 1;
  } else {
    console.log('Quest Succeeded');
    this.game.goodWins += 1;
  }
  this.game.questsComplete += 1;
  this.game.turnOver();
  this.game.showBoard();
  this.ladyOrQuest();
};

CLGame.prototype.ladyOrQuest = function() {
   //determine if the game is over 
   this.game.setQuestSize();
   if (this.game.goodWins=== 3) {
      console.log('Good Team Passed All Their Quests!\n')
      //bad get to choose Merlin
      this.guessMerlin();
   } else if (this.game.badWins === 3) {
      console.log('Bad Team Wins!!!\n')
   } else if (this.game.questsComplete >= 2) {
    this.playLady();
  } else {
    this.chooseQuest();
  }
};


CLGame.prototype.guessMerlin = function() {
  // body...
  var self = this;
  var playersNames = self.getNames();
  promInquirer([{
        type: 'list',
        name: 'selection', 
        message: "Bad Team. Who do you think is Merlin??",
        choices: playersNames
        }])
  .then(function (answer) {
    if(answer.selection === self.game.merlin.name) {
      console.log('Correct: ' + self.game.merlin.name + ' was Merlin!')
      console.log('Bad Team Wins!!!\n');
    } else {
      console.log('Nope. ' + self.game.merlin.name + ' was Merlin!\n');
      console.log('Good Team Wins!!!\n');
    }
  })
};


CLGame.prototype.playLady = function() {
  // Person who has the lady plays
  var self = this;
  console.log(self.game.hasLady.name + " your turn to ask someone what team they are on. \n Everyone else back away from the screen.");
  var playersNames = self.getNames();
  promInquirer([{
        type: 'list',
        name: 'selection', 
        message: "Who do you pick?",
        choices: playersNames
        }])
    .then(function(choice) {
      //add the team that the person is on the lady player's info
      var playerToInform;
      for (var i = 0; i < self.game.players.length; i++) {
        if (self.game.players[i].name === choice.selection) {
          playerToInform = self.game.players[i]; 
        }
      };
      var infoToAdd = '';
      infoToAdd += " " + playerToInform.name + " is " + playerToInform.team + ". ";
      self.game.hasLady.info += infoToAdd;
      console.log(self.game.hasLady.info);
      console.log("Message will dissaper in three seconds");
      setTimeout(function () {
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        self.game.hasLady.hasLady = false;
        playerToInform.hasLady = true;
        self.game.hasLady = playerToInform;
        self.chooseQuest();
      }, 3000)
    })
};


CLGame.prototype.vote = function() {
  //simple version will use tallying of votes outside of the console
  //Use thumbs up to vote yay
  var self = this;
  console.log('Time to vote on the quest\n' + "If you want this quest, put your thumb up \n" + "If you don't want this quest, put your thumb down\n");
  inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: 'Vote:',
    choices: ['Accepted', 'Rejected']
  }], function (answer) {
    if(answer.selection === 'Accepted') {
      //RESET TRY COUNT
      self.game.currentRejects = 0;
      //GO ON THE QUEST
      self.goOnQuest();
    } else {
      //move the current player to the back of the line
      self.game.turnOver();
      self.chooseQuest();
    }
  });
};


CLGame.prototype.chooseQuest = function() {
  //Actual gameplay once set up
  var self = this;
  var playersNames = this.getNames();
  this.game.setQuestSize();
  console.log(playersNames[0] + "'s turn. Who do you want to take on the quest? Pick " + this.game.questSize + " players for the quest.");
  inquirer.prompt([{
    type: 'checkbox',
    //space bar to select multiple players
    name: 'selection',
    message: 'Pick:',
    choices: playersNames
  }], function (answer) {
    if(answer.selection.length === self.game.questSize) {
      //EVERYONE GETS TO PLAY PASS OR FAIL QUEST
      self.game.questers = answer.selection;
      self.vote();
    } else {
      console.log('You need to choose ' + self.game.questSize + " player for the quest. You chose " + answer.selection.length + " players.")
      self.chooseQuest();
    }
  });
};


CLGame.prototype.inform = function() {
  //Gives everyone their information - teams and knowledge of other players
  var self = this;
  console.log('Each player should come and access this prompt one by one, \n to see which team they are on');
  var options = this.getNames();
  options.push("Game Time!");
  options.push("Add another player");

  promInquirer([{
    type: 'list',
    name: 'player_name',
    message: 'Which player are you?',
    choices: options
    }])
  .then(function(answer) {
      if(answer.player_name === 'Game Time!') {
        self.chooseQuest();
      } else if (answer.player_name === 'Add another player') {
        //Allows chance to go back and add another player
        self.setup();
      } else {
        self.game.players.forEach(function(person) {
          if(person.name === answer.player_name) {
            console.log(person.info);
            self.doneWithInfo();
          }
        });
      }
    })
};

CLGame.prototype.doneWithInfo = function() {
  //Prompts user when done with seeing the team info
  var self = this;
  promInquirer([{
    type: 'confirm',
    name: 'res',
    message: 'Press Enter when done'
    }])
  .then(function(answer) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    self.inform();
  })
};


CLGame.prototype.getNames = function() {
  // returns player names for use in prompt
  return this.game.players.map(function(playerO) {return playerO.name;});
};


CLGame.prototype.addPlayer = function() {
  //Set up the game with the players
  var self = this;
  promInquirer([{
    type: 'input',
    name: 'player_name',
    message: 'Enter your name'
  }]).then(function(answer) {
    var newPlayer = new Player(answer.player_name.trim());
      self.game.addPlayers(newPlayer);
  }).then(function() {self.setup();});
};

CLGame.prototype.setup = function() {
  //Start the set up process for the game to add players
  var self = this;
  promInquirer([{
    type: 'list',
    name: 'selection',
    message: 'Game setup: Add a player or start game?',
    choices: ['Add Player', 'Everyone Added']
  }]).then(function(answer) {
    if(answer.selection === 'Add Player') {
      //add a player then run setup again
      self.addPlayer();
      // self.setup();
    } else if (self.game.players.length < 5) {
      console.log('Minimum of 5 players');
      self.setup();
    } else {
      //start the game
      //Assign roles
      self.game.assignPlayers();
      //Save roles into each player's info attribute
      self.game.informPlayers();
      //Go to inform prompt
      self.inform();
    }
  });
};


//New CL Game object, creates a Game object and start the game
newGame = new CLGame();
// console.log(newGame.gameMethods.addPlayers);
newGame.setup();



//FOR TESTING PURPOSES - SETTING UP GAME WITH 6 PLAYERS
if(test) {
  var names = ['Cody', 'Jai', 'Cindy', 'Hailey', 'Patrick', 'Dan'];
  for(var i = 0; i < 6; i++) {
    var ply = new Player(names[i]);
    newGame.game.addPlayers(ply);
  }
}

//Game Play
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

