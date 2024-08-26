// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Intents, MessageEmbed } = require('discord.js');

// Get secret tokens
const { token } = require('./config.json');

// Axios used for link testing
const axios = require('axios');

// Image classifier function
let Predict;
import('./predict.mjs').then(test => {Predict = test.Predict;});

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Function to check if link is to an image
async function checkImageContentType(imageUrl) {
	try {
		let response = await axios.head(imageUrl);
		let contentType = response.headers['content-type'];

		if (contentType && contentType.startsWith('image'))
			return true;
		else
			return false;
	} catch (error) {
		return false;
	}
}

// Tell us when the client is ready
client.on('ready', async() => {
	client.user.setStatus('invisible');
	console.log('Ready! Logged in as ' + client.user.tag);
});

// Check every message sent
client.on("messageCreate", async (message) =>
{
	console.log(message.createdAt + ' ' + message.author.username + ': ' + message.content);

	if (message.embeds.length > 0) {
		message.embeds.forEach(embed => {
			let url = "";
			if (embed.data.image) {
				url = embed.data.image.proxy_url;
			} else if (embed.data.thumbnail) {
				url = embed.data.thumbnail.proxy_url;
			}
			if (url != "") {
				console.log("Embed found!");
				Predict(url,0.4,0.5).then((result) => {
					if (result) {
						message.delete().then(msg => console.log(`Deleted message from ${msg.author.username} sent at ${msg.createdAt}`))
						.catch(console.error);
						return;
					} else {
						console.log("Embed clean");
					}
				});		
			} else {
				console.log("No embed urls found.");
			}
		});
	}
	
	if (message.attachments.size > 0) {
		message.attachments.forEach(attachment => {
			console.log("Attachment found!");
			if (attachment.contentType.split("/")[0] == "image") {
				console.log("Attachment is an image!");
  		
				const url = attachment.url;
				Predict(url,0.4,0.5).then((result) => {
					if (result) {
						message.delete().then(msg => console.log(`Deleted message from ${msg.author.username} sent at ${msg.createdAt}`))
						.catch(console.error);
						return;
					} else {
						console.log("Attachment clean");
					}
				});
		
			}
		});
	}
	
	// Sometimes link embeds don't load immediately
	const urlRegex = /(https?:\/\/[^\s]+)/gi;
	if (message.content.match(urlRegex)) {
		console.log("Link detected (possibly embed)");
        setTimeout(async () => {
            const fetchedMessage = await message.channel.messages.fetch(message.id);
            if (fetchedMessage.embeds.length > 0) {
                console.log('Embed detected');
                message.embeds.forEach(embed => {
					let url = "";
					if (embed.data.image) {
						url = embed.data.image.proxy_url;
					} else if (embed.data.thumbnail) {
						url = embed.data.thumbnail.proxy_url;
					}
					if (url != "") {
						console.log("Embed found!");
						Predict(url,0.4,0.5).then((result) => {
							if (result) {
								message.delete().then(msg => console.log(`Deleted message from ${msg.author.username} sent at ${msg.createdAt}`))
								.catch(console.error);
								return;
							} else {
								console.log("Embed clean");
							}
						});		
					} else {
						console.log("No embed urls found.");
					}
				});
            } else {
                console.log('No embed detected after fetching.');
            }
        }, 5000); // Wait for 5 seconds
    }

	let splits = message.content.split(` `);
	for (let it = 0; it < splits.length; ++it) {
		checkImageContentType(splits[it]).then(isImage => {
			if (isImage) {
				console.log("Link found");
				Predict(splits[it],0.4,0.5).then((result) => {
					if (result) {
						message.delete().then(msg => console.log(`Deleted message from ${msg.author.username} sent at ${msg.createdAt}`)).catch(console.error);
						return;
					} else {
						console.log("Link clean");
					}
				});
			}
		});
	}
});


// Log in to Discord
client.login(token);


