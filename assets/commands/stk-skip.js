/* eslint no-unused-vars: "off" */
module.exports = {
	name: 'skip',
	usage: '<no have parameters>',
	aliases: ['next', 'jump'],
	guildOnly: true,
	description: 'Skip the current song',
	execute(message, _args) {

		const { voiceChannel } = message.member;
		voiceChannel.connection.dispatcher.end();
	},
};