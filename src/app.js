/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var currentPlayer=-1;
var currentRound=0;
var players=[];

var UI = require('ui');
var Vector2 = require('vector2');
//var Settings = require('settings');
var playersNames = ['Loic','Greg','Celine','PL'];
var playersColors = ['red','green','pink','blue'];

var Player=function(playerName,color){
  this.playerName=playerName;
  this.score=0;
  this.roundScore=[];
  this.active=true;
  this.card=new UI.Card({
//  action: {
//    up: 'images/action_icon_plus.png',
//    down: 'images/action_icon_minus.png'
//  }
  });
  this.card.title(this.playerName);
  this.card.titleColor=color;
  this.card.subtitle("0");
  this.card.subtitleColor=color;
  this.card.player=this;
  this.card.on('click', 'select', function(e) {
    nextPlayer();
  });
  this.card.on('longClick', 'select', function(e) {
    previousPlayer();
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
    this.card.subtitle(this.score+" ");
    var scores="";
    if(this.roundScore[currentRound]>=0){
      scores+="+";
    }
    scores+=this.roundScore[currentRound]+"\n";
  this.card.body(scores);
};
//init players
function init(){
  players=[];
  currentPlayer=-1;
  currentRound=0;
  console.log("Init Players");
  for(var i=0;i<playersNames.length;i++){
    players.push(new Player(playersNames[i],playersColors[i]));
    console.log(playersNames[i]+" added");
  }
}
init();

var main = new UI.Card({
  title: 'ScoreCards',
  body: 'Start new game...'
});

//main.show();



var menu = new UI.Menu({
  sections: [{
    title: "ScoreCards",
    items: [{
        title: 'New Game',
        icon: 'IMAGES_SCORECARD_PNG'
    }, {
        title: 'Scores'
    },{
        title: 'Set Players'
    },{
        title: 'Resume'
    }]
  }]
});
  
menu.on('select', function(e) {
  if(e.itemIndex===0){
      //new Game
    newGame();
  } else if (e.itemIndex==1){
    displayScores();
  } else if (e.itemIndex==2){
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
  } else if (e.itemIndex==3){
    if(currentPlayer==-1){
      nextPlayer();
    }else{
      players[currentPlayer].card.show();
    }
  }
});

menu.show();

main.on('click', 'up', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Nothing Here!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'select', function(e) {
  menu.show();
});
main.on('click', 'down', function(e) {
  nextPlayer();
});

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
    players[currentPlayer].card.show();
  } else {
    nextPlayer();
  }
  if(previousPlayer>-1){
      players[previousPlayer].card.hide();
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
      players[currentPlayer].card.show();
    } else {
      previousPlayer();
    }
  } else {
    currentRound=0;
    currentPlayer=-1;
  }
  players[previousPlayer].card.hide();  
}

function displayScores(){
  var scoreCard=new UI.Card();
  scoreCard.title("Round "+currentRound);
  var scoreBody="";
  for(var i=0;i<players.length;i++){
    if(players[i].active){
      scoreBody+=players[i].playerName;
      scoreBody+="... ";
      scoreBody+=players[i].score;
      scoreBody+="\r\n";
    }
  }
  scoreCard.body(scoreBody);
  scoreCard.show();
}