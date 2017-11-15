# Service

## Use Case #1 Implementation

## Use Case #2 Implementation

For Use case 2, we implemented the Get functionality using [Git API- get](https://developer.github.com/v3/repos/#get). Using the bot, we fetch parts of thr essage from the user like the owner, repo name, number etc and using these details, called the getPullRequest functionality by sending the following as a JSON message as a GET request to the Git API:
```
url: 'https://api.github.com/repos/' + '/repos/' + owner + '/' + repo + '/pulls/' + number.
		method: 'GET',
		headers: {
			"User-Agent": "CiCdBot",
			"content-type": "application/json",
			"Authorization": "token " + process.env.GITTOKEN,
			"base": branchName
		}
		
```

## Use Case #3 Implementation

For Use case 3, we implemented the merge pull request functionality using the [Git API-merge](https://developer.github.com/v3/pulls/#merge-a-pull-request-merge-button). Using the bot, we fetched the parts of the message from the user message like repository name, branch name etc. and using these details we called the merge pull request functionality by sending the following JSON message as a PUT request to Git API:
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
Edge Case1: The code is not merged until it passes all the checks.  
Edge Case2: If the user is not in the admin list, he/she cannot merge any pull requests.  
Edge Case3: Bot replies with error messages whenever the information given to it is not complete.  
## Streamlining the bot interaction

## Task Tracking

[Worksheet](WORKSHEET.md)

## Screencast

[Screencast](https://www.youtube.com/watch?v=MNnJc90oxr8&t=27s)
