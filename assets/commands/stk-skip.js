/* eslint no-unused-vars: "off" */
module.exports = {
	name: 'resume',
	usage: '<no have parameters>',
	aliases: ['rs', 'continue'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args) {

		const { voiceChannel } = message.member;
		voiceChannel.connection.dispatcher.end();
	},
};