/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');
module.exports = {
	name: 'eval',
	category: 'dev-only',
	usage: '<JS Instruction>',
	aliases: ['e', 'ev'],
	guildOnly: true,
	description: 'Evaluate a JavaScript Instruction',
	async execute(message, _args, client, options) {

		let NotDev = new Discord.RichEmbed()
			.setColor('GREEN')
			.setTitle('Evaluation')
			.setDescription('Sorry, the `eval` command can only be executed by the Developer.')
			.setTimestamp();

		if (!['216403723818106880', '183790855813988353'].includes(message.author.id)) return message.channel.send(NotDev);
		function clean(text) {
			if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
			else {return text;}
		} try {
			let code = _args.join(' ');
			if (_args.length == 0) return message.channel.send('You need to provide a code!');
			if(_args[0].toLowerCase() == 'async') code = `(async function(){\n${code.slice(5)}\n})(client, message, args)`;
			let evaled = await eval(code);
			let rawEvaled = evaled;
			if (typeof evaled !== 'string') {
				evaled = require('util').inspect(evaled, {
					'depth': 0,
				});
			}

			// The Embed for the result of the EVAl
			let EvalResult = new Discord.RichEmbed()
				.setColor('GREEN')
				.setTitle(`Evaluated in ${Math.round(client.ping)}ms`)
				.addField(':inbox_tray: Input', `\`\`\`js\n${code}\n\`\`\``)
				.addField(':outbox_tray: Output', `\`\`\`js\n${clean(evaled).replace(client.token, 'nein')}\n\`\`\``)
				.addField('Type', `\`\`\`xl\n${(typeof rawEvaled).substr(0, 1).toUpperCase() + (typeof rawEvaled).substr(1)}\n\`\`\``)
				.setTimestamp();

			message.channel.send(EvalResult);
		}
		catch (err) {
			message.channel.send(`\`We seem to have encountered an error:\n\` \`\`\`js\n${clean(err)}\n\`\`\``);
		}
	},
};
