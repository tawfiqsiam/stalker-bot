/* eslint no-unused-vars: "off" */

module.exports = {
	name: 'clear',
	usage: '<without parameters>',
	aliases: ['cl', 'erase', 'restore'],
	guildOnly: true,
	description: 'Clear the current music queue of stalker bot',
	execute(message, _args, _client, options) {
		const { voiceChannel } = message.member;
		if (!voiceChannel) {
			return message.reply('Please join a voice channel first!');
		}
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if(options.songQ.get(message.guild.id) != null) {
			let Songs = options.songQ.get(message.guild.id);
			Songs.Queue.length = 1;
			options.songQ.set(message.guild.id, Songs);
			message.channel.send('**Cleared the queue** :thumbsup:');
		}
		else{
			message.channel.send('**I can\'t clear the music queue, if the music queue is empty** :x:');
		}
	},
};