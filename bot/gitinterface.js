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
function getPullRequests(owner, repo, callback) {
	// Set the options for the request.
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls",
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
		}
	};
	var pullRequests=[];
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

function getPullRequest(owner, repo, number,callback) {
	// Check if the Git token is set.
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/pulls/"+number,
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN
		}
	};

	var pullRequest;
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		//console.log(obj);

		if (obj != null) {
				var arr2 = [];
				arr2.push(obj.body);
				arr2.push(obj.state)
				arr2.push(obj.title);
				arr2.push(obj.id);
				var title = obj.title;
				console.log("Pull Request Name: " + title);
				return callback(obj)

		} else {
			console.log('No Pull request found');
			return false;
		}
	});
}

function getPullRequestFiles(owner, repo, number, branchName) {
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/pulls/"+number+"/files",
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
			"base": branchName
		}
	};

	var pullRequestFiles=[];
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);

		if (obj != null) {
			for(var i = 0; i < obj.length; i++) {
				var title = obj[i].title;
				console.log("Pull Request File Name: " + title);
				pullRequestFiles.push(obj[i]);
			}
		} else {
			console.log('No Pull request Files found');
			return false;
		}
	});
	return pullRequestFiles;

}

function getRepos(owner) {
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	var options = {
		url: urlRoot + '/users/' + owner + "/repos",
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
		}
	};

	var repos=[];
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);

		if (obj != null) {
			for(var i = 0; i < obj.length; i++) {
				repos.push(obj[i]);
			}
		} else {
			console.log('No Repositories found');
			return false;
		}
	});
	return repos;

}

function mergePullRequest(owner, repo, number, callback) {
	console.log('im in gitintergace');
	// Check if the Git token is set.
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	// Set the options for the request.
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls/" + number + "/merge",
		method: 'PUT',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
			"commit_title": "Merged by CiCdBot",
			"commit_message": "Merged by CiCdBot"
		}
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);

		if (obj != null) {
			console.log('msg sent by git: '+JSON.stringify(obj.message))
			return callback(obj.message);
		} else {
			return callback(null);
		}
	});
}

function getContributors(owner, repo)
{
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/contributors",
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
		}
	};

	var contributors=[];
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);

		if (obj != null) {
			for(var i = 0; i < obj.length; i++) {
				console.log(obj[i].login);
				contributors.push(obj[i]);
			}
		} else {
			console.log('No Contributors found');
			return false;
		}
	});
	return contributors;
}

function getBranches(owner, repo)
{
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/branches",
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
		}
	};

	var branches=[];
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		if (obj != null) {
			for(var i = 0; i < obj.length; i++) {
				console.log(obj[i].name);
				branches.push(obj[i]);
			}
		} else {
			console.log('No branches found');
			return false;
		}
	});
	return branches;
}

function getPermission(owner, repo, username)
{
	if (!process.env.GITTOKEN) {
		console.log('Error: Specify Git token in environment variable: GITTOKEN');
		return false;
	}

	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/collaborators/" + username,
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
		}
	};

	var permission;
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		var obj = JSON.parse(body);
		if (obj != null) {
				console.log(obj.user.login);
				permission = obj.permission;
		} else {
			console.log('No username found');
			return false;
		}
	});
	return permission;
}

function createPullRequest(owner,repo,head,base)
{
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/pulls",
		method: 'POST',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN
		},
		json:
		{
			"title": "Created by bot from slack",
			"body": "Please check commit history",
			"head": head,
			"base": base
		}

	};
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
		console.log( body );

	});
	return 1
}

function getStatus(owner,repo,ref,callback)
{
	var options = {
		url: urlRoot + '/repos/' + owner + "/" + repo + "/statuses/" + ref,
		method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN
		}
	};
	var output = 0
	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
		var obj = JSON.parse(body);

		//console.log( obj );
		console.log("The latest jenkins status is	")
		/*
		for( var i = 0; i < obj.length; i++ )
		{
			var name = obj[i].name;
			console.log( name );
		}
		*/
		console.log(obj[0].state)
		if (obj[0].state == 'success'){
			console.log("successfully")
			return callback(true)
			output = 1
		}
		else{
			return false
		}
	});
	if(output==1){
		console.log("returning true")
		return true
	}

}

//getPullRequests(user,repoName);

//mergePullRequest(user,repoName,3);

//getBranches(user, repoName);

//getContributors(user, repoName);
exports.getStatus = getStatus;
exports.createPullRequest = createPullRequest;
exports.getPullRequests = getPullRequests;
exports.mergePullRequest = mergePullRequest;
exports.getRepos = getRepos;
exports.getPullRequest = getPullRequest;
exports.getPullRequestFiles = getPullRequestFiles;
exports.getBranches = getBranches;
exports.getContributors = getContributors;
