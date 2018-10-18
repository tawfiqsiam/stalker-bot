/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const play = require('./stk-play');

module.exports = {
	name: 'pause',
	usage: '<no have parameters>',
	aliases: ['p', 'wait'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args) {

		const { voiceChannel } = message.member;
		voiceChannel.connection.dispatcher.pause();
	},
};