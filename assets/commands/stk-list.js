/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');
const lodash = require('lodash');

module.exports = {
	name: 'list',
	category: 'Music',
	usage: '<tab number | empty for first tab>',
	aliases: ['q', 'queue', 'l'],
	guildOnly: true,
	description: 'Shows current songs queue for stalker bot',
	async execute(message, _args, _client, options) {
		let Songs = options.songQ.get(message.guild.id);
		let currentQueue = (Songs !== undefined && Songs !== null) ? Songs.Queue : null;
		let tabSelection = (_args[0] == undefined || _args == null) ? 1 : _args[0];
		if (currentQueue !== null) {
			let queueChunked = lodash.chunk(currentQueue, 5);
			if (tabSelection != 0) {
				if (tabSelection <= queueChunked.length) {
					const msg = (_args[1] == null || _args[1] == undefined) ? await message.channel.send('`Searching Music Queue ...`') : message;
					let queueEmbed = new Discord.RichEmbed()
						.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
						.setColor('#7f1515');
					const elements = queueChunked[tabSelection - 1];
					const currentSong = currentQueue[0];
					queueEmbed.addField('**Now Playing**', `** [${currentSong.songName}](${currentSong.url}) **`, false)
						.addField('** Requested by **', `<@${currentSong.requestby}>`, false);
					if(elements.length - 1 == 0) {
						queueEmbed.addField('**__:free: Nothing Incoming :free:__ **', 'The current queue its empty', false);
					}
					else{
						queueEmbed.addField('**__:arrow_down: Up Next :arrow_down:__ **', `${currentQueue.length - 1} Songs`, false);
					}
					console.log(elements.map(s => s.songName));
					for (let indexElements = 0; indexElements < elements.length; indexElements++) {
						const song = elements[indexElements];
						queueEmbed.setTitle('Current Music Queue');
						if(song.url != currentSong.url) {
							let songPos = lodash.findIndex(currentQueue, ['url', song.url], 1);
							queueEmbed.addField(`${songPos}.`, `** [${song.songName}](${song.url}) **`, true)
								.addField('** Requested by **', `<@${song.requestby}>`, false)
								.setTimestamp()
								.setFooter(`Tab ${tabSelection} / ${queueChunked.length} Powered by Stalker Music`, 'https://i.imgur.com/Xr28Jxy.png');
						}

					}

					let mess = await msg.edit(queueEmbed);
					let canForward = tabSelection < queueChunked.length;
					let canBackward = tabSelection > 1;
					if (queueChunked.length > 1) {
						console.log(`Queue Chunked size: ${queueChunked.length} and tab selection: ${tabSelection} and args: ${_args[1]}`);
						if(_args[1] != undefined && _args[1] == true) {
							await mess.clearReactions();
							if(canBackward) {
								try{
									await mess.react('◀');
									if(canForward) await mess.react('▶');
								}
								catch(err) {
									console.log(`Error Reacting ${err}`);
								}
							}
							else if(canForward) {
								try {
									await mess.react('▶');
								}
								catch (err) {
									console.log(`Error Reacting ${err}`);
								}
							}
						}
						else {
							try{
								if(canBackward)await mess.react('◀');
								if(canForward) await mess.react('▶');
							}
							catch(err) {
								console.log(`Error Reacting ${err}`);
							}
						}

						const filter = (reaction, user) => {
							return ['◀', '▶'].includes(reaction.emoji.name) && user.id !== _client.user.id;
						};

						const collector = mess.createReactionCollector(filter, { time: 60000 });

						collector.on('collect', (reaction) => {
							const command = _client.commands.get('list');
							if (reaction.emoji.name == '◀') {
								let newSelection = (canBackward) ? (tabSelection - 1) : null;
								console.log(`By backward new selection ${newSelection}`);
								collector.stop();
								command.execute(mess, [newSelection, true], _client, options);
							}
							else if (reaction.emoji.name == '▶') {
								let newSelection = (canForward) ? (tabSelection + 1) : null;
								console.log(`By forward new selection ${newSelection}`);
								collector.stop();
								command.execute(mess, [newSelection, true], _client, options);
							}
						});

						collector.on('end', collected => {
							mess.clearReactions().then(() => {
								console.log('triggered end');
							}).catch(err => {
								console.log(`Error Clearing Reactions | ${err} | Reactions collected on end ${collected}`);
							});
						});
					}
				}
				else {
					message.channel.send('**This tab number doesn\'t exist :x:**');
				}
			}
			else {
				message.channel.send('**You can search for tab 0 :x:**');
			}
		}
		else {
			message.channel.send('**Nothing is playing at this time, please use play (song) to play a song :x:**');
		}
	},
};