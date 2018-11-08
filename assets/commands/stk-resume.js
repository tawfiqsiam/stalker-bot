/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const play = require('./stk-play');

module.exports = {
	name: 'resume',
	usage: '<no have parameters>',
	aliases: ['r', 'continue'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args, _client, options) {

		const { voiceChannel } = message.member;
		const actionEmbed = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Status__**', '** Resuming  :play_pause:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
		const actionError = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Error__**', '** The bot is not paused, use play or pause instead  :x:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
		let stSong = options.songStatus.get(message.guild.id) || {};
		if (!stSong.Paused) stSong.Paused = false;
		if (stSong.Paused == true) {
			if (voiceChannel.connection !== null) {
				voiceChannel.connection.dispatcher.resume();
				message.channel.send(actionEmbed);
				stSong.Paused = false;
			}
			else {
				message.channel.send('** Nothing is playing, use `(prefix) play` first** :x:');
			}
		}
		else {
			message.channel.send(actionError);
		}
		options.songStatus.set(message.guild.id, stSong);
	},
};
