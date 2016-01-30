var inquirer = require('inquirer');
var trace = require('./tracelon.js');
var Player = trace.Player;
var Game = trace.Game;
var Promise = require('bluebird');


function promInquirer (promptArrOfObj) {
  return new Promise(function (resolve, reject) {
    inquirer.prompt(promptArrOfObj, function (answer) {
      resolve(answer);
    });
  });
}






//TEST MODE - true for test mode
var test = true;


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



function goOnQuest () {
  console.log('Quest Approved! Time to journey!');
  if(newGame.currentQuestVotes.success + newGame.currentQuestVotes.fail === newGame.questers.length) {
    endOfQuest();
  } else {
    promInquirer([{
        type: 'list',
        name: 'selection',
        message: each.name + "how do you vote?",
        choices: ['Success', 'Fail']
        }])
      .then(function (answer) {
         if(answer.selection === 'Success') {
          newGame.currentQuestVotes.success += 1;
        } else {
          newGame.currentQuestVotes.fail += 1;
        }
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
        goOnQuest();
      })
  }
};

function endOfQuest () {
    if (newGame.currentQuestVotes.fail > 0) {
    console.log('Quest Failed');
    newGame.badWins += 1;
    newGame.turnOver();
    chooseQuest();
  } else {
    console.log('Quest Succeeded');
    newGame.goodWins += 1;
    newGame.turnOver();
    chooseQuest()
  }
}


function vote () {
  //simple version will use tallying of votes outside of the console
  //Use thumbs up to vote yay
  console.log('Time to vote on the quest\n' + "If you want this quest, put your thumb up \n" + "If you don't want this quest, put your thumb down\n");
  inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: 'Vote:',
    choices: ['Accepted', 'Rejected']
  }], function (answer) {
    if(answer.selection === 'Accepted') {
      //GO ON THE QUEST
      goOnQuest();
    } else {
      //move the current player to the back of the line
      newGame.turnOver();
      chooseQuest();
    }
  });
  
}


function chooseQuest () {
  //Actual gameplay once set up
  var questSize = trace.QUESTSIZES[newGame.gameSize][newGame.questsComplete];
  var playersNames = newGame.players.map(function(playerO) {return playerO.name;});
  console.log(playersNames[0] + "'s turn. Who do you want to take on the quest? Pick " + questSize + " players for the quest.");
  inquirer.prompt([{
    type: 'checkbox',
    //space bar to select multiple players
    name: 'selection',
    message: 'Pick:',
    choices: playersNames
  }], function (answer) {
    if(answer.selection.length === questSize) {
      //EVERYONE GETS TO PLAY PASS OR FAIL QUEST
      newGame.questers = answer.selection;
      vote();
    } else {
      console.log('You need to choose ' + questSize + " player for the quest. You choose " + answer.selection.length + " players.")
      chooseQuest();
    }
  });
}

function inform () {
  console.log('Now assinging teams. \n Each player should come and access this prompt one by one, \n to see which team they are on');
  var options = newGame.players.map(function(playerO) {return playerO.name;});
  options.push("Game Time!");
  options.push("Add another player");
  inquirer.prompt([{
    type: 'list',
    name: 'player_name',
    message: 'Which player are you?',
    choices: options
  }], function (answer) {
      if(answer.player_name === 'Game Time!') {
        chooseQuest();
      } else if (answer.player_name === 'Add another player') {
        //Allows chance to go back and add another player
        setup();
      } else {
        //show the player's info for 3 seconds
        var seconds = 3;
        newGame.players.forEach(function(person) {
          if(person.name === answer.player_name) {
            console.log(person.info);
            console.log('clearing in ' + seconds + ' seconds');
          }
        });
        // Multiple line blocks to effectively clear the screen on a small enough terminal
        setTimeout(function () {console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'); inform();}, seconds * 1000);
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
  });
}



//Set up a game object
newGame = new Game();

//Start the setup process
setup();



function promiseAddPlayer () {
  //Set up the game with the players
  promInquirer([{
    type: 'input',
    name: 'player_name',
    message: 'Enter your name'
  }]).then(function(answer) {
    console.log(answer);
  });
}




//FOR TESTING PURPOSES - SETTING UP GAME WITH 6 PLAYERS
if(test) {
  var names = ['Cody', 'Jay', 'Cindy', 'Hailey', 'Patrick', 'Dan'];
  for(var i = 0; i < 6; i++) {
    var ply = new Player(names[i]);
    newGame.addPlayers(ply);
  }
}



//Aync solution with inquirer - trying Promises instead
// var prompts = Rx.Observable.create(function( obs ) {
//   obs.onNext({
//     type: 'list',
//     name: 'selection',
//     message: 'Game setup: Add a player or start game?',
//     choices: ['Add Player', 'Everyone Added']
//   });
//   setTimeout(function () {
//     obs.onNext({
//     type: 'list',
//     name: 'player_name',
//     message: 'Which player are you?',
//     choices: options
//   });
//     obs.onCompleted();
//   });
// });

// inquirer.prompt(prompts);


