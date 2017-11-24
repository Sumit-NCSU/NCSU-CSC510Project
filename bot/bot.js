var Botkit = require('botkit')
var Table = require('easy-table')
var github = require("./gitinterface.js");
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var clientId = '251283423607.276615584448';
var clientSecret = '5d6923fd3e3939a67f833f266f6217ed';

// Instantiates Express and assigns our app variable to it
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Again, we define a port we want to listen to
const PORT=4390;

app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});

app.get('/', function(req, res) {
    res.send('Service is working! Path: ' + req.url);
});

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

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

// app.post('/mergepr', function(req, res) {
// 	console.log('Inside merge pr command: ');	
// 	console.log(req.body.command);
// 	res.type('json');
// 	var myjson = "{'text': 'Would you like to merge this PR?',	'content-type': 'application/json',	'attachments': [{'text': 'Choose an option',				'fallback': 'You are unable to choose an option',				'callback_id': 'merge_action',				'color': '#09aa08',				'attachment_type': 'default',				'actions': [					{						'name': 'merge',						'text': 'Merge','style':'primary','type': 'button','value': 'merge'},{'name': 'nomerge',						'text': 'Dont Merge',						'style':'danger',						'type': 'button',						'value': 'nomerge'					}				]			}		]	}";
// 	res.send(myjson);
// });

app.post('/actions', function(req, res) {
	console.log('Inside action response: ');	
	var reqActions = req.body.payload;
	console.log(reqActions);
	//parse the name of the action
	var actionName = JSON.parse(reqActions).actions[0].name;
	console.log(actionName);
	//res.type('json');
	res.send("you clicked merge button bro!");
});

if (process.env.SLACKTOKEN) {
	console.log("sab set hai-" + process.env.SLACKTOKEN);
}

if (!process.env.SLACKTOKEN) {
	console.log('Error: Specify Git token in environment variable: SLACKTOKEN');
	process.exit(1);
}

var controller = Botkit.slackbot({
	debug : false
});

// connect the bot to a stream of messages
var bot = controller.spawn({
	token : process.env.SLACKTOKEN
}).startRTM()

controller.configureSlackApp({
  clientId: clientId,//clientid
  clientSecret: clientSecret,//clientsecret
  redirectUri: 'https://6a10fde0.ngrok.io/oauth/',//oauth
  scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

// Greetings
controller.hears(['hi'], [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	controller.storage.users.get(message.user, function(err, user) {
    	console.log('inside hi');
		bot.reply(message, 'Sample');
	});
});


controller.hears(/\bissue.*request.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	// bot says: issue pull request on aakarshg/Serverprovision aakarshg-patch-3

	var X = "issue"
	var text_message = message.text
	var Z = "successfully issued " + text_message.toString().split(X).pop();



	var repo = "Serverprovision"
	var owner = "aakarshg"
	var branchName = "aakarshg-patch-4"
	var base = "master"
	var x = github.createPullRequest(owner, repo, branchName,base)
	if (x==true){
		console.log("Received response in bot.js")
	bot.reply(message,Z)
	}
});

controller.hears(/\bget.*requests.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	// bot says: Get pull requests for octat for repo Hello-World
	/*

	var sample_reply = "In the get pull requests"
	bot.reply(message,sample_reply.toString())

	*/

	var repo = "Serverprovision"
	var owner = "aakarshg"
	github.getPullRequests(owner, repo, (value) => {
		console.log('Bot: Received ' + value.length + ' Pull requests');
		var result = [];
		for(i=0;i<value.length;i++){
			result.push({Id:value[i].id,title:value[i].title});
		}
		var t = new Table
		result.forEach(function(req) {
			t.cell('Id                 \t\t', req.Id)
			t.cell('Title	', req.title)
			t.newRow()
		})
    	bot.reply(message, t.toString());
	});

});

controller.hears(/\bget.*request.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	// let the bot say: Get pull request 1 for octat for repo Hello-World
	//TODO: remove this?
	/*
	var sample_reply = "In the get pull request number"
	bot.reply(message,sample_reply.toString())
	*/
	/*
	bot.startConversation(message, function(err, convo) {
		convo.say('Better take this private...')
		convo.say({ ephemeral: true, text: 'These violent delights have violent ends' })
	})
	*/
	var repo = "Serverprovision" // extract this from user message/intent/context?
	var owner = "aakarshg" // extract this from user message/intent/context?
	var number = 15 // extract this from user message/intent/context?
	var branchName = "master" // extract this from user message/intent/context?
	github.getPullRequest(owner, repo,number, (value) => {
		console.log(value)
		var t ="Id: " + value.id + " Title: " +value.title + "description: " +value.body
    	bot.reply(message, t.toString());
	});

});
//@botCiCd merge #1 pull request for aakarshg/serverprovision

controller.hears(/\bmerge.*\b/, [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	console.log('inside merge method hear');
	var reply_with_attachments = {
		"text": "Would you like to merge this PR?",
		"attachments": [
			{
				"text": "Choose an option",
				"fallback": "You are unable to choose an option",
				"callback_id": "merge_action",
				"color": "#09aa08",
				"attachment_type": "default",
				"actions": [
					{
						"name": "merge",
						"text": "Merge",
						"style":"primary",
						"type": "button",
						"value": "merge"
					},
					{
						"name": "nomerge",
						"text": "Don't Merge",
						"style":"danger",
						"type": "button",
						"value": "nomerge"
					}
				]
			}
		]
	}
	bot.reply(message, reply_with_attachments);


// 	// old regex: \bmerge.*pull.*request.*\b
// 	console.log(message);
// 	console.log('inside pr merge');
// 	var repo = "serverprovision" // extract this from user message/intent/context?
// 	var owner = "aakarshg"// extract this from user message/intent/context?
// 	var prnumber = 15;// extract this from user message
// 	var branch = "aakarshg-patch-4"
// 	var adminlist = ["U6WCFDZL3", "assinsin", "sebotcicd","U6WGAURSQ","U6VUKPYCR"];
// 	var reply = '';
// 	//check admin list before actually merging
// 	if(adminlist.indexOf(message.user) > -1) {
// 	github.getStatus(owner,repo,branch,(out) =>{
// 	if(out)	{

// 		github.mergePullRequest(owner, repo, prnumber, (msg) => {
// 			if (msg) {
// 				console.log('msg received in bot: ' + msg)
// 				reply = msg;
// 				bot.reply(message, reply);
// 			}
// 		});
// 	}
// else{
// 	reply = "Build has been unsuccessful";
// 	bot.reply(message, reply);
// }
// });

// }
// 	else {
// 		reply = "You don't have permission to merge through the bot interface!";
// 		bot.reply(message, reply);
// 	}
});

// Getting the details from jenkins and this is where bot is supposed to hit git's rest api to get all details.
controller.hears(/\bsample.*Pull.*request.*submitted\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	console.log("Got the message");
	bot.say({text: "[sample/samplerepo] Pull request submitted by dummy #9 DummyPRTitle", channel: 'selenium-test'});
});
