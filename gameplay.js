var inquirer = require('inquirer');
var trace = require('./tracelon.js');
var Player = trace.Player;
var Game = trace.Game;


// var newPlayer = new Player('Cody');
// var game = new Game();
// game.addPlayers(newPlayer);

// game.players.forEach(function (player) {
//   console.log(player.name);
// })


// function play (game) {
//   //Actual gameplay once set up
//   var choices = "" //Options for gameplay

//   inquirer.prompt({
//     type:'list'
//   })
// }

function inform () {
  inquirer.prompt([{
    type: 'list',
    name: 'player_name',
    message: 'Which player are you'
  }], function (answer) {
      var newPlayer = new Player(answer.player_name.trim());
      newGame.addPlayers(newPlayer);
  })
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
  })
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
      //addPlayer is not blocking... maybe turn into a promise to improve how it works
      setup();
    } else {
      //start the game
      //Assign roles
      newGame.assignPlayers();
      //Save roles into each player's info attribute
      newGame.informPlayer();
      //Go to inform prompt
      inform();
    }
  })
}


//Start the setup process
setup();

//Set up a game object
newGame = new Game();