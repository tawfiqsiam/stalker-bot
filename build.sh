#!/bin/bash
echo "Welcome to Stalker Bot Dev Space Setup >>>"
echo "You will Need Node Js and root to work, If you don't have it we will setup for you"
if [ "$EUID" -ne 0 ] 
then 
	echo "Please run this script as root"
	 	echo "Exiting ...."
		sleep 2 
	exit
fi

if [[ -e ./.env ]]; 
then
	echo "You have already env dev installation, exiting ..."
	sleep 2 
else

	echo "1° Step: Local Token Setup >>>"
	echo "Please, Enter your Discord Bot Token >>>"
	read tin 
		if [[ -z "$tin" ]]; 
		then
		  echo "You have not entered any token, it will be left empty"
		  touch .env && echo "BOT_TOKEN=PUT YOUR BOT TOKEN HERE" >> .env
		  echo ".env File with empty bot token created" 
		else
		  touch .env && echo "BOT_TOKEN=$tin" >> .env 
		  echo ".env File With your token created"
		fi

		if which node > /dev/null 
		then
			echo "node is installed, skipping install..."
			echo "2° Step: Installing Node Dependencies >>>"
			npm install
			echo "All node dependencies installed >> You can start your bot with npm start"
		else
			echo "node is not installed, Installing NVM..."
			if [[ ! -e ~/.zshrc ]]; 
			then
				wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -P ~ | bash
				echo "NVM Installed"
				source ~/.profile
				echo "Installing Node Using NVM"
				nvm install 8.12.0
				echo "2° Step: Installing Node Dependencies >>>"
                npm wincheck
                sleep 5
                echo "=/=/=/=============================/=/=/="
				npm install
				echo "All node dependencies installed >> You can start your bot with npm start"
			else
				echo "Warning You're using ZSH Shell, It is recommended to use Oh My ZSH and the following plugin >>>"
				echo "https://github.com/lukechilds/zsh-nvm"
				echo "Skipping NVM Installation, You'll need install NVM and node manually"	
			fi
			
		fi

	echo "Finishing ...."
	sleep 2 

fi