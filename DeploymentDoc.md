## Deployment Pipeline

<hr>

#### Requirements
1. Your host machine should have vagrant and virtualbox installed </br>
2. Create a vagrant machine of ubuntu/trusty64 (Ubuntu 14.04 lightweight) </br>
3. You should have the data folder synced with the vagrant machine. You could use our [Vagrantfile](upload the Vagrantfile) for this. </br>
4. You need below environment variables, which you will have to place in [environment_setup.sh](link to file)
    * SLACKTOKEN
    * GITTOKEN
    * CIBOTCID (this is your slack bot client id)
    * CIBOTCSEC (this is your slack bot cleint secret key) </br>
5. You also need your _AWS ACCESS ID_ and _AWS SECRET KEY_, with the private key to ssh into AWS EC2 instance. Name the private key file as **se\_slack\_key.pem**, change the permission of the key file to 600 and place it in /home/vagrant/keys/ directory.</br>

<hr>

#### Instructions to Run our deployment script
**Step 1:** ssh into the newly created vagrant machine </br>

**Step 2:** Install ansible into the vagrant machine, you can use below commands for the same </br>
```bash
ansible-box> $ sudo apt-add-repository ppa:ansible/ansible
ansible-box> $ sudo apt-get update
ansible-box> $ sudo apt-get install ansible
```

**Step 3:** You can clone the repo into the sync folder and switch to _milestone3_ branch. </br>
```bash
$ git clone https://github.ncsu.edu/ssrivas8/CSC510Project.git
$ cd CSC510Project
$ git checkout milestone3
```

**Step 4:** Create an empty inventory file, which will be populated automatically once AWS EC2 instance is created.
```bash
$ cd deployment
$ touch inventory
```

**Step 5:** Run the following command to start the automation and deploy our bot.js to the server
```bash
$ ansible-playbook -i inventory aws.yml -s 
```
