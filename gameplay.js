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


//Inform the players of their roles

// function player (game) {
//   //Set up the game with the players
//   inquirer.prompt(['Players enter their names or enter PLAY to start'], function (answer) {
//     if (answer === 'PLAY') {
//       play(game);
//     } else {
//       var newPlayer = new Player(answer);
//       game.addPlayers(newPlayer);
//       start(game);
//     }
//   })
// }


function setup () {
  //Start the set up process for the game to add players
  inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: 'Game setup: Add a player or start game?',
    choices: ['Add Player', 'Start Game']
  }], function (answer) {
    if(answer.selection === 'Add Player') {
      //add a player then run setup again

      setup();
    } else {
      //start the game
      
    }
  })
}


//Start the setup process
setup();

//Set up a game object
newGame = new Game();

// start(newGame)