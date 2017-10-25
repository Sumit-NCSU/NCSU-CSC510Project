var Botkit = require('botkit');

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
  token: process.env.SLACKTOKEN,
  incoming_webhook: {
    url: "https://hooks.slack.com/services/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"
  }
}).startRTM()

// bot.configureIncomingWebhook({url: webhook_url});
bot.sendWebhook({
  text: 'This is an incoming webhook',
  channel: '@samplebot',
},function(err,res) {
  if (err) {
    // ...
  }
});