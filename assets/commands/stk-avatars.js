/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');

module.exports = {
	name: 'avatar',
	usage: '<Tag Users>',
	aliases: ['avatars', 'img'],
	guildOnly: true,
	description: 'Get your or other server members avatar',
	execute(message, _args) {

		if (!message.mentions.users.size) {
			const EmbedAvatar = new Discord.RichEmbed()
				.setColor('#467ac9')
				.setAuthor('Stalker Avatars', 'https://i.imgur.com/iTZPeAr.png')
				.setTitle(' ** Your Awesome Current Avatar!! **')
				.addField(':arrow_down: **Download here :D** :arrow_down:', `[Download!!](${message.author.displayAvatarURL})`, true)
				.setImage(`${message.author.displayAvatarURL}`)
				.setTimestamp()
				.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');

			message.channel.send(EmbedAvatar);
		}
		else {
			const avatarList = message.mentions.users.map(user => {
				const EmbedAvatars = new Discord.RichEmbed()
					.setColor('#467ac9')
					.setAuthor('Stalker Avatars', 'https://i.imgur.com/iTZPeAr.png')
					.setTitle(` ** ${user.username}'s Awesome Current Avatar!! **`)
					.addField('Requested By: ', `${message.author}`, true)
					.addField(':arrow_down: **Download here :D** :arrow_down:', `[Download!!](${user.displayAvatarURL})`, true)
					.setImage(`${user.displayAvatarURL}`)
					.setTimestamp()
					.setFooter('Powered by Stalker bot', 'https://i.imgur.com/Xr28Jxy.png');
				return EmbedAvatars;
			});

			avatarList.forEach(avatarEmbed => {
				message.channel.send(avatarEmbed);
			});
		}

	},
};
