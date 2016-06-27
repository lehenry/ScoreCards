/* global module */
var UI = require('ui');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var res = Feature.resolution();

var App = require('./app.js');
//table colors for full scores
var bgColor=Feature.color([['#FFAAAA','#AAFFFF'],['#FF5555','#55FFFF']],[['white','white'],['white','white']]);
var _card;
var _currentRound;

var PlayerCard=function(player){
  this.player=player;
  this.wind = new UI.Window({
    //fullscreen: true,
  });
  this.title = new UI.Text({
    position: new Vector2(0, 14),
    size: new Vector2(res.x, 55),
    font: 'gothic-28-bold',
    text: player.playerName,
    textAlign: 'center'
  });
  this.wind.add(this.title);
  this.scoreBox = new UI.Text({
    position: new Vector2(0, 55),
    size: new Vector2(res.x, 35),
    font: 'bitham-30-black',
    text: "0",
    backgroundColor: "white",
    color: "black",
    textAlign: 'center'
  });
  this.wind.add(this.scoreBox);
  
  this.roundScoreBox = new UI.Text({
    position: new Vector2(0, 90),
    size: new Vector2(res.x, 30),
    text: "",
    textAlign: 'center'
  });
  this.wind.add(this.roundScoreBox);
  
  this.topScore = new UI.Text({
    position: new Vector2(0, 130),
    size: new Vector2(res.x, 40),
    text: "",
    font: 'gothic_14',
    textAlign: 'center',
    color: Feature.color('blue','white'),
    backgroundColor: bgColor[0][1]
  });
  this.wind.add(this.topScore);
  
  this.wind.on('click', 'select', function(e) {
    //select button goes to next player
    App.game.nextPlayer();
  });
  this.wind.on('longClick', 'select', function(e) {
    //long click on select goes back to previous player
    App.game.previousPlayer();
  });  
  this.wind.on('click', 'up', function(e) {
    scoreIncrement();
  });
  this.wind.on('click', 'down', function(e) {
    //decrement
    scoreDecrement();
  });
  this.wind.on('longClick', 'up', function(e) {
    //large increment
    largeScoreIncrement();
  });
  this.wind.on('longClick', 'down', function(e) {
    //large decrement
    largeScoreDecrement();
  });
};

function scoreIncrement(){
  _card.player.scoreTable[_currentRound]++;
  _card.player.score++;
  _card.displayScore();
}

function largeScoreIncrement(){
  _card.player.scoreTable[_currentRound]+=5;
  _card.player.score+=5;
  _card.displayScore();
}
function scoreDecrement(){
  _card.player.scoreTable[_currentRound]--;
  _card.player.score--;
  _card.displayScore();
}
function largeScoreDecrement(){
  _card.player.scoreTable[_currentRound]-=5;
  _card.player.score-=5;
  _card.displayScore();
}

//update the score and top score
PlayerCard.prototype.displayScore=function(){
  this.scoreBox.text(this.player.score + "");
  //init score if it's the first time at this position
  if(typeof this.player.scoreTable[_currentRound]!== 'number'){
      this.player.scoreTable[_currentRound]=0;
  }    
  this.roundScoreBox.text("Round #"+(_currentRound+1)+": "+this.player.scoreTable[_currentRound]+"");  
  App.game.getTopPlayer();
  this.topScore.text("1st: ["+ App.game.topPlayer.playerName.substring(0,16)+": "+App.game.topScore+"]");
};

PlayerCard.prototype.show=function(currentRound){
  _currentRound=currentRound;
  _card=this;
  this.displayScore();
  this.wind.show();
};

PlayerCard.prototype.hide=function(){
  this.wind.hide();
};
module.exports.PlayerCard=PlayerCard;
