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
		if(!Status.Playing)Status.Playing = false;
		let stSong = options.songStatus.get(message.guild.id) || {};

		if(!stSong.Paused)stSong.Paused = false;
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
		Status.Playing = false;
		stSong.Paused = false;
		options.isplay.set(message.guild.id, Status);
		options.songQ.delete(message.guild.id);
		options.songStatus.set(message.guild.id, stSong);
		voiceChannel.leave();

		message.channel.send('**Disconnected, and cleared the queue** :thumbsup:');
		console.log(`result of leave: ${Object.values(options.isplay.get(message.guild.id))}`);

	},
};