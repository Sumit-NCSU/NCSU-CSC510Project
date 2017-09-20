# CSC510 Project Design

* ## Problem Statement
Our project aims to help in reducing all the manual work that most software developments teams have to go through for getting the code from their machines deployed to the server. Typically, it involves: 
  * Pushing their code to GitHub,
  * Building the project through Jenkins,
  * Running all the test cases/code coverage/code quality tools and making sure none of them are failing,
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
  * Trigger auto deployments to server if the build is successful and passes all the tests.
  * Manually do a deployment to the server if needed.
  * Receive notifications on Slack regarding the status of the deployment - Successful/Failed.

Having these features in our bot helps solve the problem of coordination within the team as all the notifications are received on Slack and thus the entire team is aware of the changes going on. Also, it helps the developers avoid the manual process of going to multiple parties to get the job done.

All the commands for the bot are designed in such a way that the users can just tell the bot what to do in simple English sentences and the bot will automatically parse the sentence and trigger the required commands in the back end. This way, the users do not have to remember difficult and specific commands to get the job done.

Among the categories discussed in class, this bot fits into the *DevOps* bot category, because it is helping the developers access various tools from within a conversation with the bot and allows the users to manage deployments and receive notifications.

* ## Use Cases
### Use Case 1: View and merge Pending Pull requests from Git repository on Slack
1. Preconditions:
   * User must have access and required permissions on the Git Repository.
   * User must know the name of the Git Repository.
2. Main Flow:
   * User will request the pull requests and provide name of the repository [S1]. Bot will provide a list of the Pull requests pending for merge with their status (i.e. checks passing or failing) and ask the user if he wants to merge a pull request [S2]. User replies Yes for Merge [S3]. Bot merges the pull request specified, if all checks have passed [S4].
3. Subflows:
    * [S1] User will type sentence like `@slackbot show pull requests for <Repo Name>`.
    * [S2] Bot will return list of pending pull requests for the given repo and ask for the if user wants to merge.
    * [S3] User will reply with Pull Request number for merging or No for not merging.
    * [S4] Bot will merge the pull request if all the checks for merging have passed and PR can be merged.
4. Alternative Flows:
    * [E1] Repo is unavailable: Bot will reply `Repo Unavailable`.
    * [E2] Pull Request number requested is unavailable or it cannot be merged: Bot will reply `PR Unavailable` or a reason why the PR cannot be merged.

### Use Case 2: View status of old builds from Jenkins
1. Preconditions
   * User must have access and required permissions on the Jenkins Job.
   * User must know the name of the Jenkins Job.
2. Main Flow
   * User will request old builds and give the name for the Jenkins Job [S1]. Bot will provide list of last 5 builds to the user along with their status and asks the user if they want to see older builds [S2]. User replies Yes to view older builds [S3]. Bot repeats process [S2] if user asks for older builds and there are previous builds to show.
3. Subflows
   * [S1] User will type sentence like `@slackbot show builds for <Job Name>`.
   * [S2] Bot will return list build numbers and status (Pass/Fail) for the last 5 builds and asks if the user wants to view older builds (Yes/No).
   * [S3] User will reply Yes or No.
4. Alternative Flows
   * [E1] Jenkins Job unavailable or the user does not have proper permission: Bot will reply `Job Unavailable` or `No Permission`.
   * [E2] User asks for a specific Build Number: Bot replies only details of that specific build.

### Use Case 3: Turn on automatic notifications for Jenkins build completion.
1. Preconditions
   * User must have access and required permissions on the Jenkins Job.
2. Main Flow
   * User will request automatic notifications for a Jenkins Job and give the job name [S1]. Bot will confirm that notifications are turned on for the Jenkins Job [S2]. Once the Jenkins build is complete, bot will reply with the details of the build [S3].
3. Subflows
   * [S1] User will type sentence like `@slackbot enable build notifications for <Job Name>`.
   * [S2] Bot will return confirmation that notifications are turned on for the requested Jenkins Job.
   * [S3] Bot replies with the build status and other details like time taken for build, changes processed etc. 
4. Alternative Flows
   * [E1] Jenkins Job unavailable or the user does not have proper permission: Bot will reply `Job Unavailable` or `No Permission`.

* ## Design Sketches

* ## Architecture Design + Additional Patterns
