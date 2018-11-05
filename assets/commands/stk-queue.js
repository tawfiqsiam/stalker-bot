/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');


module.exports = {
	name: 'queue',
	usage: '<tab number | empty for first tab>',
	aliases: ['q', 'list'],
	guildOnly: true,
	description: 'Shows current songs queue for stalker bot',
	async execute(message, _args, _client, options) {
		let Songs = options.songQ.get(message.guild.id);
		let currentQueue = (Songs !== undefined && Songs !== null) ? Songs.Queue : null;
		let tabSelection = (_args[0] == undefined || _args == null) ? 1 : _args[0];
		if(currentQueue !== null) {
			let queueChunked = chunk(currentQueue, 10);
			if (tabSelection != 0) {
				if(tabSelection <= queueChunked.length) {
					const msg = (_args[1] == null || _args[1] == undefined) ? await message.channel.send('`Searching Music Queue ...`') : message;
					let queueEmbed = new Discord.RichEmbed()
						.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
						.setColor('#7f1515');
					const elements = queueChunked[tabSelection - 1];
					const currentElement = queueChunked[0];
					for (let indexElements = 0; indexElements < elements.length; indexElements++) {
						const song = elements[indexElements];
						const currentSong = currentElement[0];
						queueEmbed.setTitle('Current Music Queue');
						if(indexElements == 0) {
							queueEmbed.addField('**Now Playing**', `** [${currentSong.songName}](${currentSong.url}) | Requested by: <@${currentSong.requestby}>  **`, false)
								.addBlankField(true)
								.addField('** :arrow_down: == Up Next == :arrow_down:**', `${elements.length - 1} Songs`, false);
						}
						else {
							queueEmbed.addField(`${indexElements}.`, `** [${song.songName}](${song.url}) | Requested by: <@${song.requestby}> **`, true)
								.setTimestamp()
								.setFooter(`Tab ${tabSelection} / ${queueChunked.length} Powered by Stalker Music`, 'https://i.imgur.com/Xr28Jxy.png');
						}
					}

					msg.edit(queueEmbed);

					if(queueChunked.length > 1) {
						if(_args[1])await msg.clearReactions();
						if(tabSelection > 1 != false)await msg.react('◀');
						if(tabSelection < queueChunked.length != false)await msg.react('▶');

						const filter = (reaction, user) => {
							return ['◀', '▶'].includes(reaction.emoji.name) && user.id !== _client.user.id;
						};

						const collector = msg.createReactionCollector(filter, { time: 120000 });

						collector.on('collect', (reaction, reactionCollector) => {

							const command = _client.commands.get('queue');
							if (reaction.emoji.name == '◀') {
								let newSelection = (tabSelection > 1) ? (tabSelection - 1) : null;
								command.execute(msg, [newSelection, true], _client, options);
							}
							else if(reaction.emoji.name == '▶') {
								let newSelection = (tabSelection < queueChunked.length) ? (tabSelection + 1) : null;
								command.execute(msg, [newSelection, true], _client, options);
							}
						});

						collector.on('end', collected => {
							msg.clearReactions();
						});
					}
				}
				else{
					message.channel.send('**This tab number doesn\'t exist :x:**');
				}
			}
			else{
				message.channel.send('**You can search for tab 0 :x:**');
			}
		}
		else{
			message.channel.send('**Nothing is playing at this time, please use play (song) to play a song :x:**');
		}

		function chunk(array, size) {
			const chunked_arr = [];
			let index = 0;
			while (index < array.length) {
				chunked_arr.push(array.slice(index, size + index));
				index += size;
			}
			return chunked_arr;
		}
	},
};