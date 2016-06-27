/* global module */
var Player=function(playerName, isActive){
  this.playerName=playerName;
  this.score=0;
  this.isActive=isActive;
  this.scoreTable=[];
};

module.exports.Player=Player;