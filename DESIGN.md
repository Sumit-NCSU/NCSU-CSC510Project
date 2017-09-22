# CSC510 Project Design

* ## Problem Statement
Our project aims to help in reducing all the manual work that most software developments teams have to go through for getting the code from their machines deployed to the server. Typically, it involves: 
  * Pushing their code to GitHub,
  * Building the project through Jenkins,
  * Running all the test cases/code coverage/code quality tools and making sure none of them are failing,
  * Code-review and merge branch,
  * Then finally deploying it on the server.

Also, while doing going through this entire process, especially in large teams, they need to make sure that other people in the team are also aware of the deployments and downtimes associated with the deployments so that the teams do not face problems such as two people trying to deploy their code at the same time to the same server, etc.

In order to solve these problems, we have decided to build a slack bot that helps in automating the entire process while also providing the notifications and live status updates of the process to the entire team on slack, which would help in avoiding the manual process of going to various systems and/or teams to get the deployment done and to allow the teams to coordinate together on one platform - Slack.

* ## Bot Description
Our CICD bot has the following features:
  * Get notifications on Slack whenever someone pushes code in Git.
  * View and merge Pending Pull requests from Git repository on Slack.
  * Trigger auto-builds and execute test cases/code quality tools in Jenkins.
  * Report the build status on Slack after the Jenkins build is complete.
  * View status of old builds from Jenkins.
  * Allow for team members to vote on changes through slack messages. 
  * Trigger auto deployments to server if the build is successful and passes all the tests.
  * Manually do a deployment to the server if needed.
  * Receive notifications on Slack regarding the status of the deployment - Successful/Failed.

Having these features in our bot helps solve the problem of coordination within the team as all the notifications are received on Slack and thus the entire team is aware of the changes going on. Also, it helps the developers avoid the manual process of going to multiple parties to get the job done.

All the commands for the bot are to be designed in such a way that the users can just tell the bot what to do in simple English sentences and the bot will automatically parse the sentence and trigger the required commands in the back end. This way, the users do not have to remember difficult and specific commands to get the job done.

Among the categories discussed in class, this bot fits into the *DevOps* bot category, because it is helping the developers access various tools from within a conversation with the bot and allows the users to manage deployments and receive notifications.

* ## Use Cases
### Use Case 1: View and merge Pending Pull requests from Git repository on Slack
1. Preconditions:
   * User must know the name of the Git Repository. 
2. Main Flow:
   * User will request the pull requests and provide name of the repository [S1]. Bot will provide a list of the Pull requests pending for merge with their status (i.e. checks passing or failing), code-reviews by oother users and ask the user if he wants to merge a pull request [S2]. User replies Yes for Merge [S3]. Bot merges the pull request specified, if all checks have passed [S4]. In case of a merge conflict, the necessary parties will be notified on channel [S5]. 
3. Subflows:
    * [S1] User will type sentence like `@slackbot show pull requests for <Repo Name>`.
    * [S2] Bot will return list of pending pull requests for the given repo and ask for the if user wants to merge.
    * [S3] User will reply with Pull Request number for merging or No for not merging.
    * [S4] Bot will merge the pull request if all the checks for merging have passed and PR can be merged.
    * [S5] Bot will post a message to channel informing the owner of the repository and the user who made changes about the merge conflict.
4. Alternative Flows:
    * [E1] Repo is unavailable: Bot will reply `Repo Unavailable`.
    * [E2] Pull Request number requested is unavailable or it cannot be merged: Bot will reply `PR Unavailable` or a reason why the PR cannot be merged.

### Use Case 2: View status of a particular build number of a Job in Jenkins and rebuild
1. Preconditions
   * User know the name of the Jenkins Job 
   * User should know the build number or flow [E2]
2. Main Flow
   * User will request the status of the build number by providing with name for the Jenkins Job [S1]. Bot will provide the status and also ask user if he wants to Rebuild [S2]. User replies Yes to rebuild that particular build [S3]. 
3. Subflows
   * [S1] User will type sentence like `@slackbot show builds for <Job Name> <Build Number>`.
   * [S2] Bot will return status (Pass/Fail) and asks if the user wants to rebuild the job (Yes/No).
   * [S3] User will reply Yes or No.
4. Alternative Flows
   * [E1] Jenkins Job unavailable or the user does not have proper permission: Bot will reply `Job Unavailable`
   * [E2] User doesn't give a specific Build Number: Bot replies with last 5 builds and their statuses. 

### Use Case 3: Turn on automatic notifications for a Jenkins Job
1. Preconditions
   * User must know the Job name.
   * Bot must have authentication to access the jenkins server
2. Main Flow
   * User will request automatic notifications for a Jenkins Job and give the job name [S1]. Bot will confirm that notifications are turned on for the Jenkins Job [S2]. Once the Jenkins build is complete, bot will reply with the details of the build [S3].
3. Subflows
   * [S1] User will type sentence like `@slackbot enable build notifications for <job name>`.
   * [S2] Bot will return confirmation that notifications are turned on for the requested Jenkins Job.
   * [S3] Bot replies with the build status and other details like time taken for build, changes processed etc. 
4. Alternative Flows
   * [E1] Jenkins Job unavailable or the user does not have proper permission: Bot will reply `Job Unavailable` or `No Permission`.
   
### Use Case 4: Provide voting on a pull request
1. Preconditions
   * User must know the repo name and PR number.
2. Main Flow
   * User will vote for a pull request and it +1 or -1 [S1]. Bot will then store the data and update the final review [S2]. 
3. Subflows
   * [S1] User will type sentence like `@slackbot vote <repo> <pr> +1/-1`.
   * [S2] Bot will update redis database to store vote for the PR and display the current total vote.
4. Alternative Flows
   * [E1] PR unavailable or already merged will make bot to reply`PR invalid` or `Already merged`.
   

* ## Design Sketches

* ## Architecture Design + Additional Patterns
