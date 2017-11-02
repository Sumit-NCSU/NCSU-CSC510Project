var Promise = require("bluebird");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');

var token = "token " + "YOUR TOKEN";
var urlRoot = "https://api.github.com";

function getRepos(userName)
{
	var options = {
		url: urlRoot + '/users/' + userName + "/repos",
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};

	return new Promise(function (resolve, reject) 
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body) 
		{
			var repos = JSON.parse(body);
			resolve(repos);
		});
	});
}

function listPullRequests(owner, repo )
{
	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/pulls",
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};

	return new Promise(function (resolve, reject) 
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body) 
		{
			var obj = JSON.parse(body);
			resolve(obj);
		});
	});
}

function getPullRequest(owner, repo, number )
{
	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/pulls/"+number,
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};

	return new Promise(function (resolve, reject) 
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body) 
		{
			var obj = JSON.parse(body);
			resolve(obj);
		});
	});
}

function getPullRequestFiles(owner, repo, number )
{
	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/pulls/"+number+"/files",
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};

	return new Promise(function (resolve, reject) 
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body) 
		{
			var obj = JSON.parse(body);
			resolve(obj);
		});
	});
}

exports.getRepos = getRepos;
exports.getPullRequest = getPullRequest;
exports.listPullRequests = listPullRequests;