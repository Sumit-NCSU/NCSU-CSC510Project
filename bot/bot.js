var Botkit = require('botkit');
var nock = require("nock");
//var main = require("../bot.js");
// Load mock data
var data = require("./mock.json")

var controller = Botkit.slackbot({
    debug: false
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
  });

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM()

controller.hears('call',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  console.log(message); 
  var reply = processMessage(message);
  bot.reply(message, reply);
});

function processMessage(message) {
    
	return "reply";
}

function createwebhook(){
	var create_hook = nock("https://api.github.com")
      .get("/repos/repos/octocat/Hello-World/hooks")
      .reply(200, JSON.stringify(data.webhook) );
}

function getPayLoad(){
	var payload = data.pull_request_payload;
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
      .get("/repos/octocat/Hello-World/pulls/1")
      .reply(200, JSON.stringify(data.pull_req_files) );
	  
	return files;
}

function mergePullRequest(){
    var merge_resp = nock("https://api.github.com")
      .get("/repos/octocat/Hello-World/pulls/1/merge")
      .reply(200, JSON.stringify(data.merge_pull_req) );
	  
	return merge_resp;
}