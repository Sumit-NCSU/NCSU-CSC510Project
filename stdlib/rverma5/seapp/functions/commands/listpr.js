var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /example
*
*   Command for whowing the List PR buttons.
*
*   See https://api.slack.com/slash-commands for more details.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
	console.log(`Inside listpr method by user <@${user}>`);
	callback(null, {
		response_type: 'in_channel',
		"text": "Would you like to see the list of Pull requests?",
		"attachments": [
		  {
			"text": "Choose an option",
			"fallback": "You are unable to choose an option",
			"callback_id": "listpr_action",
			"color": "#09aa08",
			"attachment_type": "default",
			"actions": [
			  {
				"name": "example",
				"text": "example",
				"style":"primary",
				"type": "button",
				"value": "example",
				
			  },
			  {
				"name": "Dontlist",
				"text": "Do not List",
				"style":"danger",
				"type": "button",
				"value": "Dontlist"
			  }
			]
		  }
		]
	});

};
