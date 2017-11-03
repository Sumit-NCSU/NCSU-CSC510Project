const lib = require('lib')({token: process.env.STDLIB_TOKEN});

var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//send the mergePr message button when the user types slash command: /mergepr
/**
* Fetches token from storage
* @param {String} user username of person posting the message
*/
module.exports = function postMergeButton(user, callback) {
	console.log("Inside post merge method");
	app.post('/cibot@dev/mergepr', (req, res) => {
		console.log("inside app.post");
		res.status(200).end() // best practice to respond with empty 200 status code
		var reqBody = req.body
		var responseURL = reqBody.response_url
		if (reqBody.token != process.env.SLACK_VERIFICATION_TOKEN){
			res.status(403).end("Access forbidden");
			return callback(null, null);
		}else{
			console.log("inside creating message else");
			var message = {
				response_type: 'in_channel',
				"text": "Would you like to merge this PR?",
				"attachments": [
					{
						"text": "Choose an option",
						"fallback": "You are unable to choose an option",
						"callback_id": "merge_action",
						"color": "#09aa08",
						"attachment_type": "default",
						"actions": [
							{
								"name": "merge",
								"text": "Merge",
								"style":"primary",
								"type": "button",
								"value": "merge",
								"confirm": {
									"title": "Confirm Merge",
									"text": "Are you sure?",
									"ok_text": "Yes",
									"dismiss_text": "No"
								}
							},
							{
								"name": "nomerge",
								"text": "Don't Merge",
								"style":"danger",
								"type": "button",
								"value": "nomerge"
							}
						]
					}
				]
			}
			sendMessageToSlackResponseURL(responseURL, message)
			return callback(null, message);
		}
	});
}

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
	console.log("inside sendMessage method");
	var postOptions = {
		uri: responseURL,
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		json: JSONmessage
	}
	request(postOptions, (error, response, body) => {
		if (error){
			console.log(error);
		}
	})
};


// module.exports = {
// 	sendMergeMessageButton,
// 	respondToMergeButtonClick,
// 	sendMessageToSlackResponseURL
//  }