// Main Bot File

// Dev Dependencies
require('dotenv').config();
const fs = require('fs');

// require the discord.js module
const Discord = require('discord.js');
const queue = new Map();
const playing = new Map();
const Status = new Map();

// Stablish Default Bot Config Objects
const { prefix, server } = require('./assets/config/botcfg.json');

// create a new Discord client
const client = new Discord.Client();


// create a bot command / cooldowns Collection and File Record
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./assets/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./assets/commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will trigger whenever your bot:
// - finishes logging in
// - reconnects after disconnecting


client.on('ready', () => {
	let Activities = [`on ${client.guilds.size} servers`,
		`with ${client.users.size} users`,
		`${server}`,
		`prefix: ${prefix}`,
	];
	setInterval(function() {
		let activity = Activities[Math.floor(Math.random() * Activities.length)];
		client.user.setActivity(activity, { type: 'PLAYING' });
	}, 15000);
	console.log('Ready for Stalk!!');
});

client.on('message', async message => {
	let options = {
		songQ: queue,
		isplay: playing,
		songStatus: Status,
	};
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Gets all command collection
	const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// Only Guild / Server Commands
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	/** If the timestamps Collection doesn't have the message author's ID, set it in with the current
	 * timestamp and create a setTimeout()
	 *	to automatically delete it later, depending on that command's cooldown number.
	 */

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
	/**
	 * heck to see if it's actually expired or not, and return a message letting the user
	 * know how much time is left until they can use that command again if the cooldown hasn't expired
	 * If it has, use the same code as the if statement to set the cooldown again.
	 */
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		// Executes the commands if provides message and args
		command.execute(message, args, client, options);
	}
	catch (error) {
		const embedErr = new Discord.RichEmbed()
			.setTitle('Stalker Errors')
			.addField('** Command Errored **', `${command.name}`)
			.addField('** Error :x:**', 'There was an error trying to execute that command')
			.setDescription(`**Error log:** ${error}`)
			.setTimestamp()
			.setColor('#db3b3b')
			.setFooter('Please contact Support');

		console.error(`New Error log in the guild: ${message.guild.name}, Error log: ${error} Command: ${command.name}`);
		message.reply(embedErr);
	}

	process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
});

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);