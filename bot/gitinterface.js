var request = require('request');

var urlRoot = "https://api.github.com";

var token = "token " + "18550fc0536fba882309f170d537b48c116f03a6";
var user = "srivassumit";
var repoName = "SEGitAPI";


function getPullRequests(owner, repo) {
	// Check if the Git token is set.
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}
	
	// Set the options for the request.
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls",
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": process.env.GITTOKEN
		}
	};
	
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		console.log( obj );
		for( var i = 0; i < obj.length; i++ )
		{
			var title = obj[i].title;
			console.log( title );
		}
	}
}


