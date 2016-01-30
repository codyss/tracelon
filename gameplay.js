var inquirer = require('inquirer');
var trace = require('./tracelon.js');
var Player = trace.Player;
var Game = trace.Game;



//TEST MODE - true for test mode
var test = true;

// var newPlayer = new Player('Cody');
// var game = new Game();
// game.addPlayers(newPlayer);

// game.players.forEach(function (player) {
//   console.log(player.name);
// })


function play () {
  //Actual gameplay once set up
}

function inform () {
  newGame.players.forEach (function (item) {
    console.log(item.info);
  })
  console.log('Now assinging teams. \n Each player should come and access this prompt one by one, \n to see which team they are on');
  var playersObjs = newGame.players;
  var playersNames = playersObjs.map(function(playerO) {return playerO.name});
  playersNames.push("Game Time!");
  inquirer.prompt([{
    type: 'list',
    name: 'player_name',
    message: 'Which player are you?',
    choices: playersNames
  }], function (answer) {
      if(answer.player_name === 'Game Time!') {
        console.log('Gaming!');
        play();
      } else {
        var seconds = 3;
        newGame.players.forEach(function(person) {
          if(person.name === answer.player_name) {
            //show the player's info for 3 seconds
            console.log(person.info);
            console.log('clearing in ' + seconds + ' seconds')
          }
        });
        setTimeout(function () {inform();}, seconds * 1000);
      }
  });
}

function addPlayer () {
  //Set up the game with the players
  inquirer.prompt([{
    type: 'input',
    name: 'player_name',
    message: 'Enter your name'
  }], function (answer) {
      var newPlayer = new Player(answer.player_name.trim());
      newGame.addPlayers(newPlayer);
  });
}


function setup () {
  //Start the set up process for the game to add players
  inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: 'Game setup: Add a player or start game?',
    choices: ['Add Player', 'Everyone Added']
  }], function (answer) {
    if(answer.selection === 'Add Player') {
      //add a player then run setup again
      addPlayer();
      //addPlayer is not blocking... setTimeout being used, potentially change to a listener
      setTimeout(function () {setup();}, 3000);
      // setup();
    } else if (newGame.players.length < 5) {
      console.log('Minimum of 5 players');
      setup();
    } else {
      //start the game
      //Assign roles
      newGame.assignPlayers();
      //Save roles into each player's info attribute
      newGame.informPlayers();
      //Go to inform prompt
      inform();
    }
  })
}


//Start the setup process
setup();

//Set up a game object
newGame = new Game();



//FOR TESTING PURPOSES - SETTING UP GAME WITH 6 PLAYERS
if(test) {
  var names = ['Cody', 'Jay', 'Cindy', 'Hailey', 'Patrick', 'Dan']
  for(var i = 0; i < 6; i++) {
    var ply = new Player(names[i]);
    newGame.addPlayers(ply);
  }
}





