/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
module.exports = {
	name: 'skip',
	usage: '<no have parameters>',
	aliases: ['next', 'jump'],
	guildOnly: true,
	description: 'Skip the current song',
	execute(message, _args, _client, options) {

		const { voiceChannel } = message.member;
		let stSong = options.songStatus.get(message.guild.id) || {};
		if (!stSong.Paused) stSong.Paused = false;

		const actionEmbed = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Status__**', '** Skkiped  :fast_forward:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');

		const actionError = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Error__**', '** The bot is currently paused, please use resume and after use skip :x:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
		if (stSong.Paused == false) {
			if (voiceChannel.connection !== null) {
				voiceChannel.connection.dispatcher.end();
				message.channel.send(actionEmbed);
				stSong.Paused = false;
			}
			else {
				message.channel.send('** Nothing is playing, please use play (song)** :x:');
			}
		}
		else {
			message.channel.send(actionError);
		}
		options.songStatus.set(message.guild.id, stSong);
	},
};
