
// read/set environment vars
require("dotenv").config();

// load required node packages
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require("inquirer");

// load app keys
var keys = require('./keys');
var twitKeysList = keys.twitterKeys;
var spotKeysList = keys.spotifyKeys;

// on screen menu
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
	        getMediaDetails("song");
	        break;
	    case "Get movie details":
	        getMediaDetails("movie");
	        break;
	    case "Do something else":
	        getTextFromRandom();
	        break;
	    default:
	        console.log("I don't know what you want from me.");
	}
});

// ============================================================================
function getRecentTweets(){
	var client = new Twitter({
		consumer_key: twitKeysList.consumer_key,
		consumer_secret: twitKeysList.consumer_secret,
		access_token_key: twitKeysList.access_token_key,
		access_token_secret: twitKeysList.access_token_secret
	});

	var params = {screen_name: '@RealTimeTourist'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		console.log("//==================== Recent Tweets ====================//");
		if (!error) {
			if(tweets.length >= 20){
				tweets.length = 20;	// error check in case there are less than 20 tweets
			}

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
// ============================================================================

// ============================================================================
function getMediaDetails(mediaType){
	inquirer.prompt([
		{
			type: "input",
			message: "What is the " + mediaType + " name you are searching for?",
			name: "mediaName"
	    }
	])
	.then(function(inquirerResponse) {

		var strMedia = "";

		if(inquirerResponse.mediaName.length == 0 ){
			if(mediaType == "song"){
				inquirerResponse.mediaName = 'The Sign';
			} else{
				inquirerResponse.mediaName = 'Mr. Nobody';
			}
		}

		var arrMedia = inquirerResponse.mediaName.split(" ");
		var strMedia = arrMedia[0]; // start variable with the first word of the title

		for (var i = 1; i < arrMedia.length; i++) {
			strMedia = strMedia + "+" + arrMedia[i];
		}

		if(mediaType =="song"){
			var spotify = new Spotify({
				id: spotKeysList.id,
				secret: spotKeysList.secret
			});

			spotify.search({ type: 'track', query: strMedia }, function(error, response) {
				// if song found
				if (!error) {
					console.log("//=================== Song Details ======================//");
					console.log("Item found:\n");
					console.log("Artist(s): "    + response.tracks.items[0].artists[0].name);
					console.log("Song Name: "    + response.tracks.items[0].name);
					console.log("Preview Link: " + response.tracks.items[0].preview_url);
					console.log("Album: "        + response.tracks.items[0].album.name);
					console.log("//=======================================================//");
				// else song not found
				} else{
					console.log('Error occurred: ' + error);
				}
			});

		}else if(mediaType =="movie"){
			// Then run a request to the OMDB API with the movie specified
			var queryUrl = "http://www.omdbapi.com/?t=" + strMedia + "&y=&plot=short&apikey=40e9cece";

			request(queryUrl, function(error, response, body) {
				// If the request is successful
				if (!error && response.statusCode === 200) {
					console.log("//================== Movie Details ======================//");
					// Parse the body of the site and recover the details
					console.log("Item found:\n");
					console.log("Title: "                  + JSON.parse(body).Title);
			    	console.log("Release Year: "           + JSON.parse(body).Year);
			    	console.log("IMDB Rating: "            + JSON.parse(body).Ratings[0].Value);
			    	console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			    	console.log("Produced In: "            + JSON.parse(body).Country);
			    	console.log("Language: "               + JSON.parse(body).Language);
			    	console.log("Plot: "                   + JSON.parse(body).Plot);
			    	console.log("Starring: "               + JSON.parse(body).Actors);
			    	console.log("//=======================================================//");
			  	} else{
			  		console.log('Error occurred: ' + error);
			  	}
			});
		}
	});
}
// ============================================================================

// ============================================================================
function getTextFromRandom(){
	var fs = require("fs");
	var spotKeysList = keys.spotifyKeys;

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}

		// Break string down by comma separation and store the contents in output array
		var output = data.split(",");

		getMediaDetailsAlt(output[1]);
	});
}
// ============================================================================


// ============================================================================
function getMediaDetailsAlt(media){
	var arrMedia = media.split(" ");
	var strMedia = arrMedia[0]; // start variable with the first word of the title

	for (var i = 1; i < arrMedia.length; i++) {
		strMedia = strMedia + "+" + arrMedia[i];
	}
	
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify({
		id: spotKeysList.id,
		secret: spotKeysList.secret
	}); console.log("spotify.id: " + spotify.id);

	spotify.search({ type: 'track', query: strMedia }, function(error, response) {
		if (!error) {
			console.log("//=================== Song Details ======================//");
			console.log("Item found:\n");
			console.log("Artist(s): "    + response.tracks.items[0].artists[0].name);
			console.log("Song Name: "    + response.tracks.items[0].name);
			console.log("Preview Link: " + response.tracks.items[0].preview_url);
			console.log("Album: "        + response.tracks.items[0].album.name);
			console.log("//=======================================================//");
		// else song not found
		} else{
			console.log('Error occurred: ' + error);
		}
	});
}
// ============================================================================

