/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.API_TOKEN);

module.exports = {
	name: 'play',
	usage: '<video name | video/playlist url>',
	aliases: ['search', 'music'],
	guildOnly: true,
	description: 'Play music from  youtube by stalker bot',
	execute(message, _args, _client, options) {
		process.setMaxListeners(0);
		let Songs = options.songQ.get(message.guild.id) || {};
		let Status = options.isplay.get(message.guild.id) || {};
		if(!Songs.Queue)Songs.Queue = [];
		if(!Status.Playing)Status.Playing = [];
		Status.Playing.push({ 'playing':false });
		const { voiceChannel } = message.member;
		const rgex = /^https?:\/\/(youtube.com)\/playlist(.*)$/;
		if (!rgex.exec(`${_args}`.split(',').join(' '))) {
			youtube.searchVideos(_args, 1)
				.then(results => {
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
					const ytEmbed = new Discord.RichEmbed()
						.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
						.setThumbnail(results[0].thumbnails.high.url)
						.setColor('#7f1515')
						.addField('Title', results[0].title, true)
						.addField('Channel', results[0].channel.title, true)
						.addField('Queue Position', `**${Songs.Queue.length + 1}**`, true)
						.addField('Link', `https://youtu.be/${results[0].id}`)
						.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
					if(Status.Playing[0].playing) {
						console.log('first:' + Status.Playing[0]);
						addToQueue(results);
					}
					else{
						console.log('second:' + Status.Playing[0]);
						addToQueue(results);
						play();
					}
					message.channel.send(ytEmbed);
				})
				.catch(console.log);
		}
		else {
			youtube.getPlaylist(_args[0])
				.then(playlist => {
					const ytEmbed = new Discord.RichEmbed()
						.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
						.setColor('#7f1515')
						.addField('Requested playlist: ', `${playlist.title} :notes:`, true)
						.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
					message.channel.send(ytEmbed);
					playlist.getVideos()
						.then(videos => {
							if(Status.Playing[0].playing) {
								addToQueue(videos);
								console.log('firts2:' + Status.Playing[0].playing);
							}
							else{
								addToQueue(videos);
								play();
								console.log('second2:' + Status.Playing[0].playing);
							}
						})
						.catch(console.log);
				})
				.catch(console.log);
		}
		process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

		function addToQueue(_videos) {
			const ytEmbed = new Discord.RichEmbed()
				.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
				.setColor('#7f1515')
				.addField(':white_check_mark: Added: ', `**${Songs.Queue.length + 1}** songs are in the queue :notes: :notes:`, true)
				.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
			Status.Playing.push({ 'playing':true });
			_videos.forEach(video => {
				Songs.Queue.push({ 'url':`https://www.youtube.com/watch?v=${video.id}`, 'requestby': message.author.tag });
				options.songQ.set(message.guild.id, Songs);
			});
			message.channel.send(ytEmbed);
		}


		function play() {
			const currentplay = Songs.Queue[0];
			voiceChannel.join().then(connection => {
				if(Status.Playing[0].playing == false) {
					Status.Playing.push({ 'playing':true });
					Status.Playing.shift();
					options.isplay.set(message.guild.id, Status);
					console.log('After Start:' + Status.Playing[0]);
				}
				const stream = ytdl(currentplay.url, { filter: 'audioonly' });
				const dispatcher = connection.playStream(stream);
				Songs.Queue.shift();
				dispatcher.on('end', () => {
					if(Songs.Queue.length > 0) {
						play();
						Status.Playing.push({ 'playing':true });
						Status.Playing.shift();
						options.isplay.set(message.guild.id, Status);
						console.log('third:' + Status.Playing[0]);
					}
					else{
						Status.Playing.push({ 'playing':false });
						Status.Playing.shift();
						options.isplay.set(message.guild.id, Status);
						voiceChannel.leave();
						options.songQ.delete(message.guild.id);
					}
				});
			});
		}
	},
};

