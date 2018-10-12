/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'ping',
	usage: '<no have parameters>',
	aliases: ['delay', 'time'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args) {

		/** const EmbedPing = new Discord.RichEmbed()
			.setColor('#8cba21')
			.setAuthor('Stalker Pinger', 'https://i.imgur.com/iTZPeAr.png')
			.setTitle('*** Current Stalker bot ping ***');
			*/

		// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
		// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
		async function sendPing() {
			const m = await message.channel.send('Ping?');
			m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.pings)}ms`);
		}

		sendPing();

	},
};