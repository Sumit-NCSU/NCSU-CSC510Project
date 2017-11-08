var Botkit = require('botkit')
var nock = require("nock")
var Table = require('easy-table')
var Promise = require("bluebird");
var github = require("./gitinterface.js");

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

// TODO: remove hardcoded tokens later.
controller.configureSlackApp({
  clientId: "234420262803.266365986402",//clientid
  clientSecret: "0aa2f397cb34ce5ce8867bcb3c9379fa",//clientsecret
  redirectUri: 'https://srivassumit.lib.id/cibot@dev/auth/',//oauth
  scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

// Greetings
controller.hears(['hi'], [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	controller.storage.users.get(message.user, function(err, user) {
    	console.log('inside hi');
		bot.reply(message, 'Hello');
	});
});

//TODO: generalize this
controller.hears('Get pull request 1 for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 	
	//TODO: remove this?
	bot.startConversation(message, function(err, convo) {
		convo.say('Better take this private...')
		convo.say({ ephemeral: true, text: 'These violent delights have violent ends' })
	})
	var repo = "Hello-World"
	var owner = "octat"
	var number = 1
	var branchName = ""
	var pull_req = github.getPullRequest(owner, repo, number, branchName)
	var t = new Table
	t.cell('Id', pull_req.id)
	t.cell('State	', pull_req.state)
	t.cell('Title	', pull_req.title)
	t.cell('Description	', pull_req.body)
	t.newRow()
    bot.reply(message, t.toString());
});

//TODO: generalize this
controller.hears('Get pull requests for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) {
	var repo = "SEGitAPI"
	var owner = "srivassumit"
	var branchName = "master"
	var isOpen = true
	github.getPullRequests(owner, repo, isOpen, branchName, (value) => {
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

//@botCiCd merge #1 pull request for aakarshg/serverprovision
controller.hears(/\bmerge.*pull.*request.*\b/, [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	// TODO: Aakarsh to do the Jenkins integration for merging request. U can put your code here fro merging pull request.
	console.log(message);
	console.log('inside pr merge');
	var prnumber =6;
	var msg = mergePullRequest(prnumber);
	console.log(msg)
	var adminlist = ["aakarshg", "assinsin", "sebotcicd","U6WGAURSQ","U6VUKPYCR"];
	var reply = '';
	github.mergePullRequest("srivassumit", "SEGitAPI", prnumber, (msg) => {
	if (msg) {
		console.log('msg received in bot: ' + msg)
		//check if user is allowed to merge via the bot.
		if(adminlist.indexOf(message.user) > -1) {
			reply = msg;
		} else {
			reply = "You don't have permission to merge through the bot interface!";
		}
	}
	bot.reply(message, reply);
	});
});

//TODO: remove this? This was used for the mock phase?
// Getting the details from jenkins and this is where bot is supposed to hit git's rest api to get all details.
controller.hears(/\bsample.*Pull.*request.*submitted\b/,['mention', 'direct_mention','direct_message'], function(bot,message) {
	console.log("Got the message");
	bot.say({text: "[sample/samplerepo] Pull request submitted by dummy #9 DummyPRTitle", channel: 'selenium-test'});
});
