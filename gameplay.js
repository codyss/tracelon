var inquirer = require('inquirer');
var trace = require('tracelon.js');
var Player = trace.Player;
var Game = trace.Game;



function play (game) {
  //Actual gameplay once set up
  var choices = "" //Options for gameplay

  inquirer.prompt({
    type:'list'
  })
}


function start (game) {
  //Set up the game with the players
  inquirer.prompt(['Players enter their names or enter PLAY to start'], function (answer) {
    if (answer === 'PLAY') {
      //run play
    } else {
      var newPlayer = new Player(answer);
      game.addPlayers(newPlayer);
      start(game);
    }
  })
}



newGame = new Game();

start(newGame)