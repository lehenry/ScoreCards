/* global module */
/**
 * ScoreCards Application
 */

var players=[];

var UI = require('ui');
var Settings = require('settings');
var Feature = require('platform/feature');
var Player = require('./player.js');
var Game = require('./game.js');
var Scores = require('./scores.js');
var App=module.exports;

var playersNames = [];
var isBestMax=true;
var initScore=0;


//unserialize stored players
if(localStorage.getItem('playerNames')){
  try {
   console.log('Local: '+JSON.parse(localStorage.getItem('playerNames')));
   playersNames = JSON.parse(localStorage.getItem('playerNames'));
   isBestMax = JSON.parse(localStorage.getItem('isBestMax'));
   initScore = Number(JSON.parse(localStorage.getItem('initScore')));
   init();
  } catch(err){
    console.log(err);
  }
} else {
  playersNames=['Open app Settings'];
}

// Load configuration
Settings.config(
  { url: 'http://lehenry.github.io/index.html' },
  function(e) {
    console.log('opening configurable');
    // Reset the setting page player order on opening config
    Settings.option('players', JSON.stringify(playersNames));
  },  
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
    console.log(JSON.stringify(e.options));
    //Init players
    playersNames=Settings.option('playerNames');
    isBestMax=Settings.option('isBestMax');
    initScore=Number(Settings.option('initScore'));
    if(playersNames===null){
      playersNames=['Open app Settings'];
    }else{
      localStorage.setItem('playerNames', JSON.stringify(playersNames));
      localStorage.setItem('initScore', JSON.stringify(initScore));
      localStorage.setItem('isBestMax', JSON.stringify(isBestMax));
    }
    init();

    // Show the raw response if parsing failed
    if (e.failed) {
      //console.log(e.response);
    }
  }
);

//init players
function init(){
  players=[];
  console.log("Init Players");
  for(var i=0;i<playersNames.length;i++){
    players[i]=new Player.Player(playersNames[i], true);
    console.log(playersNames[i]+" added");
  }
}
init();

//main menu
var menu = new UI.Menu({
  sections: [{
    title: "ScoreCards",
    items: [{
        title: ' New Game',
        icon: 'IMAGES_SCORECARD_PNG'
    }, {
        title: 'Set Players'
    },{
        title: 'Scores'
    },{
        title: 'Resume'
    }]
  }]
});
  
menu.on('select', function(e) {
  if(e.itemIndex===0){
    //new Game - next selected menu entry is "resume"
    e.itemIndex=3;
    newGame();
  } else if (e.itemIndex==1){
    //"Set Players" menu
    var menuPlayers = new UI.Menu();
    
    for(var i=0;i<playersNames.length;i++){
      menuPlayers.item(0,i,
        {title:players[i].playerName, 
         subtitle:(players[i].isActive)?"Active":"Inactive"
        });
    }
    menuPlayers.show();
    //on click change status active/inactive
    menuPlayers.on('select',function(ev){
      if(players[ev.itemIndex].isActive){
        players[ev.itemIndex].isActive=false;
      }else{
        players[ev.itemIndex].isActive=true;
      }
      menuPlayers.item(0,ev.itemIndex,
        {title:players[ev.itemIndex].playerName, 
         subtitle:(players[ev.itemIndex].isActive)?"Active":"Inactive"
        });
    });
    //on long click, selected player becomes first player
    menuPlayers.on('longSelect', function(e) {
      console.log(e.itemIndex);
      for(var i=0;i<e.itemIndex;i++){
        var last=players.shift();
        players.push(last);
        var lastName=playersNames.shift();
        playersNames.push(lastName);
      }
      //save player order
      localStorage.setItem('playerNames', JSON.stringify(playersNames));
      for(var j=0;j<playersNames.length;j++){
        menuPlayers.item(0,j,
          {title:players[j].playerName, 
           subtitle:(players[j].isActive)?"Active":"Inactive"
          });
      }
      menuPlayers.selection(0,0);
    });
  } else if (e.itemIndex==2){
    if(App.game instanceof Game.Game){
      //display scores
      if(Feature.round()){
        Scores.displayScoresRound();
      } else {
        Scores.displayScores();
      }
    }
  } else if (e.itemIndex==3){
    //resume to current player (or start new game)
    if(App.game instanceof Game.Game){
      App.game.resume();  
    } else {
      newGame();
    }
  }
});



        
menu.show();

// init, start new game
function newGame(){
  var activePlayers=[];
  for(var i=0;i<players.length;i++){
    if(players[i].isActive){
      players[i].score=0;
      activePlayers.push(players[i]);
      
    }
  }
  App.game=new Game.Game(activePlayers, isBestMax, initScore);
  App.game.nextPlayer();
}


