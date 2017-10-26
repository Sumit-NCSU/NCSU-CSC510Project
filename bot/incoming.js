var Botkit = require('botkit');
var controller = Botkit.slackbot({})

// var webhook_url = 'https://hooks.slack.com/services/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';
var webhook_url = 'https://hooks.slack.com/services/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';
var bot = controller.spawn({
  token: '<TOKEN>'
});

// use RTM
bot.startRTM(function(err,bot,payload) {
  // handle errors...
});

// send webhooks
bot.configureIncomingWebhook({url: webhook_url});
bot.sendWebhook({
  text: '<@cicdbot> [sample/samplerepo] Pull request submitted by dummy',
  channel: '#bot-interaction',
},function(err,res) {
  // handle error
});