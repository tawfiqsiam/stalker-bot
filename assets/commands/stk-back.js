/* eslint no-unused-vars: "off" */

const Discord = require('discord.js')
;module.exports = {
	name: 'back',
	category: 'Music',
	usage: '<without parameters>',
	aliases: ['prev', 'rwd', 'pv'],
	guildOnly: true,
	cooldown: 2,
	args: false,
	description: 'Go back to previous songs in the queue by stalker rbot',
	async execute(message, _args, _client, options) {
		const { voiceChannel } = message.member;
		let Songs = options.songQ.get(message.guild.id) || {};
		let BackSongs = options.backQ.get(message.guild.id) || {};
		let stSong = options.songStatus.get(message.guild.id) || {};

		if (!stSong.Paused) stSong.Paused = false;

		if (!Songs.Queue) Songs.Queue = [];
		if (!BackSongs.Queue) BackSongs.Queue = [];

		if (!voiceChannel) {
			return message.reply('please join a voice channel first!');
		}

		const actionEmbed = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Status__**', '** Backed  :rewind:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');

		const actionError = new Discord.RichEmbed()
			.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
			.setColor('#7f1515')
			.addField('**__Song Error__**', '** The bot is currently paused, please use `(prefix) resume` and after use `(prefix) skip` :x:**', true)
			.setTimestamp()
			.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
		let selected = _args[0] < 5 && _args[0] >= 1 ? _args[0] : 1 || 1;
		let backSongsQueue = BackSongs.Queue;
		let currentQueue = Songs.Queue;
		// console.log(`Back Queue: ${JSON.stringify(backSongsQueue)}`);
		if (stSong.Paused == false) {
			if (voiceChannel.connection !== null) {
				let ms = await message.channel.send('`Searching Music Queue ...`');
				let queueEmbed = new Discord.RichEmbed()
					.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
					.setColor('#7f1515');
				let elements = BackSongs.Queue;
				for (let indexElements = 0; indexElements < elements.length; indexElements++) {
					const song = elements[indexElements];
					queueEmbed.setTitle('Current Back Music Queue')
						.addField(`${indexElements + 1}.`, `** [${song.songName}](${song.url}) | Requested by: <@${song.requestby}> **`, true)
						.setTimestamp()
						.setFooter('Back List Powered by Stalker Music', 'https://i.imgur.com/Xr28Jxy.png');
				}

				await ms.edit(queueEmbed);

				const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 15000 });
				collector.on('collect', mess => {
					console.log(`Collected ${mess}`);
					if(parseInt(mess) <= 5 && parseInt(mess) > 0) {
						BackSongs = options.backQ.get(mess.guild.id) || {};
						Songs = options.songQ.get(mess.guild.id) || {};
						Songs.Queue.splice(1, 0, BackSongs.Queue[parseInt(mess) - 1], Songs.Queue[0]);
						options.songStatus.set(mess.guild.id, stSong);
						options.songQ.set(mess.guild.id, Songs);
						voiceChannel.connection.dispatcher.end();
						message.channel.send(actionEmbed);
						stSong.Paused = false;
					}
					else {
						collector.stop();
						return mess.reply('** Please Choose a number between 1 and 5 ... **');
					}
				});

				collector.on('end', mess => {
					mess.channel.send('** The time of choice for previous, to finished, if you want you can use the command again .. **')
				});
			}
			else {
				message.channel.send('** Nothing is playing, please use `(prefix) play (song)`** :x:');
			}
		}
		else {
			message.channel.send(actionError);
		}
		options.songStatus.set(message.guild.id, stSong);


	},
};