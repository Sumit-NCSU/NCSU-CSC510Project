var request = require('request');

var urlRoot = "https://api.github.com";

var user = "srivassumit";
var repoName = "SEGitAPI";

/**
 * Method to return a list of pull requests for the specified repo.
 * @param {*} owner required username of the repo owner
 * @param {*} repo required repo name
 * @param {*} isOpen [optional] defaults to true
 * @param {*} branchName [optional] defaults to master
 */
function getPullRequests(owner, repo, isOpen, branchName) {
	// Default values for optional variables
	isOpen = (typeof isOpen !== 'undefined') ?  isOpen : true;
	branchName = (typeof branchName !== 'undefined') ?  branchName : 'master';

	// Check if the Git token is set.
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	var state;
	if (isOpen) {
		state='open';
	} else {
		state='closed';
	}
	
	// Set the options for the request.
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls",
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
			"state": state,
			"base": branchName
		}
	};
	var pullRequests=[];
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		//console.log(obj);
		
		if (obj != null) {
			for( var i = 0; i < obj.length; i++ ) {
				var title = obj[i].title;
				console.log( title );
				pullRequests.push(obj[i]);
			}
		} else {
			console.log('No open Pull requests found');
			return false;
		}
	});
	return pullRequests;
}


getPullRequests(user,repoName);
