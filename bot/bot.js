// https://hooks.slack.com/services/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  : webhook url
// https://hooks.slack.com/services/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
if (!process.env.SLACKTOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}
var Botkit = require('botkit');
var nock = require("nock");
// Load mock data
var data = require("./mock.json")

var controller = Botkit.slackbot({
    debug: false
});

// connect the bot to a stream of messages
var bot = controller.spawn({
  token: process.env.SLACKTOKEN
}).startRTM()

// Greetings
controller.hears(['hi', 'hello', 'greetings'],['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(/\bhow.*ur.*day.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 
  bot.reply(message, "Great.! I hope yours is going fine as well.! ");
});

//Show all pull requests
controller.hears(/\bpull.*request.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  console.log(message);
  bot.reply(message, reply);
});


// Returns list of pull requests to user for a repo.
controller.hears('List pull requests for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ var repo = "Hello-World"
  var 
  var pull_reqs = listPullRequests();
  
  bot.reply(message, "Great.! I hope yours is going fine as well.! ");
});


//pull_request payload
function getPayLoad(){
	var payload = data.pull_request_payload;
}

//Get a pull request info. and send to slack through webhook.
function getPullRequest(repo, number){
	var pull_request = nock("https://api.github.com")
      .get("/repos/octocat/Hello-World/pulls/" + number)
      .reply(200, JSON.stringify(data.pull_req));
	  
	return pull_request; 
}

// Lists all pull requests of a repo
function listPullRequests(){
	var pull_requests = nock("https://api.github.com")
      .get("/repos/octocat/Hello-World/pulls")
      .reply(200, JSON.stringify(data.pull_requests));
	  
	return pull_requests; 
}

//List files of a specific pullrequest
function listPullRequestFiles(number){
	var files = nock("https://api.github.com")
      .get("/repos/octocat/Hello-World/pulls/" + number)
      .reply(200, JSON.stringify(data.pull_req_files) );
	  
	return files;
}

function mergePullRequest(){
    var merge_resp = nock("https://api.github.com")
      .put("/repos/octocat/Hello-World/pulls/1/merge")
      .reply(200, JSON.stringify(data.merge_pull_req) );
	  
	return merge_resp;
}