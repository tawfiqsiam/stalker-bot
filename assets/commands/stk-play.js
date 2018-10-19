/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.API_TOKEN);
const queue = [];
let playing = false;

module.exports = {
	name: 'play',
	usage: '<video name | video/playlist url>',
	aliases: ['search', 'music'],
	guildOnly: true,
	description: 'Play music from  youtube by stalker bot',
	execute(message, _args) {
		process.setMaxListeners(0);
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
						.addField('Queue Position', `**${queue.length + 1}**`, true)
						.addField('Link', `https://youtu.be/${results[0].id}`)
						.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
					if(playing) {addToQueue(results, message);}
					else{
						addToQueue(results, message);
						play(message.guild.queue, voiceChannel, message);
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
							if(playing) {addToQueue(videos, message);}
							else{
								addToQueue(videos, message, message);
								play(message.guild.queue, voiceChannel, message);
							}
						})
						.catch(console.log);
				})
				.catch(console.log);
		}
		process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

	},
};
function addToQueue(_videos, _message) {
	const ytEmbed = new Discord.RichEmbed()
		.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
		.setColor('#7f1515')
		.addField(':white_check_mark: Added: ', `**${queue.length + 1}** songs are in the queue :notes: :notes:`, true)
		.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
	_videos.forEach(video => {
		queue.push({ 'url':`https://www.youtube.com/watch?v=${video.id}`, 'requestby': _message.author });
		_message.guild.queue = queue;
		console.log('add' + _message.guild.queue);
	});
	_message.channel.send(ytEmbed);
}


function play(_queue, _voiceChannel, _message) {
	console.log('play' + _message.guild.queue);
	_message.guild.queue = queue;
	const currentplay = _queue[0];
	_voiceChannel.join().then(connection => {
		playing = true;
		const stream = ytdl(currentplay.url, { filter: 'audioonly' });
		const dispatcher = connection.playStream(stream);
		queue.shift();
		dispatcher.on('end', () => {
			if(queue.length > 0) {
				play(_queue, _voiceChannel);
				playing = true;
			}
			else{
				playing = false;
				_voiceChannel.leave();
			}
		});
	});
}
