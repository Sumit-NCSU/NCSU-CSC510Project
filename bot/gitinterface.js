var request = require('request');

var urlRoot = "https://api.github.com";

/**
 * Method to return a list of pull requests for the specified repo.
 * @param {*} owner username of the repo owner.
 * @param {*} repo repo name.
 * @param {*} callback callback function.
 */
function getPullRequests(owner, repo, callback) {
	console.log('GitInterface: Get Pull Requests.');
	//check if the git token is set.
	if (!process.env.GITTOKEN) {
		console.log('GitInterface: Error: Specify Git token in environment variable: GITTOKEN');
		return callback(false);
	}
	// Set the options for the request.
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls",
		method: 'GET',
		headers: {
			"User-Agent": "CiBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
		}
	};
	var pullRequests = [];
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		if (obj != null) {
			console.log('GitInterface: Pull Requests found: ');
			for(var i = 0; i < obj.length; i++) {
				var title = obj[i].title;
				console.log("\tPull Request Name: " + title);
				pullRequests.push(obj[i]);
			}
			console.log('GitInterface: Sending back ' + pullRequests.length + ' pull requests');
			return callback(pullRequests);
		} else {
			console.log('GitInterface: No Pull requests found');
			return callback(false);
		}
	});
}

/**
 * Method to return a details of a specific pull request.
 * @param {*} owner username of the repo.
 * @param {*} repo name of the repo.
 * @param {*} number pull request number.
 * @param {*} callback callback function.
 */
function getPullRequest(owner, repo, number, callback) {
	console.log('GitInterface: Get Pull Request.');
	// Check if the Git token is set.
	if (!process.env.GITTOKEN) {
		console.log('GitInterface: Error: Specify Git token in environment variable: GITTOKEN');
		return callback(false);
	}
	// Set the options for the request.
	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/pulls/" + number,
		method: 'GET',
		headers: {
			"User-Agent": "CiBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN
		}
	};
	var pullRequest;
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		if (obj != null) {
			var title = obj.title;
			console.log('GitInterface: Pull Request Name: ' + title);
			return callback(obj);
		} else {
			console.log('GitInterface: No Pull request found');
			return callback(false);
		}
	});
}

/**
 * Method to get the repos of a user.
 * @param {*} owner the owner of the repos.
 * @param {*} callback callback function.
 */
function getRepos(owner, callback) {
	console.log('GitInterface: Get Repos.');
	// Check if the Git token is set.
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return callback(false);
	}
	// Set the options for the request.
	var options = {
		url: urlRoot + '/users/' + owner + "/repos",
		method: 'GET',
		headers: {
			"User-Agent": "CiBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
		}
	};
	var repos=[];
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		if (obj != null) {
			console.log('GitInterface: Repositories found.');
			for(var i = 0; i < obj.length; i++) {
				repos.push(obj[i]);
			}
		} else {
			console.log('GitInterface: No Repositories found.');
			return callback(false);
		}
	});
	return callback(repos);
}

/**
 * Method to merge a given pull request
 * @param {*} owner the owner of the repo.
 * @param {*} repo the name of the repo.
 * @param {*} number the pull request number.
 * @param {*} callback callback function.
 */
function mergePullRequest(owner, repo, number, callback) {
	console.log('GitIntergace: Merge Pull Request.');
	// Check if the Git token is set.
	if (!process.env.GITTOKEN) {
		console.log('GitIntergace: Merge Pull Request.: Error: Specify Git token in environment variable: GITTOKEN');
		return callback(false);
	}
	// Set the options for the request.
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls/" + number + "/merge",
		method: 'PUT',
		headers: {
			"User-Agent": "CiBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
			"commit_title": "Merged by CiBot",
			"commit_message": "Merged by CiBot"
		}
	};
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		if (obj != null) {
			console.log('GitIntergace: Message from Git: ' + JSON.stringify(obj.message))
			return callback(obj.message);
		} else {
			console.log('GitIntergace: Nothing returned from Git.')
			return callback(false);
		}
	});
}

/**
 * Method to check the Jenkins build status of a Pull Request.
 * @param {*} owner username of the repo.
 * @param {*} repo name of the repo.
 * @param {*} ref the HEAD ref of the Pull Request.
 * @param {*} callback callback function.
 */
function getStatus(owner, repo, ref, callback) {
	console.log('GitInterface: GetStatus.');
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/statuses/" + ref,
		method: 'GET',
		headers: {
			"User-Agent": "CiBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN
		}
	};
	var output = 0;
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		console.log('The latest jenkins status is:');
		console.log(obj[0].state);
		if (obj[0].state == 'success') {
			console.log("Success.")
			return callback(true);
		} else {
			console.log("Not Success.")
			return callback(false);
		}
	});
}

/**
 * Method to create a pull request.
 * @param {*} owner the owner of the repo.
 * @param {*} repo the name of the repo.
 * @param {*} head the head branch.
 * @param {*} base the base branch.
 * @param {*} callback callback function.
 */
function createPullRequest(owner, repo, head, base, callback) {
	console.log('GitIntergace: Create Pull Request.');
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls",
		method: 'POST',
		headers: {
			"User-Agent": "CiBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN
		},
		json: {
			"title": "Created by bot from slack",
			"body": "Please check commit history",
			"head": head,
			"base": base
		}

	};
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		console.log(body);
		if (body) {
			return callback(true);
		} else {
			return callback(false);
		}
	});
}

exports.getPullRequests = getPullRequests;
exports.getPullRequest = getPullRequest;
exports.getRepos = getRepos;
exports.mergePullRequest = mergePullRequest;
exports.getStatus = getStatus;
exports.createPullRequest = createPullRequest;