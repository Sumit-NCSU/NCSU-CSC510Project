# Bot

* ## Use Cases
Common Pre conditions for all the use cases are:
  * Slack bot must be configured with the API token for Git and Jenkins.
  
### Use Case 1: Post updates on pull requests submitted on Slack
1. Preconditions:
   * Jenkins must be configured to alert bot of changes
   * Bot must be configured to look at pull requests on the particular repository
2. Main Flow:
   * Submitting a pull request will trigger the testing job on Jenkins [S1]. Jenkins will then alert the bot [S2]. The bot then accesses the details of the pull request through Git API [S3]. It then posts the details of the pull request on slack [S4].
3. Subflows:
    * [S1] A team member will submit the pull request.
    * [S2] The pull request triggers the job on Jenkins which has a pre-build step alerting the bot by using Rest API.
    * [S3] Bot uses Git API to get details of the particular pull request.
    * [S4] Bot posts initial details of the pull request on slack.
4. Alternative Flows:
    * [E1] Jenkins alerts bot with a post-build step sending information about outcome of job.
    
### Use Case 2: View details of open pull requests on a particular repository

1. Preconditions
   * Bot needs to be subscribed to the repository requested by user
2. Main Flow
   * User will request open pull requests by giving the bot  [S1]. Bot will provide list of open pull requests associated with the particular repository [S2].
3. Subflows
   * [S1] User will type sentence like `@botCiCd pending pull requests for aakarshg/serverprovision`.
   * [S2] Bot will return with list of pull requests along with job status (Pass/Fail)
4. Alternative Flows
   * [E1] User can ask for details of the a particular Pull request by specifying it's number along with repository. 
   * [E2] User can issue merging 
    
### Use Case 3: Merge pull request on a particular repository

1. Preconditions
   * Bot needs to be subscribed to the repository requested by user
   * User needs to be an admin. 
   * The pull request needs to have it's associated Jenkins build status as SUCCESS. 
2. Main Flow
   * User will ask the slackbot to merge a particular request [S1]. Bot will verify the credentials [S2]. Bot will then merge the request through Git's REST API and post update on slack.
3. Subflows
   * [S1] User will type sentence like `@botCiCd merge #1 pull request for aakarshg/serverprovision`.
   * [S2] Bot will verify admin status of user and status of jenkins build.

* ## Mocking

* ## Bot Implementation

* ## Selenium Testing

* ## Link to Task Tracking
[Worksheet.md](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/master/WORKSHEET.md)

