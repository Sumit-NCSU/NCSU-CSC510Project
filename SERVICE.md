# Service

## Use Case #1 Implementation

## Use Case #2 Implementation

## Use Case #3 Implementation

For Use case 3, we implemented the merge pull request functionality using the [Git API](https://developer.github.com/v3/pulls/#merge-a-pull-request-merge-button). Using the bot, we fetched the parts of the message from the user message like repository name, branch name etc. and using these details we called the merge pull request functionality by sending the following JSON message as a PUT request to Git API:
```
url: 'https://api.github.com/repos/' + owner + "/" + repo + "/pulls/" + number + "/merge",
		method: 'PUT',
		headers: {
			"User-Agent": "CiBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
			"commit_title": "Merged by CiBot",
			"commit_message": "Merged by CiBot"
		}
```
The limitation here is that the bot can only merge oull pull requests which are mergeable. If the pull request is not mergeable due to any reason, then the bot responds with an appropriate error message.


## Identifying and handling Edge cases

## Streamlining the bot interaction

## Task Tracking

[Worksheet](WORKSHEET.md)

## Screencast

[Screencast]()
