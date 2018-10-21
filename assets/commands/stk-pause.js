/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const play = require('./stk-play');

module.exports = {
	name: 'pause',
	usage: '<no have parameters>',
	aliases: ['p', 'wait'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args, _client, options) {

		const { voiceChannel } = message.member;
		const actionEmbed = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Status__**', '** Paused  :pause_button:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
		const actionError = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Error__**', '** The bot is already paused, use resume instead  :x:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
		let stSong = options.songStatus.get(message.guild.id) || {};
		if(!stSong.Paused)stSong.Paused = false;
		if(stSong.Paused == false) {
			voiceChannel.connection.dispatcher.pause();
			message.channel.send(actionEmbed);
			stSong.Paused = true;
		}
		else{
			message.channel.send(actionError);
		}
		options.songStatus.set(message.guild.id, stSong);
	},
};