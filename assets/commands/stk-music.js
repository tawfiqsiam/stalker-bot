/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.API_TOKEN);

module.exports = {
	name: 'play',
	usage: '<no have parameters>',
	aliases: ['delay', 'time'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args) {

		const { voiceChannel } = message.member;
		youtube.searchVideos(_args, 1)
			.then(results => {
				if (!voiceChannel) {
					return message.reply('please join a voice channel first!');
				}

				const ytEmbed = new Discord.RichEmbed()
					.setAuthor(`YouTube search result for ${_args}`.split(',').join(' '))
					.setThumbnail(results[0].thumbnails.high.url)
					.setColor('#ffc1cc')
					.addField('Title', results[0].title, true)
					.addField('Channel', results[0].channel.title, true)
					.addField('Description', results[0].description)
					.addField('Link', `https://youtu.be/${results[0].id}`);

				message.channel.send(ytEmbed);

				voiceChannel.join().then(connection => {
					const stream = ytdl(`https://www.youtube.com/watch?v=${results[0].id}`, { filter: 'audioonly' });
					const dispatcher = connection.playStream(stream);

					dispatcher.on('end', () => voiceChannel.leave());
				});
			})
			.catch(console.log);
		process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));


	},
};
