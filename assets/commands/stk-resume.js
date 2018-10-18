/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const play = require('./stk-play');

module.exports = {
	name: 'resume',
	usage: '<no have parameters>',
	aliases: ['r', 'continue'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args) {

		const { voiceChannel } = message.member;
		voiceChannel.connection.dispatcher.resume();
	},
};