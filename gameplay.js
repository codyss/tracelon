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
  console.log('Now assinging teams. \n Each player should come and access this prompt one by one, \n to see which team they are on');
  var playersObjs = newGame.players;
  var playersNames = playersObjs.map(function(playerO) {return playerO.name});
  inquirer.prompt([{
    type: 'list',
    name: 'player_name',
    message: 'Which player are you',
    choices: playersNames
  }], function (answer) {
      //result {player_name: 'Cody'}
      for(person in newGame.players) {
        if(person.name === answer.player_name) {
          //show the player's info for 3 seconds
          var seconds = 3
          console.log(player.info);
          console.log('clearing in ' + seconds + ' seconds')
          setTimeout(function () {clear(); inform();}, seconds * 1000);
        }
      }
      
  })
}


setTimeout(function() {console.log('Test')}, 2000)


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
      //Should count the number of players based on input and put into assing roles function
      //Assign roles
      // newGame.assignPlayers();
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