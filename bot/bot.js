var Botkit = require('botkit')
var Table = require('easy-table')
var github = require("./gitinterface.js");
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var clientId = process.env.CIBOTCID;
var clientSecret = process.env.CIBOTCSEC;
var adminlist = ["U6WCFDZL3", "U6WGAURSQ","U6VUKPYCR","U7USQD4SY","U7C5SDE5Q"];
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const PORT=4390;

app.listen(PORT, function () {
    //Callback triggered when server is successfully listening.
    console.log("CiBot app listening on port " + PORT);
});

if (!process.env.SLACKTOKEN) {
	console.log('Error: Specify the Slack bot token in environment variable: SLACKTOKEN');
	process.exit(1);
}

var controller = Botkit.slackbot({
	debug : false
});

controller.configureSlackApp({
  clientId: clientId,//clientid
  clientSecret: clientSecret,//clientsecret
  scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

// connect the bot to a stream of messages
var bot = controller.spawn({
	token : process.env.SLACKTOKEN
}).startRTM();

app.get('/', function(req, res) {
    res.send('Ci Bot Service is running');
});

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "The oauth access code is not set properly."});
        console.log("Error: configure the oauth access code properly and retry.");
    } else {
        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);
            }
        })
    }
});

// This method is used to create the dynamic options to load in the list PR request.
app.post('/proptions', function(req, res) {
	console.log('Bot: Loading options for the dynamic menu');
	var repo = "SampleRepo";
	var owner = "botcicd";
	github.getPullRequests(owner, repo, (value) => {
		console.log('Bot: Received ' + value.length + ' Pull requests');
		var options = {};
		var key = 'options';
		options[key] = [];
		var details;
		details= owner;
		details=details+" "+repo;
		for(i=0;i<value.length;i++){
			var data = {
				text: '#' + value[i].number + ': ' + value[i].title,
				value: details + " " + value[i].number
			};
			options[key].push(data);
		}
		console.log('Bot: Pull Requests options are: ' + JSON.stringify(options));
		res.type('json');
		res.send(options);
	});	
});

// This method is used to respond to the actions whenever a user selects any option from a menu or clicks on a button.
// The callback contains the action Name which can be used to determine which action was performed.
app.post('/actions', function(req, res) {
	console.log('Bot: Inside action response.');
	var reqPayload = req.body.payload;
	console.log(reqPayload);
	//parse the name of the action
	var userName = JSON.parse(reqPayload).user.id;
	var actionName = JSON.parse(reqPayload).actions[0].name;
	var actionValue = JSON.parse(reqPayload).actions[0].value;
	console.log('actionName:' + actionName);
	console.log('actionValue:' + actionValue);
	if (actionName == 'merge') {
		// The merge button is clicked.
		console.log('Bot: The Merge button was clicked');
		var values = actionValue.split("$#");//<repo>$#<owner>$#<number>$#<headbranch>
		var repo = values[0];
		var owner = values[1];
		var prnumber = values[2];
		var branch = values[3];
		var user = userName;
		doMergeAction(repo, owner, prnumber, branch, user, function(response){
			res.send(response);	
		});
	} else if (actionName == 'nomerge') {
		// The Dont't merge button is clicked
		console.log('The Don\'t Merge button was clicked');		
		res.send("Thanks for reducing my work. Appreciate it!");
	} else if (actionName == 'prnames') {
		// an option is selected from the dynamic dropdown list.
		console.log('An option was selected fromt the Dynamic drop down list of List pull requests.');
		console.log('The request Payload is: ' + reqPayload);
		var selectedOptionValue = JSON.parse(reqPayload).actions[0].selected_options[0].value;
		console.log(selectedOptionValue); // This is the PR number
		//extract things from selectedOptionValue
		var arr = selectedOptionValue.split(" ")
		console.log('Got this: ' +arr);//<owner> <repo> <number>
		github.getPullRequest(arr[0], arr[1], arr[2], (value) => {
			console.log('Bot: Value for Pull Request seleted action: ' + value);
			var headBranch = value.head.label.split(":")[1];
			var baseBranch = value.base.label.split(":")[1];
			var val = value.head.repo.name + "$#" + value.user.login + "$#" + value.number + "$#" + headBranch + "$#" + baseBranch;
			var msg = "Pull Request Details: \nId: " + value.id + "\nTitle: " +value.title + "\nDescription: " + value.body;
			var reply_with_attachments = {
				"text": msg,
				"attachments": [{
					"text": "Would you like to merge this PR",
					"fallback": "You are unable to choose an option",
					"callback_id": "merge_action",
					"color": "#09aa08",
					"attachment_type": "default",
					"actions": [{
						"name": "merge",
						"text": "Merge",
						"style":"primary",
						"type": "button",
						"value": val
					},
					{
						"name": "nomerge",
						"text": "Don't Merge",
						"style":"danger",
						"type": "button",
						"value": "nomerge"
					}]
				}]
			}
			res.type('json');
			res.send(reply_with_attachments);
		});
	} else {
		res.send("New uknown action received: " + actionName);
	}
});

