/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var currentPlayer=-1;
var currentRound=0;
var topScore=0;
var topPlayer=0;
var players=[];

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
console.log('Local: '+localStorage.getItem('playerNames'));
var playersNames = [];
if(localStorage.getItem('playerNames')){
 playersNames = JSON.parse(localStorage.getItem('playerNames'));
}
// Load configuration
Settings.config(
  { url: 'http://lehenry.github.io/index.html' },
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
    console.log(JSON.stringify(e.options));
    //Init players
    playersNames=Settings.option('playerNames');
    if(playersNames===null){
      playersNames=['Loïc'];
    }
    init();

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);

//##################
// START UI PlayerCard definition

var PlayerCard=function(playerName,color){
  this.wind = new UI.Window({
    //fullscreen: true,
  });
  this.title = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 55),
    font: 'gothic-28-bold',
    text: playerName,
    textAlign: 'center'
  });
  this.wind.add(this.title);
  this.scoreBox = new UI.Text({
    position: new Vector2(0, 55),
    size: new Vector2(144, 35),
    font: 'bitham-30-black',
    text: "0",
    backgroundColor: "white",
    color: "black",
    textAlign: 'center'
  });
  this.wind.add(this.scoreBox);
  
  this.roundScoreBox = new UI.Text({
    position: new Vector2(0, 90),
    size: new Vector2(144, 30),
    text: "",
    textAlign: 'center'
  });
  this.wind.add(this.roundScoreBox);
  
  this.topScore = new UI.Text({
    position: new Vector2(0, 130),
    size: new Vector2(144, 30),
    text: "",
    font: 'gothic_14',
    textAlign: 'center',
    color: 'blue',
    backgroundColor: '#aaaaaa'
  });
  this.wind.add(this.topScore);
  
  this.wind.on('click', 'select', function(e) {
    nextPlayer();
  });
  this.wind.on('longClick', 'select', function(e) {
    previousPlayer();
  });  
  this.wind.on('click', 'up', function(e) {
    players[currentPlayer].addScore();
  });
  this.wind.on('click', 'down', function(e) {
    players[currentPlayer].minusScore();
  });
  this.wind.on('longClick', 'up', function(e) {
    players[currentPlayer].add5Score();
  });
  this.wind.on('longClick', 'down', function(e) {
    players[currentPlayer].minus5Score();
  });
};
PlayerCard.prototype.displayScore=function(score,roundScore){
  this.scoreBox.text(score+"");
  this.roundScoreBox.text("Round #"+(currentRound+1)+": "+roundScore+"");
  this.topScore.text("1st: ["+ players[topPlayer].playerName.substring(0,16)+": "+topScore+"]");
};


// END UI PlayerCard
//##################

//var playersColors = ['red','green','pink','blue'];

//##################
// START Player Definition
var Player=function(playerName,color){
  this.playerName=playerName;
  this.score=0;
  this.roundScore=[];
  this.active=true;
  this.card=new PlayerCard(playerName);
    
    // this.card=new UI.Card({
//  action: {
//    up: 'images/action_icon_plus.png',
//    down: 'images/action_icon_minus.png'
  //  }});

  this.card.player=this;  
};

Player.prototype.addScore=function(){
  this.score++;
  this.roundScore[currentRound]++;
  this.displayScore();
};
Player.prototype.add5Score=function(){
  this.score+=5;
  this.roundScore[currentRound]+=5;
  this.displayScore();
};
Player.prototype.minusScore=function(){
  this.score--;
  this.roundScore[currentRound]--;
  this.displayScore();
};
Player.prototype.minus5Score=function(){
  this.score-=5;
  this.roundScore[currentRound]-=5;
  this.displayScore();
};
Player.prototype.displayScore=function(){
  if(this.score>topScore){
    topScore=this.score;
    topPlayer=currentPlayer;
  }else if(topPlayer==currentPlayer){
    getTopPlayer();
  }
    var scores="";
    if(this.roundScore[currentRound]>=0){
      scores+="+";
    }
    scores+=this.roundScore[currentRound]+"";
  this.card.displayScore(this.score+"",scores);
};
Player.prototype.show=function(){
  this.displayScore();
  this.card.wind.show();
};
Player.prototype.hide=function(){
  this.card.wind.hide();
};
// END Player Definition
//##################

