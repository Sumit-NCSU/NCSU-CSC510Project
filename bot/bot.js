var Botkit = require('botkit')
var nock = require("nock")
var Table = require('easy-table')
// Load mock data
// var data = require("./mock.json")
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
	token : process.env.SLACKTOKEN,
}).startRTM()

// TODO: remove hardcoded tokens later.
controller.configureSlackApp({
  clientId: "234420262803.266365986402",//clientid
  clientSecret: "0aa2f397cb34ce5ce8867bcb3c9379fa",//clientsecret
  redirectUri: 'https://srivassumit.lib.id/cibot@dev/auth/',//oauth
  scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

// Greetings
controller.hears([ 'hi','Hello'], [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	controller.storage.users.get(message.user, function(err, user) {
    console.log('inside hi');
	bot.reply(message, 'Hello');
	});
});

// Details of a particular pull request
controller.hears('Get pull request 1 for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 	
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

controller.hears('Get pull requests for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 	
	var repo = "Hello-World"
	var owner = "octat"
	var branchName = ""
	var isOpen = true
	var pull_reqs = github.getPullRequests(owner, repo, isOpen, branchName)
	pull_reqs.then(function(value){
		var result = [];
		for(i=0;i<value.length;i++){
			result.push({Id:value[i].id,title:value[i].title});
		}
	var result = [];
	for(i=0;i<pull_reqs.length;i++){
	  result.push({Id:pull_reqs[i].id,title:pull_reqs[i].title});
	}
	var t = new Table

	result.forEach(function(req) {
	t.cell('Id', req.Id)
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
  var prnumber = 11;
  var msg = mergePullRequest(prnumber);
  var adminlist = ["aakarshg", "assinsin", "sebotcicd"]; 
  console.log(msg)
  var reply = '';
  if (msg.merged  ) {
    if(adminlist.contains(message.user)){
    reply = msg.message;
	  };
  } else {
    reply = 'Not able to Merge!';
  }
  bot.reply(message, reply);
});


// Getting the details from jenkins and this is where bot is supposed to hit git's rest api to get all details.
controller.hears(/\bsample.*Pull.*request.*submitted\b/,['mention', 'direct_mention','direct_message'], function(bot,message) 
{    console.log("Got the message");
 bot.say({
   text: "[sample/samplerepo] Pull request submitted by dummy #9 DummyPRTitle",
   channel: 'selenium-test'
    });
});
