/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const urlCheck = require('is-playlist');
const youtube = new YouTube(process.env.API_TOKEN);

module.exports = {
	name: 'play',
	usage: '<video name | video/playlist url>',
	aliases: ['search', 'music'],
	guildOnly: true,
	args: true,
	description: 'Play music from  youtube by stalker bot',
	execute(message, _args, _client, options) {
		process.setMaxListeners(0);
		let Songs = options.songQ.get(message.guild.id) || {};
		let Status = options.isplay.get(message.guild.id) || {};
		let isPlaylist = false;
		if(!Songs.Queue)Songs.Queue = [];
		if(!Status.Playing)Status.Playing = false;
		options.isplay.set(message.guild.id, Status);
		const { voiceChannel } = message.member;
		if (urlCheck(`${_args}`.split(',').join(' ')) == false) {
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
						.setColor('#7f1515')
						.addField('Title', `** [${results[0].title}](https://youtu.be/${results[0].id}) **`, false)
						.addField('Channel', results[0].channel.title, true)
						.addField('Queue Position', `**${Songs.Queue.length == 0 ? 'Now Playing' : Songs.Queue.length}**`, true)
						.setImage(results[0].thumbnails.high.url)
						.setTimestamp()
						.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
					if(Status.Playing == true) {
						addToQueue(results);
					}
					else{
						addToQueue(results);
						play();
					}
					message.channel.send(ytEmbed);
				})
				.catch(console.log);
		}
		else {
			isPlaylist = true;
			youtube.getPlaylist(_args[0])
				.then(playlist => {
					const ytEmbed = new Discord.RichEmbed()
						.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
						.setColor('#7f1515')
						.addField('Requested playlist: ', `** [${playlist.title}](${playlist.url}) ** :notes:`, false)
						.addField('Publish Date', `** ${playlist.publishedAt.getUTCFullYear()} **`, false)
						.addField('By', `** ${playlist.channel.title} **`)
						.setTimestamp()
						.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
					message.channel.send(ytEmbed);
					const playtitle = playlist.title;
					playlist.getVideos()
						.then(videos => {
							const playlen = videos.length;
							if(Status.Playing == true) {
								addToQueue(videos, playlen, playtitle);
							}
							else{
								addToQueue(videos, playlen, playtitle);
								play();
							}
						})
						.catch(console.log);
				})
				.catch(console.log);
		}
		process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

		function addToQueue(_videos, _plNumber, _plTitle) {
			const ytEmbed = new Discord.RichEmbed()
				.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
				.setColor('#7f1515')
				.addField(':white_check_mark: Added: ', `**${isPlaylist ? `${_plTitle} with ${_plNumber} ` : Songs.Queue.length + 1}** songs are now in the queue :notes: :notes:`, true)
				.setTimestamp()
				.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
			if(Status.Playing == false)Status.Playing = true;
			options.isplay.set(message.guild.id, Status);
			_videos.forEach(video => {
				Songs.Queue.push({ 'url':`https://www.youtube.com/watch?v=${video.id}`,
					'requestby': message.author.id,
					'songName': video.title,
				});
				options.songQ.set(message.guild.id, Songs);
			});
			message.channel.send(ytEmbed);
		}


		function play() {
			Songs = options.songQ.get(message.guild.id);
			let currentplay = (Songs !== undefined && Songs !== null) ? Songs.Queue[0] : null;
			voiceChannel.join().then(connection => {
				if(currentplay !== null) {
					let stream = ytdl(currentplay.url, { filter: 'audioonly' });
					let dispatcher = connection.playStream(stream);
					dispatcher.on('end', () => {
						Songs.Queue.shift();
						if (Songs.Queue.length > 0) {
							console.log('enter to queue next -->' + Songs.Queue.length);
							currentplay = Songs.Queue[0];
							play();
						}
						else {
							Status.Playing = false;
							options.isplay.set(message.guild.id, Status);
							options.songQ.delete(message.guild.id);
							message.channel.send(`** No more songs available, I will Leave the ${voiceChannel.name} channel in 15 seconds ** :stopwatch:`);
							setInterval(function() {
								voiceChannel.leave();
							}, 15000);
						}
					});
				}
			});
		}
	},
};

