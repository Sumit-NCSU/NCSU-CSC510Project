## Deployment 

#### Requirements
1. Your host machine should have vagrant and virtualbox installed </br>
2. Create a vagrant machine of ubuntu/trusty64 (Ubuntu 14.04 lightweight) </br>
3. You should have the data folder synced with the vagrant machine. You could use our [Vagrantfile](upload the Vagrantfile) for this. </br>
4. You need below environment variables, which you will have to place in [environment_setup.sh](link to file)
    * SLACKTOKEN
    * GITTOKEN
    * CIBOTCID (this is your slack bot client id)
    * CIBOTCSEC (this is your slack bot cleint secret key) </br>
5. You also need your AWS ACCESS ID and AWS SECRET KEY, with the private key to ssh into AWS EC2 instance. Name the private key file as *se\_slack\_key.pem*, change the permission to 600 and place it in /home/vagrant/keys/ directory.</br>
