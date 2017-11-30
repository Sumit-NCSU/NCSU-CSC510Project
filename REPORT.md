# Report

## The problem our bot solved
Cibot is a Slackbot that facilitates pull request management on Github. It is a one-stop bot for all actions that could be performed on pull requests that makes it very convenient for a user to perform actions like issuing a pull request, getting a list of all open pull requests, getting the details of a particular pull request and merging a pull request. An authorized user can perform all these actions by just typing simple commands on the Slack channel.

Cibot helps solve the problem of coordination within the team as all the notifications are received on Slack and thus the entire team is aware of the changes going on. Also, it helps the developers avoid the manual process of going to multiple parties to get the job done.

All the commands for the bot designed in such a way that the users can just tell the bot what to do in simple English sentences and the bot will automatically parse the sentence and trigger the required commands in the back end. This way, the users do not have to remember difficult and specific commands to get the job done.

Cibot helps the developers access various tools from within a conversation with the bot and allows the users to manage deployments and receive notifications.

## Primary features and screenshots

The primary features of our bot are:

* Issue a new Pull Request for a given Repository from a base branch onto a HEAD branch
* View a list of all the pull requests on a given Repository.
* View the details of a Specific Pull Request.
* Merge a given Pull Request

Screenshots:

## Use Case 0: Getting list of commands that can be used with CiBot
![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase0.png)

## Use Case 1: Issue a pull request

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase1_1.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase1_2.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase1_3.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase1_4.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase1_5.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase1_6.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase1_7.png)

## Use Case 2: List open pull requests

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase2_1.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase2_2.png)

## Use Case 3: Merge pull request

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase3_1.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase3_2.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase3_3.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone4/images/usecase3_4.png)


## Reflection on the development process and the project

Throughout the project, we followed agile methedology

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone3/media/Architecture%20diagram.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone3/media/ArchitectureLLD.png)

![img1](https://github.ncsu.edu/ssrivas8/CSC510Project/blob/milestone3/media/Architecture_HL.png)

## Limitations and future work

### Limitations

`CiBot` cannot merge the pull requests which are not auto-mergeable.

### Future work

In case of a non-meargeable pull request, we can identifying the specific commits which cause the pull request to be non-meargeable and then display a list of those commits to the users.
