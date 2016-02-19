var ScoreCard = require('scoreCard');
var app = require('app');

var Player=function(playerName,color){
  this.playerName=playerName;
  this.score=0;
  this.roundScore=[];
  this.active=true;
  this.card=new ScoreCard.SCard({
//  action: {
//    up: 'images/action_icon_plus.png',
//    down: 'images/action_icon_minus.png'
//  }
  });
  this.card.title(this.playerName);
  this.card.titleColor=color;
  this.card.subtitle("0");
  this.card.backgroundColor=color;
  this.card.player=this;
  this.card.on('click', 'select', function(e) {
    app.nextPlayer();
  });
  this.card.on('longClick', 'select', function(e) {
    app.previousPlayer();
  });  
  this.card.on('click', 'up', function(e) {
    this.player.addScore();
  });
  this.card.on('click', 'down', function(e) {
    this.player.minusScore();
  });
  this.card.on('longClick', 'up', function(e) {
    this.player.add5Score();
  });
  this.card.on('longClick', 'down', function(e) {
    this.player.minus5Score();
  });  
};

Player.prototype.addScore=function(){
  this.score++;
  this.roundScore[app.currentRound]++;
  this.displayScore();
};
Player.prototype.add5Score=function(){
  this.score+=5;
  this.roundScore[app.currentRound]+=5;
  this.displayScore();
};
Player.prototype.minusScore=function(){
  this.score--;
  this.roundScore[app.currentRound]--;
  this.displayScore();
};
Player.prototype.minus5Score=function(){
  this.score-=5;
  this.roundScore[app.currentRound]-=5;
  this.displayScore();
};
Player.prototype.displayScore=function(){
    this.card.subtitle(this.score+" ");
    var scores="";
    if(this.roundScore[app.currentRound]>=0){
      scores+="+";
    }
    scores+=this.roundScore[app.currentRound]+"\n";
  this.card.body(scores);
};
Player.prototype.show=function(){
  this.card.show();
};
Player.prototype.hide=function(){
  this.card.hide();
};
module.exports = Player;
