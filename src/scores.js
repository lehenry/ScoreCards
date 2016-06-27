/* global module */

var UI = require('ui');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var res = Feature.resolution();
var Scores=module.exports;
var App = require('./app.js');
//table colors for full scores
var bgColor=Feature.color([['#FFAAAA','#AAFFFF'],['#FF5555','#55FFFF']],[['white','white'],['white','white']]);

//display scores
Scores.displayScores=function(){
  var scoreCard=new UI.Window({scrollable: true,backgroundColor: 'white'});
  //for each player, display its score
  var j=0;
  for(var i=0;i<App.game.playersNumber;i++){
    j++;
      //player name
      scoreCard.add(new UI.Text({
          font: 'gothic-24-bold',
          position: new Vector2(0,j*30),
          size: new Vector2(res.x/2,30),
          text:App.game.players[i].playerName,
          textAlign:'left',
          color:'black',
          textOverflow:'fill',
          borderColor:'black',
      }));
      //player score
      scoreCard.add(new UI.Text({
            font: 'gothic-28',
            position: new Vector2(res.x/2,i*30),
            size: new Vector2(res.x/2,30),
            text:App.game.players[j].score+" ",
            textAlign:'right',
            color:'black',
            textOverflow:'fill',
            borderColor:'black'
      }));
    }
  scoreCard.show();
  //on select, switch to full scores
  scoreCard.on('click', 'select',function(e){
    App.game.displayFullScores();
  });
};


Scores.displayScoresRound=function(){
  var scoreCard=new UI.Window({scrollable: true, backgroundColor: 'white'});
  //for each player, display its score
  //for scrolling purpose
  var j=1;
  for(var i=0;i<App.game.players.length;i++){
    //player name
    scoreCard.add(new UI.Text({
      font: 'gothic-24-bold',
      position: new Vector2(20,j*30),
      size: new Vector2(70,30),
      text:App.game.players[i].playerName,
      textAlign:'left',
      color:'black',
      textOverflow:'fill',
      borderColor:'black',
    }));
    //player score
    scoreCard.add(new UI.Text({
      font: 'gothic-28',
      position: new Vector2(90,j*30),
      size: new Vector2(70,30),
      text:App.game.players[i].score+" ",
      textAlign:'right',
      color:'black',
      textOverflow:'fill',
      borderColor:'black'
    }));
    j++;
  }
    //for scrolling purpose
  scoreCard.add(new UI.Rect({
    position:scoreCard.size(),
    size: scoreCard.size()
  }));
  scoreCard.show();
  //on select, switch to full scores
  scoreCard.on('click', 'select',function(e){
    Scores.displayFullScores();
  });
};

// display full scores (per round)
Scores.displayFullScores=function(){
  var fullScoreCard=new UI.Window({scrollable: true, backgroundColor: 'white'});
  //column length is window length divided by the number of active players
  var l=res.x/(App.game.playersNumber);
  var h=18;
  var maxLines=res.y/h;
  var maxRound=App.game.players[0].scoreTable.length;  
  
  var offset=Math.max((maxLines-maxRound-2)/2,0);
  
  // header, players names
  var k=0;
  for(var p=0;p<App.game.players.length;p++){
    var head=new UI.Text({
      font: 'gothic-14',
      position: new Vector2(l*k,offset*h),
      size: new Vector2(l,h),
      text:App.game.players[p].playerName,
      textAlign:'center',
      color:'black',
      textOverflow:'fill',
      borderColor:'black'
    });
    fullScoreCard.add(head);
    k++;
  }
  //for each round, players' round score
  
  for(var round=0;round<maxRound;round++){
    k=0;
    for(var i=0;i<App.game.players.length;i++){
      fullScoreCard.add(new UI.Text({
        font: 'gothic-14',
        position: new Vector2(l*k,h*(round+offset+1)),
        size: new Vector2(l,h),
        text:App.game.players[i].scoreTable[round]+" ",
        textAlign:'right',
        color:'black',
        textOverflow:'fill',
        borderColor:'black',
        //color table rows
        backgroundColor: bgColor[i%2][round%2]
      }));
      k++;
    }
  }
  
  //score results
  k=0;
  for(var j=0;j<App.game.players.length;j++){
    fullScoreCard.add(new UI.Text({
      font: 'gothic-14',
      position: new Vector2(l*k,h*(maxRound+offset+1)),
      size: new Vector2(l,h),
      text:App.game.players[j].score +" ",
      textAlign:'right',
      color:'white',
      textOverflow:'fill',
      borderColor:'white',
      backgroundColor: 'black'
    }));
    k++;
  }

  //for scrolling purpose
  fullScoreCard.add(new UI.Rect({
    position:fullScoreCard.size(),
    size: fullScoreCard.size()
  }));
  
  fullScoreCard.show();
  //on click, back to simple scores
  fullScoreCard.on('click', 'select',function(e){
    fullScoreCard.hide();
  });
};

