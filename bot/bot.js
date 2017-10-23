var Botkit = require('botkit');
var nock = require("nock");
//var main = require("../bot.js");
// Load mock data
var data = require("../mock.json")

var controller = Botkit.slackbot({
    debug: false
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
  });

// connect the bot to a stream of messages
controller.spawn({
  token: 'xoxb-261568621879-G2H3sbqTATOsiYsMIGvb9oRK',
}).startRTM()

controller.hears('call',['mention', 'direct_mention','direct_message'], function(bot,message) 
{
  console.log(message); 
  var reply = processMessage(message);
  bot.reply(message, reply);
});

function processMessage(message) {
    var create_hook = nock("https://api.github.com")
      .get("/repos/repos/octocat/Hello-World/hooks")
      .reply(200, JSON.stringify(data.webhook) );
 
	var payload = data.pull_request_payload;
	return "reply";
}