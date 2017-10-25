// webhook url = https://hooks.slack.com/services/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
var Botkit = require('botkit');
var nock = require("nock");
var arrayToTable = require('array-to-table');
var Table = require('easy-table')
// Load mock data
var data = require("./mock.json")

if (!process.env.SLACKTOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
    debug: false
});

// connect the bot to a stream of messages
var bot = controller.spawn({
  token: process.env.SLACKTOKEN
}).startRTM()

// Greetings
controller.hears(['hi', 'greetings'],['mention', 'direct_mention','direct_message'], function(bot,message) 
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
//controller.hears(/\bpull.*request.*\b/,['mention', 'direct_mention','direct_message'], function(bot,message) 
//{
 // console.log(message);
  //bot.reply(message, reply);
//});


// Returns list of pull requests to user for a repo.
controller.hears('List pull requests for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 	var repo = "Hello-World"
	var result = [];
	//console.log(listPullRequests().interceptors[0].body)
	var pull_reqs = JSON.parse(listPullRequests().interceptors[0].body);
	//console.log(pull_reqs)
	for(i=0;i<pull_reqs.length;i++){
	  result.push({Id:pull_reqs[i].id,title:pull_reqs[i].title});
	}
	var t = new Table

	result.forEach(function(req) {
	t.cell('Id', req.Id)
	t.cell('		Title	', req.title)
	t.newRow()
	})
  bot.reply(message, t.toString());
});

// Details of a particular pull request
controller.hears('Get pull request 1 for octat for repo Hello-World',['mention', 'direct_mention','direct_message'], function(bot,message) 
{ 	var repo = "Hello-World"
	console.log(getPullRequest())
	var pull_req = JSON.parse(getPullRequest().interceptors[0].body);
	
	var t = new Table
	t.cell('Id', pull_req.id)
	t.cell('State	', pull_req.state)
	t.cell('		Title	', pull_req.title)
	t.cell('	Description	', pull_req.body)
	t.newRow()
    bot.reply(message, t.toString());
});


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
      .get("/repos/octocat/Hello-World/pulls/" + number).persist()
      .reply(200, JSON.stringify(data.pull_req_files) );
	  
	return files;
}

function mergePullRequest(){
    var merge_resp = nock("https://api.github.com")
      .put("/repos/octocat/Hello-World/pulls/1/merge")
      .reply(200, JSON.stringify(data.merge_pull_req) );
	  
	return merge_resp;
}