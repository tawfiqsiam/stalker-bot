/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.API_TOKEN);
const queue = [];
let playing = false;

module.exports = {
	name: 'play',
	usage: '<no have parameters>',
	aliases: ['delay', 'time'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args) {
		const { voiceChannel } = message.member;
		const rgex = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;
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
						.setAuthor(`YouTube search result for ${_args}`.split(',').join(' '))
						.setThumbnail(results[0].thumbnails.high.url)
						.setColor('#ffc1cc')
						.addField('Title', results[0].title, true)
						.addField('Channel', results[0].channel.title, true)
						.addField('Description', results[0].description)
						.addField('Link', `https://youtu.be/${results[0].id}`);

					message.channel.send(ytEmbed);
					console.log('Normal:' + playing);
					if(playing) {addToQueue(results, message);}
					else{
						addToQueue(results, message);
						play(queue, voiceChannel);
					}


				})
				.catch(console.log);
		}
		else {
			youtube.getPlaylist(_args[0])
				.then(playlist => {
					console.log(`The playlist's title is ${playlist.title}`);
					playlist.getVideos()
						.then(videos => {
							console.log(`This playlist has ${videos.length === 50 ? '50+' : videos.length} videos.`);
							console.log('Url:' + playing);
							if(playing) {addToQueue(videos, message);}
							else{
								addToQueue(videos, message);
								play(queue, voiceChannel);
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
	_videos.forEach(video => {
		queue.push({ 'url':`https://www.youtube.com/watch?v=${video.id}`, 'requestby': _message.author });
		_message.channel.send(`Added ${video.title} to the queue in position ${queue.length}`);
	});
}


function play(_queue, _voiceChannel) {
	const currentplay = queue[0];
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
