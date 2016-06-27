/* global module */

var PlayerCard = require('./playerCard.js');


var Game=function(players, isBestMax, initialScore){
  this.players=players;
  this.playersNumber=players.length;
  this.isBestMax=isBestMax;
  this.playerCards = [];
  this.currentRound=0;
  this.currentPlayer=-1;
  this.topScore=initialScore;
  this.topPlayer=players[0];
  for(var i=0;i<this.playersNumber;i++){
    players[i].score=initialScore;
    players[i].scoreTable=[initialScore];
    this.playerCards.push(new PlayerCard.PlayerCard(players[i]));
  }
};

/**
  *  Go to next player, or if last player, go to first player, next round
  */
Game.prototype.nextPlayer=function(){
  var previousPlayer=this.currentPlayer;
  this.getTopPlayer();
  this.currentPlayer++;
  if(this.currentPlayer>=this.playersNumber){
    console.log('Back to first');
    this.currentPlayer=0;
    this.currentRound++;    
  }
  this.playerCards[this.currentPlayer].show(this.currentRound);
  if(previousPlayer>-1 && this.playersNumber>1){
    this.playerCards[previousPlayer].hide();
  }  
};

/**
  *  Get back to previous player
  */
Game.prototype.previousPlayer=function(){
  var previousPlayer=this.currentPlayer;
  this.getTopPlayer();
  this.currentPlayer--;
  // current player was first player, go back to last player, previous round
  if(this.currentPlayer<0){
    this.currentPlayer=this.playersNumber-1;
    this.currentRound--;
  }
  //show player if active
  if(this.currentRound<0){
    //current player was first, on first round, will go back to menu
    this.currentRound=0;
    this.currentPlayer=-1;
  }else{
      this.playerCards[this.currentPlayer].show(this.currentRound);
  }
  this.playerCards[previousPlayer].hide();
};

/**
  * Show current player card
  */
Game.prototype.resume=function(){
  if(this.currentPlayer<0){
    this.currentPlayer=0;
  }
  this.playerCards[this.currentPlayer].show(this.currentRound);
};

// get the current high score
Game.prototype.getTopPlayer=function(){
  var best=this.players[0].score;
  var playerId=0;
  if(this.isBestMax){
    for(var i=1;i<this.playersNumber;i++){
      if(this.players[i].score>best){
        playerId=i;
        best=this.players[i].score;
      }
    }
  }else{
    for(var j=1;j<this.playersNumber;j++){
      if(this.players[j].score<best){
        playerId=j;
        best=this.players[j].score;
      }
    }    
  }
  this.topScore=best;
  this.topPlayer=this.players[playerId];
};

module.exports.Game=Game;
