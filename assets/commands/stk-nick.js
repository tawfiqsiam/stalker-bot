module.exports = {
	name: 'nick',
	description: 'Change Stalker bot nickname!',
	guildOnly: true,
	args: true,
	usage: '<New Bot Nickname>',
	aliases: ['newn', 'name'],
	execute(message, _args, client) {
		if (!_args.length) {
			return message.channel.send(`*** You didn't provide a nickname, ${message.author}! ***`);
		}
		else if (_args.length > 1) {
			let newNick = _args.join(' ');
			message.guild.members.get(client.user.id).setNickname(newNick);
			console.log('Changed Nickname to: ' + newNick + ' ,into server: ' + message.guild.name + ' ID: ' + message.guild.id);
			return message.channel.send(`*** My New nick is: ${newNick} ***`);
		}
		else {
			message.guild.members.get(client.user.id).setNickname(_args[0]);
			console.log('Changed Nickname to: ' + _args[0] + ' ,into server: ' + message.guild.name + ' ID: ' + message.guild.id);
			return message.channel.send(`*** My New nick is: ${_args[0]}  ***`);
		}
	},
};
