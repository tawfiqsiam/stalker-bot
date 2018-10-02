// Main Bot File

// Dev Dependencies
require('dotenv').config();

// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will trigger whenever your bot:
// - finishes logging in
// - reconnects after disconnecting
client.on('ready', () => {
	console.log('Ready for Stalk!!');
});

client.on('message', message => {
	console.log(message.content);
});

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);