/* eslint no-unused-vars: "off" */

module.exports = {
	name: 'leave',
	usage: '<no have parameters>',
	aliases: ['quit', 'exit'],
	guildOnly: true,
	description: 'Disconnects the bot from voice channel and clear the queue music',
	execute(message, _args, _client, options) {

		const { voiceChannel } = message.member;
		let Status = options.isplay.get(message.guild.id) || {};
		let stSong = options.songStatus.get(message.guild.id) || {};

		if (!voiceChannel) {
			return message.reply('please join a voice channel first!');
		}
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (Status.Playing == true || !Status.Playing) Status.Playing = false;
		if (stSong.Paused == true || !stSong.Paused) stSong.Paused = false;
		options.isplay.set(message.guild.id, Status);
		options.songStatus.set(message.guild.id, stSong);
		options.songQ.delete(message.guild.id);
		voiceChannel.leave();
		message.channel.send('**Disconnected, and cleared the queue** :thumbsup:');
	},
};
