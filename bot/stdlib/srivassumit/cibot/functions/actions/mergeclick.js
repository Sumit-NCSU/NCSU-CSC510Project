const lib = require('lib')({token: process.env.STDLIB_TOKEN});

var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function respondMergeButtonClick(callback) {
	//parse the action when the user clicks a button on the merge pr message button
	app.post('/cibot@dev/actions', urlencodedParser, (req, res) =>{
		res.status(200).end() // best practice to respond with 200 status
		var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
		var message = {
			"text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].name,
			"replace_original": false
		}
		console.log(message);
		//sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
		return callback(null, message);
	});
}