// Greetings to the user
controller.hears(['hi', 'hello', 'greetings'], [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	controller.storage.users.get(message.user, function(err, user) {
		console.log('Bot: Inside hi');	
		bot.reply(message, 'Hello, this: ' + message.user + ' ,will be your unique ID for this App. Please store it somewhere! ');
	});
});

controller.hears(/\bissue.*request.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	// user says: issue pull request on botcicd/SampleRepo new-feature
	var text_message = message.text;
	var responseMsg = "successfully issued " + text_message.toString().split("issue").pop();
	var repo = "SampleRepo";
	var owner = "botcicd";
	var branchName = "new-feature";
	var base = "master";
	github.createPullRequest(owner, repo, branchName, base, (value) => {
		if (value) {
			console.log("Pull Request created")
			bot.reply(message, responseMsg);
		} else {
			console.log("unable to create pull request.")
			bot.reply(message, "Unable to create pull request.");
		}
	});
});

// Get the list of pull requests for a given repository. Alternately the slash command /listprs can also be used.
controller.hears(/\bget.*requests.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	// user says: Get pull requests for octocat for repo Hello-World
	var repo = "SampleRepo"
	var owner = "botcicd"
	console.log('Bot: Generating dynamic pull request list');
	var reply_with_attachments = {
		"text": "Select a Pull Request from the List:",
		"attachments": [{
			"text": "Pull Requests of repository: " + repo,
			"fallback": "Upgrade your Slack client to use message menus.",
			"color": "#3AA3E3",
			"attachment_type": "default",
			"callback_id":"pr_selection",
			"actions": [{
			  "name": "prnames",
			  "text": "Select a pull request",
			  "type": "select",
			  "data_source": "external",
			}]
		}]
	};
	bot.reply(message, reply_with_attachments);
});

// Get the details of a given pull request.
controller.hears(/\bget.*request.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	console.log('Bot: Inside Get request details for a specific request.');
	// let the bot say: Get pull request 1 for octat for repo Hello-World
	var repo = "SampleRepo" // extract this from user message/intent/context?
	var owner = "botcicd" // extract this from user message/intent/context?
	var number = 8 // extract this from user message/intent/context?
	github.getPullRequest(owner, repo, number, (value) => {
		console.log(value);
		var headBranch = value.head.label.split(":")[1];
		var baseBranch = value.base.label.split(":")[1];
		console.log('HEAD: ' + headBranch + ', BASE: ' + baseBranch);
		var t ="Id: " + value.number + "\nTitle: " + value.title + "\nDescription: " + value.body + "\nHEAD Branch: " + headBranch;
    	bot.reply(message, t.toString());
	});
});

// merge a given pull request. Alternately the slash command /mergepr can also be used.
controller.hears(/\bmerge.*\b/, [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	console.log('Bot: Inside merge pull request method.');
	var repo = "SampleRepo"; // extract this from user message/intent/context?
	var owner = "botcicd" // extract this from user message/intent/context?
	var number = 15; // extract this from user message/intent/context?
	github.getPullRequest(owner, repo, number, (value) => {
		console.log(value);
		var headBranch = value.head.label.split(":")[1];
		var baseBranch = value.base.label.split(":")[1];
		var val = value.head.repo.name + "$#" + value.user.login + "$#" + value.number + "$#" + headBranch + "$#" + baseBranch;
		var reply_with_attachments = {
			"text": "Would you like to merge this PR?",
			"attachments": [{
				"text": "Choose an option",
				"fallback": "You are unable to choose an option",
				"callback_id": "merge_action",
				"color": "#09aa08",
				"attachment_type": "default",
				"actions": [{
					"name": "merge",
					"text": "Merge",
					"style":"primary",
					"type": "button",
					"value": val
				},
				{
					"name": "nomerge",
					"text": "Don't Merge",
					"style":"danger",
					"type": "button",
					"value": "nomerge"
				}]
			}]
		}
		bot.reply(message, reply_with_attachments);    	
	});
});

function doMergeAction(repo, owner, prnumber, branch, user, callback) {
	console.log('Bot: Inside the do merge action');
	var reply = '';
	//check admin list before actually merging
	if(adminlist.indexOf(user) > -1) {
		github.getStatus(owner, repo, branch, (out) => {
			if(out)	{
				github.mergePullRequest(owner, repo, prnumber, (msg) => {
					if (msg) {
						console.log('Bot: Message received from Git: ' + msg);
						reply = msg;
						return callback(reply);
					}
				});
			} else {
				console.log('Bot: Jenkins build is not succesful yet!');
				reply = "Jenkins Build is not succesful yet! Pull request can be merged once the Jenkins build is successful.";
				return callback(reply);
			}
		});
	} else {
		reply = "You don't have permission to merge via the bot interface!";
		console.log(reply);
		return callback(reply);
	}
}
