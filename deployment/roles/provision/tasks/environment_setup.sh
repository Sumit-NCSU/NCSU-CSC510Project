#!/bin/bash

echo "export SLACKTOKEN="YOUR_SLACKTOKEN_GOES_HERE"" >> /etc/environment
echo "export CIBOTCID="YOUR_BOT_CLIENT_ID_GOES_HERE"" >> /etc/environment
echo "export CIBOTCSEC="YOUR_BOT_CLIENT_SECRET_GOES_HERE"" >> /etc/environment
echo "export GITTOKEN="YOUR_GITTOKEN_GOES_HERE"" >> /etc/environment
echo "export WIT="YOUR_WIT_AI_TOKEN"" >> /etc/environment

source ~/.bashrc