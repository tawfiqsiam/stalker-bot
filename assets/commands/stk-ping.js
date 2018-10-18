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

		const EmbedPing = new Discord.RichEmbed()
			.setColor('#8cba21')
			.setAuthor('Stalker Pinger', 'https://i.imgur.com/iTZPeAr.png')
			.setTitle('*** Current Stalker bot ping ***')
			.addField('__**Current Lantency**__', `\`Pong > ${message.createdTimestamp - message.createdTimestamp}ms\` :hourglass:`, true)
			.addField('__**Api Latency**__', `\`API > ${Math.round(client.pings)}ms\` :stopwatch:`)
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/iTZPeAr.png');

		message.channel.send(EmbedPing);

	},
};