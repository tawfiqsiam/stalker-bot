/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');

module.exports = {
	name: 'join',
	usage: '<no have parameters>',
	aliases: ['enter', 'in'],
	guildOnly: true,
	description: 'Get stalker music into your current voice channel',
	execute(message, _args) {

		const { voiceChannel } = message.member;
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}
		message.channel.send(`**Joined to ${voiceChannel.name} and Ready to play** :thumbsup:`);
		voiceChannel.join();
	},
};