//init players
function init(){
  players=[];
  currentPlayer=-1;
  currentRound=0;
  console.log("Init Players");
  for(var i=0;i<playersNames.length;i++){
    players[i]=new Player(playersNames[i],'red');
    console.log(playersNames[i]+" added");
  }
}
init();

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
      //new Game
    e.itemIndex=3;
    newGame();
  } else if (e.itemIndex==1){
    var menuPlayers = new UI.Menu();
    for(var i=0;i<playersNames.length;i++){
      menuPlayers.item(0,i,
        {title:players[i].playerName, 
         subtitle:(players[i].active)?"Active":"Inactive"
        });
    }
    menuPlayers.show();
    menuPlayers.on('select',function(ev){
      players[ev.itemIndex].active=!(players[ev.itemIndex].active);
      menuPlayers.item(0,ev.itemIndex,
        {title:players[ev.itemIndex].playerName, 
         subtitle:(players[ev.itemIndex].active)?"Active":"Inactive"
        });
    });
    menuPlayers.on('longSelect', function(e) {
      console.log(e.itemIndex);
      for(var i=0;i<e.itemIndex;i++){
        var last=players.shift();
        players.push(last);
      }
      for(var j=0;j<playersNames.length;j++){
        menuPlayers.item(0,j,
          {title:players[j].playerName, 
           subtitle:(players[j].active)?"Active":"Inactive"
          });
      }
      menuPlayers.selection(0,0);
    });
  } else if (e.itemIndex==2){
    displayScores();
  } else if (e.itemIndex==3){
    if(currentPlayer==-1){
      nextPlayer();
    }else{
      players[currentPlayer].show();
    }
  }
});



        
menu.show();


function newGame(){
  for(var j=0;j<players.length;j++){
    players[j].score=0;
    players[j].roundScore=[];
    currentRound=0;
    currentPlayer=-1;
    nextPlayer();
  }
}

function nextPlayer(){
  var previousPlayer=currentPlayer;
  currentPlayer++;

  if(currentPlayer>=players.length){
    currentPlayer=0;
    currentRound++;
  }
  console.log("Player "+currentPlayer+" of "+ players.length);
  console.log(players[currentPlayer].playerName+" "+players[currentPlayer].active);
  if(players[currentPlayer].active){
    if(typeof players[currentPlayer].roundScore[currentRound]!== 'number'){
      players[currentPlayer].roundScore[currentRound]=0;
    }
    players[currentPlayer].displayScore();
    players[currentPlayer].show();
  } else {
    nextPlayer();
  }
  if(previousPlayer>-1){
      players[previousPlayer].hide();
  }
}
function previousPlayer(){
  var previousPlayer=currentPlayer;
  currentPlayer--;

  if(currentPlayer<0){
    currentPlayer=players.length-1;
    currentRound--;
  }
  if(currentRound>=0){
    if(players[currentPlayer].active){
      players[currentPlayer].show();
    } else {
      previousPlayer();
    }
  } else {
    currentRound=0;
    currentPlayer=-1;
  }
  players[previousPlayer].hide();  
}

function displayScores(){
  var scoreCard=new UI.Window({scrollable: true,backgroundColor: 'white'});
  for(var i=0;i<players.length;i++){
       scoreCard.add(new UI.Text({
          font: 'gothic-28-bold',
          position: new Vector2(0,i*30),
          size: new Vector2(72,30),
          text:players[i].playerName,
          textAlign:'left',
          color:'black',
          textOverflow:'fill',
          borderColor:'black'
        }));
    scoreCard.add(new UI.Text({
          font: 'gothic-28',
          position: new Vector2(72,i*30),
          size: new Vector2(72,30),
          text:players[i].score+" ",
          textAlign:'right',
          color:'black',
          textOverflow:'fill',
          borderColor:'black'
        }));
  }
  scoreCard.show();
  scoreCard.on('click', 'select',function(e){
    displayFullScores();
  });
}

function displayFullScores(){
  var bgColor=[['#FFAAAA','#AAFFFF'],['#FF5555','#55FFFF']];
  var fullScoreCard=new UI.Window({scrollable: true,backgroundColor: 'white'});
  //var scoreBody="";
  var l=144/(players.length);
  var h=18;
  for(var p=0;p<players.length;p++){
        var head=new UI.Text({
          font: 'gothic-14',
          position: new Vector2(l*p,0),
          size: new Vector2(l,h),
          text:players[p].playerName,
          textAlign:'center',
          color:'black',
          textOverflow:'fill',
          borderColor:'black'
        });
        fullScoreCard.add(head);
    }
  for(var round=0;round<=currentRound;round++){
    for(var i=0;i<players.length;i++){
        fullScoreCard.add(new UI.Text({
          font: 'gothic-14',
          position: new Vector2(l*i,h*(round+1)),
          size: new Vector2(l,h),
          text:players[i].roundScore[round]+" ",
          textAlign:'right',
          color:'black',
          textOverflow:'fill',
          borderColor:'black',
          backgroundColor: bgColor[i%2][round%2]
        }));
    }
  }
    for(var j=0;j<players.length;j++){
        fullScoreCard.add(new UI.Text({
          font: 'gothic-14',
          position: new Vector2(l*j,h*(currentRound+1)),
          size: new Vector2(l,h),
          text:players[j].score +" ",
          textAlign:'right',
          color:'white',
          textOverflow:'fill',
          borderColor:'white',
          backgroundColor: 'black'
        }));
    }  
  fullScoreCard.show();
  fullScoreCard.on('click', 'select',function(e){
    fullScoreCard.hide();
  });
}

function getTopPlayer(){
  var max=players[0].score;
  var playerId=0;
  for(var i=1;i<players.length;i++){
    if(players[i].score>max){
      playerId=i;
      max=players[i].score;
    }
  }
  topScore=max;
  topPlayer=playerId;
}