var keys = require('./keys.js');
var keysList = keys.twitterKeys;

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require("inquirer");

//var arrTwitterKeys = [];

//for (var key in keysList) {
//	arrTwitterKeys.push(keysList[key]);
//}
//console.log("keysList: " + keysList.consumer_key);

// create on screen menu
inquirer.prompt([
	{
      type: "list",
      message: "What is your command, Master?",
      choices: ["List my Recent Tweets", "Spotify A Song", "Get movie details", "Do something else"],
      name: "commands"
    }
])
.then(function(inquirerResponse) {
	switch(inquirerResponse.commands) {
    case "List my Recent Tweets":
        getRecentTweets();
        break;
    case "Spotify A Song":
        getSpotifySong();
        break;
    case "Get movie details":
        getMovieDetails();
        break;
    case "Do something else":
        getSpotifySong();
        break;
    default:
        console.log("I don't know what you want from me.");
}
});

function getRecentTweets(){
	var client = new Twitter({
		consumer_key: keysList.consumer_key,
		consumer_secret: keysList.consumer_secret,
		access_token_key: keysList.access_token_key,
		access_token_secret: keysList.access_token_secret
	});

	var params = {screen_name: '@RealTimeTourist'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		console.log("//==================== Recent Tweets ====================//");
		if (!error) {
			//console.log(tweets); <-- the whole thing
			for(var i = 0; i < tweets.length; i++){
				console.log("created: " + tweets[i].created_at);
				console.log("\n" + tweets[i].text);
				console.log("---------------------------------------------");
			}
		} else{
			console.log(error);
		}
		console.log("//=======================================================//");
	});
}

function getSpotifySong(){
	console.log("//=================== Spotify a Song ====================//");
	console.log("//=======================================================//");
}

function getMovieDetails(){
	console.log("//================== Get Movie Details ==================//");
	console.log("//=======================================================//");
}