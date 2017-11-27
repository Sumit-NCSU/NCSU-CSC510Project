var Botkit = require('botkit')
var nock = require("nock")
var Table = require('easy-table')
var Promise = require("bluebird");
var github = require("./gitinterface.js");


if (!process.env.wit) {
    console.log('Error: Specify wit in environment');
    process.exit(1);
}

if (!process.env.SLACKTOKEN) {
	console.log('Error: Specify Git token in environment variable: SLACKTOKEN');
	process.exit(1);
}

var wit = require('./src/botkit-middleware-witai')({
    token: process.env.wit,
});

var controller = Botkit.slackbot({
	debug : false
});

// connect the bot to a stream of messages
var bot = controller.spawn({
	token : process.env.SLACKTOKEN
}).startRTM()

controller.configureSlackApp({
  clientId: "<<CLIENT_ID>>",//clientid
  clientSecret: "<<CLIENT_SECRET",//clientsecret
  redirectUri: 'https://srivassumit.lib.id/cibot@dev/auth/',//oauth
  scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

controller.middleware.receive.use(wit.receive);

controller.hears(['hello'], 'direct_message,direct_mention,mention', wit.hears, function(bot, message) {
   console.log('wit hi');   
   bot.reply(message, 'Hello!');
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
	// old regex: \bmerge.*pull.*request.*\b
	console.log(message);
	console.log('inside pr merge');
	var repo = "serverprovision" // extract this from user message/intent/context?
	var owner = "aakarshg"// extract this from user message/intent/context?
	var prnumber = 15;// extract this from user message
	var branch = "aakarshg-patch-4"
	var adminlist = ["U6WCFDZL3", "assinsin", "sebotcicd","U6WGAURSQ","U6VUKPYCR"];
	var reply = '';
	//check admin list before actually merging
	if(adminlist.indexOf(message.user) > -1) {
	github.getStatus(owner,repo,branch,(out) =>{
	if(out)	{

		github.mergePullRequest(owner, repo, prnumber, (msg) => {
			if (msg) {
				console.log('msg received in bot: ' + msg)
				reply = msg;
				bot.reply(message, reply);
			}
		});
	}
else{
	reply = "Build has been unsuccessful";
	bot.reply(message, reply);
}
});

}
	else {
		reply = "You don't have permission to merge through the bot interface!";
		bot.reply(message, reply);
	}
});

// Getting the details from jenkins and this is where bot is supposed to hit git's rest api to get all details.
controller.hears(/\bsample.*Pull.*request.*submitted\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	console.log("Got the message");
	bot.say({text: "[sample/samplerepo] Pull request submitted by dummy #9 DummyPRTitle", channel: 'selenium-test'});
});
