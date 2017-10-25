var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');


////// FILL IN THE BLANKS

var token = "token " + "<<TOKEN GOES HERE>>";
var userId = "sponnam";
var repo = "ssrivas8/CSC510Project";

var urlRoot = "https://github.ncsu.edu/api/v3";

createWebHook(userId, repo);

function createWebHook(owner, repo)
{
	var options = {
        url: 'https://github.ncsu.edu/api/v3/repos/' + owner + "/" + repo + "/hooks",
        method: 'POST',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        },
		json: {
			"name": "web",
			"active": true,
			"events": [
				"push", 
				"pull_request"
			],
			"config": {
			"url": "http://example.com/webhook",
			"content_type": "json"
			}
		}
    };

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) 
	{
		// console.log(body);
		console.log(response.statusMessage);
	});
}

