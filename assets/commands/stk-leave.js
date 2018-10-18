/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');
const play = require('./stk-play');

module.exports = {
	name: 'leave',
	usage: '<no have parameters>',
	aliases: ['quit', 'exit'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args) {

		const { voiceChannel } = message.member;
		voiceChannel.leave();
	},
};