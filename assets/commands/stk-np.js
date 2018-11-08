/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.API_TOKEN);

module.exports = {
	name: 'np',
	usage: '<no have parameters>',
	aliases: ['current', 'now'],
	guildOnly: true,
	description: 'Get stalker bot current song',
	execute(message, _args, _client, options) {
		let Songs = options.songQ.get(message.guild.id);
		let currentQueue = (Songs !== undefined && Songs !== null) ? Songs.Queue[0] : null;
		if (currentQueue !== null) {
			youtube.searchVideos(currentQueue.url, 1)
				.then(results => {
					const ytEmbed = new Discord.RichEmbed()
						.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
						.setImage(results[0].thumbnails.high.url)
						.setColor('#7f1515')
						.setTitle('Now Playing')
						.addField('Title', `** [${results[0].title}](https://youtu.be/${results[0].id}) **`, false)
						.addField('Channel', results[0].channel.title, true)
						.addField('Requested by', `<@${currentQueue.requestby}>`, true)
						.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
					message.channel.send(ytEmbed);
				}).catch(err => {
					console.log(err);
				});
		}
		else {
			message.channel.send('**Nothing is playing at this time, please use `(prefix) play (song)` to play a song :x:**');
		}
	},
};
