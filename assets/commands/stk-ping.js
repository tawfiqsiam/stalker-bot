/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');

module.exports = {
	name: 'ping',
	category: 'Essentials',
	usage: '<no have parameters>',
	aliases: ['delay', 'time'],
	cooldown: 15,
	guildOnly: true,
	description: 'Get stalker bot response time',
	async execute(message, _args, client) {
		const msg = await message.channel.send('ping?');
		const EmbedPing = new Discord.RichEmbed()
			.setColor('#8cba21')
			.setAuthor('Stalker Pinger', 'https://i.imgur.com/iTZPeAr.png')
			.setTitle('*** Current Stalker bot ping ***')
			.addField('__**Current Lantency**__', `\`Pong ➤ ${msg.createdTimestamp - message.createdTimestamp}ms\` :hourglass:`, true)
			.addField('__**Api Latency**__', `\`API ➤ ${Math.round(client.ping)}ms\` :stopwatch:`)
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/iTZPeAr.png');
		msg.edit(EmbedPing);

	},
};
