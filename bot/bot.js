
var Botkit = require('botkit')
var nock = require("nock")
var Table = require('easy-table')
// Load mock data
var data = require("./mock.json")
var Promise = require("bluebird");
var github = require("./github.js");

if (!process.env.SLACKTOKEN) {
	console.log('Error: Specify token in environment');
	process.exit(1);
}

var controller = Botkit.slackbot({
	debug : false
});

// connect the bot to a stream of messages
var bot = controller.spawn({
	token : process.env.SLACKTOKEN
}).startRTM()

// Greetings
controller.hears([ 'hi' ], [ 'mention', 'direct_mention', 'direct_message' ], function(bot, message) {
	controller.storage.users.get(message.user, function(err, user) {
    console.log('inside hi');
			bot.reply(message, 'Hello');
	});
});

// Details of a particular pull request
controller.hears('Get pull request 1 for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 	var repo = "Hello-World"
	console.log(getPullRequest())
	var pull_req = JSON.parse(getPullRequest().interceptors[0].body);
	var t = new Table
	t.cell('Id', pull_req.id)
	t.cell('State	', pull_req.state)
	t.cell('Title	', pull_req.title)
	t.cell('Description	', pull_req.body)
	t.newRow()
    bot.reply(message, t.toString());
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


controller.hears('Get pull requests for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 	var repo = "Hello-World"
	var result = [];
	var pull_reqs = JSON.parse(listPullRequests().interceptors[0].body);
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

// Getting the details from jenkins and this is where bot is supposed to hit git's rest api to get all details.
controller.hears(/\bsample.*Pull.*request.*submitted\b/,['mention', 'direct_mention','direct_message'], function(bot,message) 
{    console.log("Got the message");
 bot.say({
   text: "[sample/samplerepo] Pull request submitted by dummy #9 DummyPRTitle",
   channel: 'selenium-test'
    });
});

// // Returns list of pull requests to user for a repo.
// controller.hears('List pull requests for octat for repo Hello-World', 
// ['mention', 'direct_mention', 'direct_message' ], function(bot, message) {
//     var repo = "Hello-World"
//     console.log('inside octocat');
//     var pull_req = listPullRequests();//PRNumber: 1347, title: new-feature
//     var msg = "PRNumber: " + pull_req.number+ ", title: " + pull_req.title
//     bot.reply(message, msg);
// });


// pull_request payload
function getPayLoad() {
	var payload = data.pull_request_payload;
}

// Get a pull request info. and send to slack through webhook.
function getPullRequest(repo, number) {
	var pull_request = nock("https://api.github.com").get("/repos/octocat/Hello-World/pulls/" + number).reply(200, JSON.stringify(data.pull_req));
	return pull_request;
}

// Lists all pull requests of a repo
function listPullRequests() {
  var pull_requests = nock("https://api.github.com").get("/repos/octocat/Hello-World/pulls").reply(200, JSON.stringify(data.pull_requests));
	return pull_requests;
}

// List files of a specific pullrequest
function listPullRequestFiles(number) {
	var files = nock("https://api.github.com").get("/repos/octocat/Hello-World/pulls/" + number).reply(200, JSON.stringify(data.pull_req_files));
	return files;
}

function mergePullRequest(prnumber) {
  var merge_resp = nock("https://api.github.com").put("/repos/octocat/Hello-World/pulls/1/merge").reply(200, JSON.stringify(data.merge_pull_req));  
  console.log('merging')
	return data.merge_pull_req;
}
